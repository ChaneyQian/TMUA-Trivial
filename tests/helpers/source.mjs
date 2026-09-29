// 源码级断言的小工具（TS / TSX）：先剥注释、归一空白，再按结构找东西——按语义比，不按排版比。
//
// 为什么要剥注释：守卫接线这类断言原先直接在源码上搜 `if (!settled()) return;`，
// 有人把这句注释掉，字面还在，测试照样全绿（交叉审查 2026-09-29 实测）。
// 为什么要归一空白、按结构取：换行、缩进、属性先后、import 里名字的先后都不改语义，不该让断言红。

/**
 * 去掉 // 行注释与 /* *\/ 块注释。字符串、模板字符串、正则字面量里的 // 与 /* 不算注释；
 * 模板里的 ${…} 照常当代码扫。JSX 的 {/* *\/} 剥完留下一对空花括号，不影响匹配。
 */
export function stripJsComments(src) {
  let out = '';
  const stack = [{ mode: 'code', depth: 0, inTemplate: false }];
  let last = '';
  for (let i = 0; i < src.length; ) {
    const top = stack[stack.length - 1];
    const ch = src[i];
    const nx = src[i + 1];
    if (top.mode === 'template') {
      if (ch === '\\') {
        out += ch + (nx ?? '');
        i += 2;
      } else if (ch === '`') {
        out += ch;
        stack.pop();
        last = '`';
        i++;
      } else if (ch === '$' && nx === '{') {
        out += '${';
        stack.push({ mode: 'code', depth: 1, inTemplate: true });
        last = '{';
        i += 2;
      } else {
        out += ch;
        i++;
      }
      continue;
    }
    if (ch === '/' && nx === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }
    if (ch === '/' && nx === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end < 0 ? src.length : end + 2;
      out += ' ';
      continue;
    }
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < src.length && src[j] !== ch && src[j] !== '\n') j += src[j] === '\\' ? 2 : 1;
      out += src.slice(i, j + 1);
      last = ch;
      i = j + 1;
      continue;
    }
    if (ch === '`') {
      out += ch;
      stack.push({ mode: 'template' });
      i++;
      continue;
    }
    // 正则字面量：前一个有效字符是运算符 / 开括号 / 分隔符时，/ 开的是正则而不是除号
    if (ch === '/' && /[(,=:[!&|?{};]/.test(last || ';')) {
      let j = i + 1;
      let inClass = false;
      while (j < src.length && src[j] !== '\n') {
        if (src[j] === '\\') {
          j += 2;
          continue;
        }
        if (src[j] === '[') inClass = true;
        else if (src[j] === ']') inClass = false;
        else if (src[j] === '/' && !inClass) break;
        j++;
      }
      j++;
      while (j < src.length && /[a-z]/i.test(src[j])) j++;
      out += src.slice(i, j);
      last = '/';
      i = j;
      continue;
    }
    if (ch === '{') top.depth++;
    if (ch === '}') {
      top.depth--;
      if (top.inTemplate && top.depth === 0) {
        stack.pop();
        out += ch;
        last = '}';
        i++;
        continue;
      }
    }
    out += ch;
    if (!/\s/.test(ch)) last = ch;
    i++;
  }
  return out;
}

/** 空白归一：连续空白压成一个空格；( [ 之后、) ] 之前不留空格；闭括号前的尾逗号去掉 */
export function squash(src) {
  return src
    .replace(/\s+/g, ' ')
    .replace(/,\s*([)\]}])/g, ' $1')
    .replace(/([([]) /g, '$1')
    .replace(/ ([)\]])/g, '$1')
    .trim();
}

/** 剥注释 + 归一空白：之后的断言都在这份「代码」上做 */
export const code = (src) => squash(stripJsComments(src));

const CLOSE = { '(': ')', '[': ']', '{': '}' };

/** src[open] 是 ( [ { 之一：返回到与它配对的闭括号为止的整段（含两端）。引号里的括号不算 */
export function balanced(src, open) {
  const opener = src[open];
  const closer = CLOSE[opener];
  if (!closer) throw new Error(`balanced(): 位置 ${open} 上是「${opener}」，不是开括号`);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < src.length && src[j] !== ch) j += src[j] === '\\' ? 2 : 1;
      i = j;
      continue;
    }
    if (ch === opener) depth++;
    else if (ch === closer && --depth === 0) return src.slice(open, i + 1);
  }
  throw new Error('balanced(): 括号没有配平');
}

