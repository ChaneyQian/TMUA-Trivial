import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

// 配置面板（components/setup/SetupPanel）与分段单选组（components/setup/SegmentedGroup）的接线（Design §22 P8-A3）。
// 按键落到第几项、Tab 位在哪、指示块画在哪是 lib/segmented 的纯函数，行为见 segmented.test；
// 这里盯的是它们真的接上了：五组 + 复烤区两组都是单选组、组名指对了、按键处理真按契约走。
import { DICT } from '../src/lib/i18n.ts';
import { nextSegIndex } from '../src/lib/segmented.ts';
import { segmentedGroups } from './helpers/segmented-groups.mjs';
import { attrValue, code, fnBody, fnParams, jsxChildren, jsxOpening, namedFn } from './helpers/source.mjs';

const GROUP = 'src/components/setup/SegmentedGroup.tsx';
const PANEL = 'src/components/setup/SetupPanel.tsx';
const GRILL = 'src/components/grill/GrillPanel.tsx';
const EXAM = 'src/components/exam/ExamApp.tsx';

const read = (file) => code(fs.readFileSync(file, 'utf8'));

/**
 * className 里带 `<任意样式表>.cls` 的开始标签：styles.x、examStyles.x、panelStyles.x 都算
 * （helpers/source 的 jsxByClass 只认叫 styles 的那一份）
 */
function tagsWithClass(src, cls) {
  const out = [];
  for (const match of src.matchAll(new RegExp(String.raw`\b\w*[sS]tyles\.${cls}\b`, 'g'))) {
    const tag = jsxOpening(src, match[0], match.index);
    const className = tag && tag.attrs.get('className');
    if (typeof className !== 'string' || !new RegExp(String.raw`[sS]tyles\.${cls}\b`).test(className)) continue;
    if (!out.some((seen) => seen.start === tag.start)) out.push(tag);
  }
  return out;
}

