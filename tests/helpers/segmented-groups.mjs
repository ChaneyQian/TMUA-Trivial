// 找出源码里每一处 <SegmentedGroup …/>（分段单选组，components/setup/SegmentedGroup）的接线：
// 属性的原文值，外加它 aria-labelledby 指向的那个组标题元素里写的是什么。
// 在 code()（剥注释、归一空白）处理过的源码上用：属性先后、换行、缩进都不影响。
import { attrValue, jsxChildren, jsxOpening } from './source.mjs';

/**
 * [{ tag, value, onChange, options, labelledBy, label, className }]：
 * value / onChange / options / labelledBy / className 是去掉外层花括号的原文；
 * label 是 id 等于 labelledBy 的那个元素的子内容（找不到为 null）
 */
export function segmentedGroups(src) {
  const out = [];
  for (const match of src.matchAll(/<SegmentedGroup\b/g)) {
    const tag = jsxOpening(src, '<SegmentedGroup', match.index);
    if (!tag) continue;
    const attr = (name) => attrValue(tag.attrs.get(name)) ?? null;
    const labelledBy = attr('labelledBy');
    let label = null;
    if (labelledBy) {
      const anchor = `id={${labelledBy}}`;
      const labelTag = src.includes(anchor) ? jsxOpening(src, anchor) : null;
      if (labelTag) label = jsxChildren(src, labelTag).trim();
    }
    out.push({
      tag,
      value: attr('value'),
      onChange: attr('onChange'),
      options: attr('options'),
      labelledBy,
      label,
      className: attr('className'),
    });
  }
  return out;
}