/** 函数体：`(e) => { … }`、`function f() { … }` → 花括号里面的内容；`() => expr` → expr */
export function fnBody(fn) {
  const arrow = fn.indexOf('=>');
  const from = arrow >= 0 ? arrow + 2 : fn.indexOf(')') + 1;
  const rest = fn.slice(from).trimStart();
  if (!rest.startsWith('{')) return rest;
  return balanced(fn, fn.indexOf('{', from)).slice(1, -1).trim();
}

/** 函数的形参名：`(e) => …` → ['e']；`e => …` → ['e']；`(a: T, b = 1) => …` → ['a', 'b'] */
export function fnParams(fn) {
  const s = fn.trim();
  const bare = s.match(/^(?:async )?(\w+) =>/);
  if (bare) return [bare[1]];
  const list = balanced(s, s.indexOf('(')).slice(1, -1).trim();
  return list ? list.split(',').map((p) => p.trim().match(/^(?:\.\.\.)?(\w+)/)[1]) : [];
}

/**
 * `const name = (…) => { … }`（形参可带类型、可有返回类型）或 `function name(…) { … }` 的整段原文：
 * 形参表 + 函数体，交给 fnParams / fnBody 用。找不到返回 null
 */
export function namedFn(src, name) {
  const arrow = new RegExp(`(?:const|let|var) ${name}(?::[^=]+)? = (?:async )?`).exec(src);
  if (arrow) {
    let i = arrow.index + arrow[0].length;
    const params = src[i] === '(' ? balanced(src, i) : src.slice(i).match(/^\w+/)?.[0];
    if (!params) return null;
    i += params.length;
    const to = src.slice(i).match(/^\s*(?::\s*[^=]+?)?\s*=>\s*/);
    if (!to) return null;
    i += to[0].length;
    const body = src[i] === '{' ? balanced(src, i) : src.slice(i, src.indexOf(';', i));
    return `${params} => ${body}`;
  }
  const decl = new RegExp(`function ${name}\\s*\\(`).exec(src);
  if (decl) {
    const open = decl.index + decl[0].length - 1;
    const params = balanced(src, open);
    const at = src.indexOf('{', open + params.length);
    return `${params} ${balanced(src, at)}`;
  }
  return null;
}

/** `import { a, b as c } from 'x'` 里导入的名字（按本地名）。没有这条 import 返回空集 */
export function namedImports(src, from) {
  const names = new Set();
  const esc = from.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  for (const m of code(src).matchAll(new RegExp(`import (?:type )?\\{([^}]*)\\} from ['"]${esc}['"]`, 'g'))) {
    for (const part of m[1].split(',')) {
      const name = part.trim().replace(/^type /, '').split(/ as /).pop().trim();
      if (name) names.add(name);
    }
  }
  return names;
}

function readOpening(src, start) {
  const name = src.slice(start + 1).match(/^[\w.]+/)?.[0];
  if (!name) return null;
  const attrs = new Map();
  let i = start + 1 + name.length;
  while (i < src.length) {
    while (/\s/.test(src[i])) i++;
    if (src[i] === '>') return { name, attrs, start, end: i + 1, selfClosing: false };
    if (src[i] === '/' && src[i + 1] === '>') return { name, attrs, start, end: i + 2, selfClosing: true };
    if (src[i] === '{') {
      i += balanced(src, i).length; // {...props}
      continue;
    }
    const attr = src.slice(i).match(/^[\w:-]+/)?.[0];
    if (!attr) return null;
    i += attr.length;
    while (/\s/.test(src[i])) i++;
    if (src[i] !== '=') {
      attrs.set(attr, true);
      continue;
    }
    i++;
    while (/\s/.test(src[i])) i++;
    if (src[i] === '"' || src[i] === "'") {
      const end = src.indexOf(src[i], i + 1);
      attrs.set(attr, src.slice(i, end + 1));
      i = end + 1;
    } else if (src[i] === '{') {
      const value = balanced(src, i);
      attrs.set(attr, value);
      i += value.length;
    } else return null;
  }
  return null;
}