test('the five setup fields are radio groups, each named by its own field label', () => {
  const panel = read(PANEL);
  const groups = segmentedGroups(panel);
  // 值 → [改值的回调, 组标题里写的字典键]
  const expected = new Map([
    ['db', ['setDb', '{t.setup.fieldBank}']],
    ['logicFilter', ['chooseLogicReasoning', '{t.setup.logicReasoning}']],
    ['mode', ['setMode', '{t.setup.fieldMode}']],
    ['pickMode', ['setPickMode', '{t.setup.fieldPick}']],
    ['count', ['setCountAnd', '{t.setup.fieldCount(totalPool)}']],
  ]);
  assert.deepEqual(groups.map((g) => g.value).sort(), [...expected.keys()].sort(), '题库 / 逻辑推理 / 模式 / 抽题范围 / 题数，一组不多一组不少');
  for (const group of groups) {
    const [onChange, label] = expected.get(group.value);
    assert.equal(group.onChange, onChange, `${group.value} 那组改值得走 ${onChange}`);
    assert.equal(group.label, label, `${group.value} 那组的组名（aria-labelledby 指向的标题）不对`);
    assert.equal(group.tag.selfClosing, true);
  }
  assert.equal(new Set(groups.map((g) => g.labelledBy)).size, groups.length, '每组的组标题 id 各不相同');

  // 面板里不再有手搓的分段按钮：选项一律出自 SegmentedGroup
  assert.equal(tagsWithClass(panel, 'segBtn').length, 0, '配置面板里还有没进单选组的分段按钮');
  assert.equal(panel.includes('aria-pressed'), false, '单选组用 aria-checked 报选中态，不再用 aria-pressed');

  // 题数那组的选项就是三档预设；其余四组的选项各对各的字段
  const count = groups.find((g) => g.value === 'count');
  assert.match(count.options, /^\[5, 10, 20\]\.map\(/);
});

test('the grill panel uses the same radio group for its two fields', () => {
  const grill = read(GRILL);
  const groups = segmentedGroups(grill);
  const byValue = new Map(groups.map((g) => [g.value, g]));
  assert.equal(groups.length, 2);
  assert.equal(byValue.get('pickMode')?.onChange, 'onPickMode');
  assert.equal(byValue.get('pickMode')?.label, '{t.setup.fieldPick}');
  assert.equal(byValue.get('count')?.onChange, 'onCount');
  assert.equal(byValue.get('count')?.label, '{t.grill.fieldCount(available)}');
  assert.equal(tagsWithClass(grill, 'segBtn').length, 0, '复烤区里还有没进单选组的分段按钮');
  // 大厅里别处也不许再手搓一份
  assert.equal(tagsWithClass(read(EXAM), 'segBtn').length, 0);
  // 分段按钮的样子只剩 SegmentedGroup 这一个出处
  assert.equal(tagsWithClass(read(GROUP), 'segBtn').length, 1);
});

test('the custom count box sits outside the radio group, with a tab stop and a name of its own', () => {
  const panel = read(PANEL);
  const input = jsxOpening(panel, 'value={count}', panel.indexOf('<input'));
  assert.ok(input && input.name === 'input', '找不到题数输入框');
  // 不在单选组里：组是自闭合的 <SegmentedGroup />，框是它的兄弟，排在同一行
  const count = segmentedGroups(panel).find((g) => g.value === 'count');
  assert.ok(count.tag.end <= input.start, '题数框得排在三档之后');
  const [row] = tagsWithClass(panel, 'countRow');
  assert.ok(row, '三档与题数框共用一行容器');
  const rowKids = jsxChildren(panel, row);
  assert.ok(rowKids.includes('<SegmentedGroup') && rowKids.includes('value={count}'), '三档与题数框都在这一行里');
  // 自己一个 Tab 位：不许被挪出 Tab 序
  assert.equal(input.attrs.has('tabIndex'), false, '题数框走自然 Tab 序');
  // 读屏得念得出它是什么（它不在组里，组名不管它）
  assert.equal(attrValue(input.attrs.get('aria-label')), 't.setup.countCustom');
  for (const lang of ['zh', 'en']) {
    assert.ok(DICT[lang].setup.countCustom.trim(), `${lang} 缺 countCustom`);
  }
  assert.notEqual(DICT.zh.setup.countCustom, DICT.en.setup.countCustom);
  // 限时框同理，名字取它上面那个字段标题
  const minutes = jsxOpening(panel, 'value={minutes}');
  const minutesLabel = attrValue(minutes.attrs.get('aria-labelledby'));
  assert.ok(minutesLabel, '限时框得指向它的字段标题');
  const minutesTitle = jsxOpening(panel, `id={${minutesLabel}}`);
  assert.equal(jsxChildren(panel, minutesTitle).trim(), '{t.setup.fieldMinutes}');
});

test('SegmentedGroup renders the ARIA radio group contract with a roving tab stop', () => {
  const group = read(GROUP);
  const root = jsxOpening(group, 'role="radiogroup"');
  assert.ok(root, '组容器得是 role="radiogroup"');
  assert.equal(attrValue(root.attrs.get('aria-labelledby')), 'labelledBy', '组名指向组标题');

  const item = jsxOpening(group, 'role="radio"');
  assert.ok(item && item.name === 'button', '每一项是 role="radio" 的按钮');
  assert.equal(attrValue(item.attrs.get('type')), 'button');
  // 选中项 = 值对得上的那一项；Tab 位 = lib/segmented 的 tabStopIndex（选中项，否则第一个可用项）
  const checkedDecl = /const (\w+) = options\.findIndex\(\((\w+)\) => \2\.value === value\);/.exec(group);
  assert.ok(checkedDecl, '选中项得按 value 在 options 里找');
  const checked = checkedDecl[1];
  const disabledDecl = /const (\w+) = options\.map\(\((\w+)\) => Boolean\(\2\.disabled\)\);/.exec(group);
  assert.ok(disabledDecl, '禁用表得按 options 逐项取');
  const tabDecl = new RegExp(`const (\\w+) = tabStopIndex\\(${checked}, ${disabledDecl[1]}\\);`).exec(group);
  assert.ok(tabDecl, 'Tab 位得交给 tabStopIndex');
  const index = /options\.map\(\((\w+), (\w+)\) =>/.exec(group);
  assert.ok(index, '选项按下标渲染');
  const [, option, i] = index;
  assert.equal(attrValue(item.attrs.get('aria-checked')), `${i} === ${checked}`);
  assert.equal(attrValue(item.attrs.get('tabIndex')), `${i} === ${tabDecl[1]} ? 0 : -1`, '整组只有一个 tabIndex=0');
  assert.equal(attrValue(item.attrs.get('disabled')), `${option}.disabled`);
  assert.equal(attrValue(item.attrs.get('onClick')), `() => onChange(${option}.value)`);
  // 按键交给 onKeyDown(事件, 这一项的下标)；焦点靠 ref 挪，ref 回调把节点记在同一个下标上
  const onKeyDown = attrValue(item.attrs.get('onKeyDown'));
  assert.match(onKeyDown, new RegExp(`^\\((\\w+)\\) => onKeyDown\\(\\1, ${i}\\)$`));
  assert.match(fnBody(attrValue(item.attrs.get('ref'))), new RegExp(`^itemRefs\\.current\\[${i}\\] = \\w+;$`));
});

test('arrow keys move focus and selection together, and keys outside the contract are left alone', () => {
  const group = read(GROUP);
  const handler = namedFn(group, 'onKeyDown');
  assert.ok(handler, '找不到 onKeyDown');
  const [eventName, indexName] = fnParams(handler);
  // 把处理函数原样跑起来：闭包里用到的几样（禁用表、选中项、ref、选项、回调、纯函数）由这里递进去
  const run = new Function(
    eventName,
    indexName,
    'disabled',
    'checked',
    'itemRefs',
    'options',
    'onChange',
    'nextSegIndex',
    fnBody(handler),
  );
  const setup = (disabledList, checked) => {
    const focused = [];
    const changed = [];
    const buttons = disabledList.map((_, i) => ({ focus: () => focused.push(i) }));
    const options = disabledList.map((d, i) => ({ value: `v${i}`, disabled: d }));
    const press = (index, key, mods = {}) => {
      let prevented = false;
      const event = { key, altKey: false, ctrlKey: false, metaKey: false, shiftKey: false, ...mods, preventDefault: () => (prevented = true) };
      run(event, index, disabledList, checked, { current: buttons }, options, (v) => changed.push(v), nextSegIndex);
      return prevented;
    };
    return { focused, changed, press };
  };

  // 跳过禁用项、选择跟随焦点、拦下默认行为（页面不滚）
  let g = setup([false, true, false], 0);
  assert.equal(g.press(0, 'ArrowRight'), true);
  assert.deepEqual(g.focused, [2]);
  assert.deepEqual(g.changed, ['v2']);
  // 绕回、上 / 下键
  g = setup([false, false, false], 2);
  g.press(2, 'ArrowDown');
  g.press(0, 'ArrowUp');
  assert.deepEqual(g.focused, [0, 2]);
  assert.deepEqual(g.changed, ['v0'], '落回已选中的那一项不再重复改值');
  // Home / End
  g = setup([true, false, false, true], 1);
  g.press(1, 'End');
  g.press(2, 'Home');
  assert.deepEqual(g.focused, [2, 1]);
  assert.deepEqual(g.changed, ['v2']);
  // 不是契约里的键、带修饰键的组合：什么都不做，也不拦默认行为（Enter / 空格归按钮自己，Alt+← 是后退）
  g = setup([false, false, false], 0);
  for (const [key, mods] of [
    ['Enter', {}],
    [' ', {}],
    ['Tab', {}],
    ['ArrowRight', { altKey: true }],
    ['ArrowRight', { ctrlKey: true }],
    ['Home', { metaKey: true }],
  ]) {
    assert.equal(g.press(0, key, mods), false, `${key} ${JSON.stringify(mods)} 不该被拦`);
  }
  assert.deepEqual(g.focused, []);
  assert.deepEqual(g.changed, []);
  // 全禁用：按键无动作
  g = setup([true, true], -1);
  assert.equal(g.press(0, 'ArrowRight'), false);
  assert.deepEqual([g.focused, g.changed], [[], []]);
});
