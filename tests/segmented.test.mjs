import assert from 'node:assert/strict';
import test from 'node:test';

// 分段单选组的纯逻辑（lib/segmented）：键盘、roving tabindex 的 Tab 位、滑动指示块的落点。
// 组件（components/setup/SegmentedGroup）只把这三样接到 DOM 上，接线另见 setup.test。
import { indicatorBox, nextSegIndex, sameBox, tabStopIndex } from '../src/lib/segmented.ts';

const enabled = (n) => Array.from({ length: n }, () => false);

test('arrow keys step through the group and wrap around at both ends', () => {
  const none = enabled(3);
  // → / ↓ 下一项，到尾绕回第一项
  assert.equal(nextSegIndex(0, 'ArrowRight', none), 1);
  assert.equal(nextSegIndex(1, 'ArrowRight', none), 2);
  assert.equal(nextSegIndex(2, 'ArrowRight', none), 0);
  assert.equal(nextSegIndex(2, 'ArrowDown', none), 0);
  // ← / ↑ 上一项，到头绕回最后一项
  assert.equal(nextSegIndex(0, 'ArrowLeft', none), 2);
  assert.equal(nextSegIndex(2, 'ArrowLeft', none), 1);
  assert.equal(nextSegIndex(0, 'ArrowUp', none), 2);
  // 竖着的两个键与横着的两个等价
  for (let i = 0; i < 3; i++) {
    assert.equal(nextSegIndex(i, 'ArrowDown', none), nextSegIndex(i, 'ArrowRight', none));
    assert.equal(nextSegIndex(i, 'ArrowUp', none), nextSegIndex(i, 'ArrowLeft', none));
  }
});

test('Home and End jump to the first and last item that can take focus', () => {
  assert.equal(nextSegIndex(1, 'Home', enabled(4)), 0);
  assert.equal(nextSegIndex(1, 'End', enabled(4)), 3);
  // 两头被禁用：落到最靠外的可用项
  const ends = [true, false, false, true];
  assert.equal(nextSegIndex(2, 'Home', ends), 1);
  assert.equal(nextSegIndex(1, 'End', ends), 2);
  // 已经在头 / 尾上再按：原地不动（仍返回它，调用方照常拦默认行为）
  assert.equal(nextSegIndex(0, 'Home', enabled(3)), 0);
  assert.equal(nextSegIndex(2, 'End', enabled(3)), 2);
});

test('disabled items are skipped both ways, including across the wrap', () => {
  // 题库那组：0 题的库是禁用的
  const bank = [false, true, false, true, false];
  assert.equal(nextSegIndex(0, 'ArrowRight', bank), 2);
  assert.equal(nextSegIndex(2, 'ArrowRight', bank), 4);
  assert.equal(nextSegIndex(4, 'ArrowRight', bank), 0, '绕回时也跳过');
  assert.equal(nextSegIndex(0, 'ArrowLeft', bank), 4);
  assert.equal(nextSegIndex(4, 'ArrowLeft', bank), 2);
  // 头尾都禁用：绕回时跨过两头
  const inner = [true, false, false, true];
  assert.equal(nextSegIndex(2, 'ArrowRight', inner), 1);
  assert.equal(nextSegIndex(1, 'ArrowLeft', inner), 2);
});

test('an all-disabled group takes no keys, and neither does an empty one', () => {
  for (const key of ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']) {
    assert.equal(nextSegIndex(0, key, [true, true, true]), null, `${key} 在全禁用的组里不该有动作`);
    assert.equal(nextSegIndex(0, key, []), null, `${key} 在空组里不该有动作`);
  }
});

test('a single usable item keeps the focus where it is', () => {
  for (const key of ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']) {
    assert.equal(nextSegIndex(0, key, [false]), 0, `单项组按 ${key}`);
    assert.equal(nextSegIndex(1, key, [true, false, true]), 1, `只剩一个可用项时按 ${key}`);
  }
});

test('keys that are not part of the contract are left to the browser', () => {
  for (const key of ['Enter', ' ', 'Spacebar', 'Tab', 'Escape', 'PageDown', 'PageUp', 'a', '1', '']) {
    assert.equal(nextSegIndex(1, key, enabled(3)), null, `「${key}」不归单选组管`);
  }
});