/**
 * JSX 开始标签：从 anchor（标签里的一段字面，比如 `className={styles.hit}`）出发，往回找到它所在的 `<tag`，
 * 往后读到收尾的 `>`（属性值花括号里的 `=>` 不算）。返回 { name, attrs, start, end, selfClosing }，
 * attrs 是 Map：属性名 → 原样的值（`"…"` 或 `{…}`；布尔属性为 true）
 */
export function jsxOpening(src, anchor, from = 0) {
  const at = src.indexOf(anchor, from);
  if (at < 0) return null;
  for (let start = src.lastIndexOf('<', at); start >= 0; start = src.lastIndexOf('<', start - 1)) {
    if (!/[A-Za-z]/.test(src[start + 1] ?? '')) continue;
    const tag = readOpening(src, start);
    if (tag && tag.end > at) return tag;
  }
  return null;
}

/** 所有 className 里带 `styles.<cls>` 的开始标签（属性写在哪个位置都行） */
export function jsxByClass(src, cls) {
  const out = [];
  for (const m of src.matchAll(new RegExp(`styles\\.${cls}\\b`, 'g'))) {
    const tag = jsxOpening(src, m[0], m.index);
    const className = tag && tag.attrs.get('className');
    if (typeof className === 'string' && new RegExp(`styles\\.${cls}\\b`).test(className) && !out.some((t) => t.start === tag.start)) {
      out.push(tag);
    }
  }
  return out;
}

/** 开始标签对应元素的子内容（开始标签的 > 之后、配对的 </name> 之前）。自闭合标签返回 '' */
export function jsxChildren(src, opening) {
  if (opening.selfClosing) return '';
  const open = `<${opening.name}`;
  const close = `</${opening.name}>`;
  let depth = 1;
  let i = opening.end;
  while (i < src.length) {
    const nextClose = src.indexOf(close, i);
    if (nextClose < 0) break;
    const nextOpen = src.indexOf(open, i);
    if (nextOpen >= 0 && nextOpen < nextClose && /[\s/>]/.test(src[nextOpen + open.length] ?? '')) {
      const tag = readOpening(src, nextOpen);
      if (tag && !tag.selfClosing) depth++;
      i = tag ? tag.end : nextOpen + open.length;
      continue;
    }
    if (--depth === 0) return src.slice(opening.end, nextClose);
    i = nextClose + close.length;
  }
  throw new Error(`jsxChildren(): <${opening.name}> 没有配对的闭合标签`);
}

/** JSX 属性值：`{…}` 去掉外层花括号，`"…"` 去掉引号，布尔属性原样返回 true */
export function attrValue(raw) {
  if (raw === true || raw == null) return raw;
  const s = String(raw).trim();
  if (s.startsWith('{')) return s.slice(1, -1).trim();
  if (s.startsWith('"') || s.startsWith("'")) return s.slice(1, -1);
  return s;
}

/** 调用 `callee(` 的每一处：{ at, args }（args 是括号里的原文）。`x.callee(` 不算 */
export function calls(src, callee) {
  const out = [];
  const re = new RegExp(`(?<![\\w.$])${callee.replace(/[.$]/g, '\\$&')}\\(`, 'g');
  for (const m of src.matchAll(re)) {
    const open = m.index + m[0].length - 1;
    out.push({ at: m.index, args: balanced(src, open).slice(1, -1).trim() });
  }
  return out;
}

/** useEffect（或别的 effect 钩子）的每一处：{ body：回调的函数体, deps：依赖名数组（没写依赖为 null） } */
export function effects(src, hook = 'useEffect') {
  return calls(src, hook).map(({ args }) => {
    const arrow = args.indexOf('=>');
    const brace = args.indexOf('{', arrow);
    const block = arrow >= 0 && brace >= 0 && args.slice(arrow + 2, brace).trim() === '';
    const fnEnd = block ? brace + balanced(args, brace).length : args.length;
    const rest = args.slice(fnEnd).replace(/^\s*,\s*/, '').trim();
    const deps = rest.startsWith('[')
      ? rest
          .slice(1, rest.indexOf(']'))
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean)
      : null;
    return { body: fnBody(args.slice(0, fnEnd)), deps };
  });
}
