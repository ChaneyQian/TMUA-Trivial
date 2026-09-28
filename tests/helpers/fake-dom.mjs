// 一套最小的假 DOM：window / document / matchMedia / rAF，外加能记样式变量的元素。
// 给「挂监听、rAF 节流、写 CSS 变量」这类副作用做行为测试用（useCardTilt、环境光聚光），
// 不引 jsdom：这几个模块只碰得到这里模拟的几样东西，多模拟一样都是在测假 DOM 本身。

export const FINE_POINTER = '(hover: hover) and (pointer: fine)';
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export class FakeTarget {
  constructor() {
    this.listeners = new Map();
  }
  addEventListener(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(fn);
  }
  removeEventListener(type, fn) {
    this.listeners.get(type)?.delete(fn);
  }
  emit(type, event = {}) {
    for (const fn of [...(this.listeners.get(type) || [])]) fn({ type, ...event });
  }
  /** 当前挂着的监听总数：加了几个就得摘几个 */
  count() {
    return [...this.listeners.values()].reduce((sum, set) => sum + set.size, 0);
  }
}

/** 一个元素：样式只认自定义属性的 set / remove（记在 props 里），另有 dataset 与可数的包围盒读取 */
function fakeElement(rect) {
  const props = new Map();
  let reads = 0;
  return Object.assign(new FakeTarget(), {
    props,
    dataset: {},
    style: {
      setProperty: (name, value) => props.set(name, String(value)),
      removeProperty: (name) => props.delete(name),
      getPropertyValue: (name) => props.get(name) ?? '',
    },
    getBoundingClientRect: () => {
      reads++;
      return rect;
    },
    reads: () => reads,
  });
}

/**
 * 把假的 window / document 装到 globalThis 上（测试结束记得 restoreGlobals）。
 * 两条媒体查询的初值可配，中途用 setMedia 改并发 change 事件。
 */
export function installFakeDom({ fine = true, reduced = false } = {}) {
  const frames = new Map();
  let nextFrame = 1;
  const queries = {
    [FINE_POINTER]: Object.assign(new FakeTarget(), { matches: fine }),
    [REDUCED_MOTION]: Object.assign(new FakeTarget(), { matches: reduced }),
  };
  const win = Object.assign(new FakeTarget(), {
    matchMedia: (query) => {
      if (!queries[query]) throw new Error(`意外的媒体查询 ${query}`);
      return queries[query];
    },
    requestAnimationFrame: (fn) => {
      const id = nextFrame++;
      frames.set(id, fn);
      return id;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
  });
  const doc = Object.assign(new FakeTarget(), { hidden: false });
  globalThis.window = win;
  globalThis.document = doc;

  return {
    win,
    doc,
    queries,
    /** 排着还没跑的帧数 */
    pending: () => frames.size,
    /** 跑完当前排着的所有帧 */
    flush() {
      const due = [...frames.values()];
      frames.clear();
      for (const fn of due) fn(0);
    },
    /** 改一条媒体查询的结果，并像浏览器那样发 change */
    setMedia(query, matches) {
      queries[query].matches = matches;
      queries[query].emit('change', { matches });
    },
    element(rect = { left: 0, top: 0, width: 0, height: 0 }) {
      return fakeElement(rect);
    },
  };
}

export function restoreGlobals() {
  delete globalThis.window;
  delete globalThis.document;
}
