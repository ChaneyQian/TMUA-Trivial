import assert from 'node:assert/strict';
import test from 'node:test';

// 分段单选组的纯逻辑（lib/segmented）：键盘、roving tabindex 的 Tab 位、滑动指示块的落点。
// 组件（components/setup/SegmentedGroup）只把这三样接到 DOM 上，接线另见 setup.test。
import { indicatorBox, nextSegIndex, placeIndicator, sameBox, tabStopIndex } from '../src/lib/segmented.ts';

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

// ---- 指示块的摆放（placeIndicator）：拿普通对象代替 DOM，记下它写了什么、按什么顺序写 ----

const item = (x, y, w, h, disabled = false) => ({ offsetLeft: x, offsetTop: y, offsetWidth: w, offsetHeight: h, disabled });

/** 组容器与指示块的替身。log 按先后记下：改过渡、写变量（连同当时的过渡值）、读 offsetWidth（逼样式先算掉） */
function stage() {
  const log = [];
  let transition = '';
  const bar = {
    dataset: {},
    style: {
      get transition() {
        return transition;
      },
      set transition(value) {
        transition = value;
        log.push(['transition', value]);
      },
      setProperty: (name, value) => log.push(['set', name, value, transition]),
    },
    get offsetWidth() {
      log.push(['flush', transition]);
      return 100;
    },
  };
  return { row: { dataset: {} }, bar, log };
}

test('the first placement lands in place without a slide, then hands the transition back', () => {
  const { row, bar, log } = stage();
  const items = [item(0, 0, 80, 44), item(88, 0, 110, 44)];
  for (const animate of [false, true]) {
    log.length = 0;
    // 首帧（shown 为 null）：就算调用方说要滑，也无处可滑，一律就地摆
    const shown = placeIndicator(row, bar, items, 1, null, animate);
    assert.deepEqual(shown, { x: 88, y: 0, w: 110, h: 44 });
    assert.equal(row.dataset.slide, 'on', '摆好之后指示块在场');
    assert.deepEqual(log, [
      ['transition', 'none'],
      ['set', '--seg-x', '88px', 'none'],
      ['set', '--seg-y', '0px', 'none'],
      ['set', '--seg-w', '110px', 'none'],
      ['set', '--seg-h', '44px', 'none'],
      ['flush', 'none'],
      ['transition', ''],
    ], '先关过渡、写值、逼浏览器按「没有过渡」算掉，再把过渡交还');
  }
});

test('a new selection slides: only the new position is written, the transition is left alone', () => {
  const { row, bar, log } = stage();
  const items = [item(0, 0, 80, 44), item(88, 0, 110, 44), item(206, 0, 70, 44)];
  const first = placeIndicator(row, bar, items, 0, null, false);
  log.length = 0;
  const next = placeIndicator(row, bar, items, 2, first, true);
  assert.deepEqual(next, { x: 206, y: 0, w: 70, h: 44 });
  assert.deepEqual(log, [
    ['set', '--seg-x', '206px', ''],
    ['set', '--seg-y', '0px', ''],
    ['set', '--seg-w', '70px', ''],
    ['set', '--seg-h', '44px', ''],
  ], '滑动时不碰过渡、不强制算样式');
  // 滑动途中又量了一次（ResizeObserver、字体到位），位置没变：一个字都不写，滑动不被打断
  log.length = 0;
  assert.equal(placeIndicator(row, bar, items, 2, next, false), next, '返回原来那个盒');
  assert.deepEqual(log, []);
  // 改了尺寸（项变宽了）又不是换选中项：就地摆，不滑
  log.length = 0;
  const wider = [item(0, 0, 90, 44), item(98, 0, 120, 44), item(226, 0, 70, 44)];
  assert.deepEqual(placeIndicator(row, bar, wider, 2, next, false), { x: 226, y: 0, w: 70, h: 44 });
  assert.deepEqual(log[0], ['transition', 'none']);
  assert.deepEqual(log.at(-1), ['transition', '']);
});

test('wrapped rows, no selection or a missing item take the block away and write nothing', () => {
  const { row, bar, log } = stage();
  const shown = placeIndicator(row, bar, [item(0, 0, 80, 44), item(88, 0, 110, 44)], 0, null, false);
  for (const [items, checked, why] of [
    [[item(0, 0, 80, 44), item(0, 52, 110, 44)], 0, '折成两行'],
    [[item(0, 0, 80, 44), item(88, 0, 110, 44)], -1, '没有选中项'],
    [[item(0, 0, 80, 44), null], 0, '有一项还没挂上'],
    [[item(0, 0, 0, 0), item(0, 0, 0, 0)], 0, '还没排版'],
  ]) {
    row.dataset.slide = 'on';
    log.length = 0;
    assert.equal(placeIndicator(row, bar, items, checked, shown, true), null, why);
    assert.equal('slide' in row.dataset, false, `${why}：摘掉 data-slide，选中项自己带底色`);
    assert.deepEqual(log, [], `${why}：不写任何位置`);
  }
  // 从不画变回画：就地出现在选中项上，不从上次的位置滑过来
  log.length = 0;
  placeIndicator(row, bar, [item(0, 0, 80, 44), item(88, 0, 110, 44)], 1, null, true);
  assert.deepEqual(log[0], ['transition', 'none']);
  assert.equal(row.dataset.slide, 'on');
});

test('the block dims along with a checked item that has been disabled', () => {
  const { row, bar } = stage();
  placeIndicator(row, bar, [item(0, 0, 80, 44, true), item(88, 0, 110, 44)], 0, null, false);
  assert.equal(bar.dataset.dim, 'true');
  placeIndicator(row, bar, [item(0, 0, 80, 44, true), item(88, 0, 110, 44)], 1, null, false);
  assert.equal(bar.dataset.dim, 'false');
});