test('from outside the range the arrows enter at the near end', () => {
  // 防御：焦点不在任何一项上时（-1、越界、NaN），→ 进第一个可用项，← 进最后一个
  for (const current of [-1, 3, 99, Number.NaN]) {
    assert.equal(nextSegIndex(current, 'ArrowRight', [true, false, false]), 1);
    assert.equal(nextSegIndex(current, 'ArrowLeft', [false, false, true]), 1);
  }
});

test('every usable item is reached exactly once per lap, and left undoes right', () => {
  // 穷举 1–6 项的全部禁用组合：按 → 走满「可用项个数」步必须回到起点、且一圈里每个可用项各到一次
  for (let n = 1; n <= 6; n++) {
    for (let mask = 0; mask < 1 << n; mask++) {
      const disabled = Array.from({ length: n }, (_, i) => Boolean(mask & (1 << i)));
      const usable = disabled.map((d, i) => (d ? -1 : i)).filter((i) => i >= 0);
      if (usable.length === 0) continue;
      for (const start of usable) {
        const seen = [];
        let at = start;
        for (let k = 0; k < usable.length; k++) {
          at = nextSegIndex(at, 'ArrowRight', disabled);
          assert.equal(disabled[at], false, `落到了禁用项上（${disabled}，从 ${start}）`);
          seen.push(at);
        }
        assert.equal(at, start, `一圈没回到起点（${disabled}）`);
        assert.deepEqual([...seen].sort((a, b) => a - b), usable, `一圈里有项重复或缺席（${disabled}）`);
        assert.equal(nextSegIndex(nextSegIndex(start, 'ArrowRight', disabled), 'ArrowLeft', disabled), start);
      }
    }
  }
});

test('the group keeps exactly one tab stop: the checked item, else the first usable one', () => {
  assert.equal(tabStopIndex(2, enabled(3)), 2, '有选中项：Tab 停在它身上');
  assert.equal(tabStopIndex(-1, enabled(3)), 0, '没有选中项（题数填了个不在预设里的数）：停在第一项');
  assert.equal(tabStopIndex(-1, [true, false, false]), 1, '第一项禁用：停在第一个可用项');
  // 选中项自己被禁用了（比如「仅逻辑题」把当前库清空）：它拿不到焦点，Tab 位让给第一个可用项
  assert.equal(tabStopIndex(0, [true, false, false]), 1);
  assert.equal(tabStopIndex(5, enabled(3)), 0, '越界的选中项当没有');
  assert.equal(tabStopIndex(0, [true, true]), -1, '全禁用：整组没有 Tab 位');
  assert.equal(tabStopIndex(-1, []), -1);
});

test('the sliding block sits on the checked item, and only while the items share one row', () => {
  const row = [
    { x: 0, y: 0, w: 80, h: 44 },
    { x: 88, y: 0, w: 110, h: 44 },
    { x: 206, y: 0, w: 70, h: 44 },
  ];
  assert.deepEqual(indicatorBox(row, 1), { x: 88, y: 0, w: 110, h: 44 });
  assert.deepEqual(indicatorBox(row, 2), row[2]);
  assert.notEqual(indicatorBox(row, 0), row[0], '返回一份拷贝，调用方改它不回写到量出来的数据');

  // 折成两行：哪一项被选中都不画（位置算出来也是错的），选中项自己带底色
  const wrapped = [row[0], row[1], { x: 0, y: 52, w: 70, h: 44 }];
  for (let i = 0; i < wrapped.length; i++) assert.equal(indicatorBox(wrapped, i), null);

  // 没有选中项、越界、还没排版：都不画
  assert.equal(indicatorBox(row, -1), null);
  assert.equal(indicatorBox(row, 3), null);
  assert.equal(indicatorBox(row, Number.NaN), null);
  assert.equal(indicatorBox([], 0), null);
  assert.equal(indicatorBox([{ x: 0, y: 0, w: 0, h: 0 }], 0), null);

  // 单项组也是「一行」
  assert.deepEqual(indicatorBox([{ x: 0, y: 0, w: 40, h: 30 }], 0), { x: 0, y: 0, w: 40, h: 30 });
});

test('sameBox compares position and size, and treats two missing boxes as the same', () => {
  const a = { x: 1, y: 2, w: 3, h: 4 };
  assert.equal(sameBox(a, { ...a }), true);
  for (const key of ['x', 'y', 'w', 'h']) assert.equal(sameBox(a, { ...a, [key]: a[key] + 1 }), false, key);
  assert.equal(sameBox(null, null), true);
  assert.equal(sameBox(a, null), false);
  assert.equal(sameBox(null, a), false);
});
