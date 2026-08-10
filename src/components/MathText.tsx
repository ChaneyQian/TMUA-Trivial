import katex from 'katex';
import { marked } from 'marked';
import { EXAM_DATA } from '@/lib/config';

/** 图片文件名 → 预生成的静态路径（构建脚本已把引用到的图片拍平到 exam\img\） */
function imgUrl(filename: string): string {
  return `${EXAM_DATA}/img/${encodeURIComponent(filename.split('/').pop() || filename)}`;
}

/** 把图片引用替换为静态资源路径 */
function replaceImages(text: string): string {
  // Obsidian 格式 ![[Image/xxx|NNN]]（兼容旧 images/）
  text = text.replace(
    /!\[\[(?:Image|images)\/([^\]|]+)(?:\|(\d+))?\]\]/g,
    (_, filename: string, width?: string) => {
      const widthStyle = width ? `width:${width}px;` : 'max-width:100%;';
      return `<img src="${imgUrl(filename)}" alt="${filename}" style="${widthStyle}display:block;margin:0.5rem auto;" />`;
    }
  );
  // 标准 Markdown 格式 ![...](Image/xxx.jpg)（alt 可能为宽度数字）
  text = text.replace(
    /!\[([^\]]*)\]\((?:Image|images)\/([^)]+)\)/g,
    (_, alt: string, filename: string) => {
      const width = parseInt(alt, 10);
      if (!isNaN(width) && width > 0) {
        return `<img src="${imgUrl(filename)}" alt="" style="width:${width}px;display:block;margin:0.5rem auto;" />`;
      }
      return `<img src="${imgUrl(filename)}" alt="${alt}" style="max-width:100%;display:block;margin:0.5rem auto;" />`;
    }
  );
  return text;
}

/** 把文本中的 \$ 转义恢复为普通的 $ */
const DOLLAR_ESC = '\x00DOLLAR\x00';
const MATH_PLACEHOLDER = '\x00MATH\x00';

interface MathSlot {
  formula: string;
  displayMode: boolean;
}

/**
 * 让 \text{} 里的整句话能正常折行。
 *
 * TMUA/ECAA 有大量「整句英文包在 \text{} 里当行内公式」的选项，KaTeX 会把
 * 文本模式的空格渲染成 &nbsp;，于是一整句话变成一个不可断的长盒子，选项框只能
 * 横向滚动。光加 white-space: normal 不管用——不间断空格本身就不产生断行机会，
 * 必须把它换回普通空格（配套的 CSS 在 globals.css 的 .mathtext .katex .text）。
 *
 * 只动 mord 系 span 里的纯文本节点：数学原子（mathnormal 等）内是字母数字，
 * 不含 &nbsp;，替换对它们是空操作；\text{} 之外的间距由 mspace 的 margin 控制，
 * 不受影响。代价是文本模式里显式写的 ~ 会失去不间断语义，本题库无此用法。
 */
function softenTextSpaces(html: string): string {
  return html.replace(
    /(<span class="mord[^"]*">)([^<]*)/g,
    (_m, open: string, body: string) => open + body.replace(/ /g, ' ')
  );
}

/** 渲染含图片、Markdown、数学公式的文本 */
function renderContent(text: string): string {
  // 1. 替换图片
  text = replaceImages(text);

  // 2. 保护已转义的 \$
  text = text.replace(/\\\$/g, DOLLAR_ESC);

  // 3. 提取所有 $ 公式块，换成占位符（避免 marked 破坏公式）
  const mathSlots: MathSlot[] = [];
  // 先匹配 $$...$$，再匹配 $...$
  const mathRegex = /(\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$)/;
  let idx = 0;
  while (true) {
    const m = mathRegex.exec(text);
    if (!m) break;
    const isDisplay = !!m[1]?.startsWith('$$');
    const formula = isDisplay ? m[2] : m[3];
    mathSlots.push({ formula, displayMode: isDisplay });
    text = text.slice(0, m.index) + `${MATH_PLACEHOLDER}${idx}__` + text.slice(m.index + m[0].length);
    idx++;
  }

  // 3.3 图注居中：紧跟在图片后的 "Figure X" / "图 X" 短行 → 居中显示
  text = text.replace(
    /(<img [^>]+\/>)[ \t]*\r?\n[ \t]*((?:Figure|图)[^\n<]{0,40})(\r?\n|$)/g,
    (_, img: string, caption: string, tail: string) =>
      `${img}\n<div style="text-align:center;margin:-0.3rem 0 0.5rem;">${caption.trim()}</div>${tail}`
  );

  // 3.5 行首 tab（小问层级缩进）→ 定宽占位 span
  //     公式已抽出，此时行首 tab 只会出现在 (a)(b) 等标号行；
  //     转成 span 既能显示层级缩进，又避免 markdown 把缩进行当成代码块
  text = text.replace(/^(\t+)/gm, (_, tabs: string) =>
    `<span style="display:inline-block;width:${tabs.length * 1.6}em"></span>`
  );

  // 4. Markdown → HTML
  text = marked.parse(text, { breaks: true }) as string;

  // 4.5 定理框（design.md §2.4）：导语段落套 amsthm 风格
  //     语料现状：斜体导语暂无，粗体 **Note**/**Note 1** 是实际用法（Euclid/STEP 解析）；两种都认
  text = text.replace(
    /<p><(em|strong)>(Theorem|Lemma|Claim|Proof|Attempted proof|Conjecture|Commentary|Remark|Note(?:\s+\d+)?)\s*[:：]?<\/\1>[:：]?/gi,
    (_m, _tag: string, kw: string) => `<p class="thmbox"><em>${kw}:</em>`
  );

  // 5. 恢复 \$ → $
  text = text.replace(new RegExp(DOLLAR_ESC, 'g'), '$');

  // 6. 把占位符替换为 KaTeX 渲染结果
  for (let i = 0; i < mathSlots.length; i++) {
    const slot = mathSlots[i];
    try {
      // 公式内的 \$（货币）占位符还原——KaTeX math 模式支持 \$，之前漏还原导致占位控制符进 KaTeX 报错
      const formula = slot.formula.replace(new RegExp(DOLLAR_ESC, 'g'), () => '\\$');
      const html = katex.renderToString(formula, {
        displayMode: slot.displayMode,
        throwOnError: false,
        // 兜底宏：转换脚本已展开 mathexam.cls 宏，这里只兜未展开的漏网情况
        macros: {
          '\\le': '\\leqslant',
          '\\ge': '\\geqslant',
          '\\ud': '\\,\\mathrm{d}',
          '\\ds': '\\displaystyle',
          '\\ts': '\\textstyle',
          '\\half': '\\tfrac12',
          '\\cosec': '\\operatorname{cosec}',
          '\\arcosh': '\\operatorname{arcosh}',
          '\\arsinh': '\\operatorname{arsinh}',
          '\\artanh': '\\operatorname{artanh}',
        },
      });
      text = text.replace(`${MATH_PLACEHOLDER}${i}__`, softenTextSpaces(html));
    } catch {
      text = text.replace(`${MATH_PLACEHOLDER}${i}__`, slot.formula);
    }
  }

  return text;
}

export default function MathText({ text }: { text: string }) {
  return (
    <div
      className="mathtext"
      dangerouslySetInnerHTML={{ __html: renderContent(text) }}
      style={{ color: 'var(--katex-color)' }}
    />
  );
}
