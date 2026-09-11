'use client';

// MathText 的门面：渲染实现（katex + marked + katex.min.css）整块走 next/dynamic，
// 真的要渲染一道题时才下载。
//
// 为什么值得：首屏是卡组，一道题都不渲染，而 katex 的 JS 与样式表加起来是站里
// 最大的一块静态资源。以前它挂在 layout.tsx 上，等于每个只是来看看封面的人
// 都得先把公式引擎下完。
//
// 不写 ssr: false：静态导出下三个调用点都在客户端组件里，按需加载已经足够；
// 加上它反而让预渲染阶段少掉一份可用的 HTML。
//
// 占位给一行的高度，避免加载完成那一刻整块题面往下顶一跳。Diagnostic 开考
// 有自己的 loading 相，天然遮住这段窗口。

import dynamic from 'next/dynamic';

const MathText = dynamic(() => import('./MathTextRender'), {
  loading: () => <div className="mathtext" style={{ minHeight: '1.5em' }} aria-hidden />,
});

export default MathText;
