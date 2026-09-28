import type { Metadata } from "next";
// katex 的样式表已随 MathText 一起走 next/dynamic（见 components/MathTextRender.tsx）：
// 首屏是卡组，一道公式都不渲染，没有理由让它占冷启动
import "./globals.css";

export const metadata: Metadata = {
  title: "MCQ Test — TMUA / MAT / SMC / ECAA 选择题机考",
};

// 首屏前同步套用上次选的配色，避免 light→dark 闪一下。
//
// 键名在这里只能是字面量（内联脚本没法 import），登记处在 lib/storage.ts，
// 两边一致由测试钉住。
//
// 顺带做旧键 'theme' 的一次性迁移：GitHub Pages 同 origin 共享 localStorage，
// 裸键会和同账号的其他站撞上。搬完就删，用户感知不到。迁移整段包在 try 里，
// 存储被禁用或配额满了也只是拿不到偏好，最后那句赋值照常执行。
const THEME_INIT = `(function(){var K='mcq-test:theme:v1',t=null;try{t=localStorage.getItem(K);var o=localStorage.getItem('theme');if(o!==null){if(t===null){t=o;localStorage.setItem(K,o);}localStorage.removeItem('theme');}}catch(e){}document.documentElement.dataset.theme=(t==='dark'||t==='sepia')?t:'light';})()`;

// 光效开关同理首帧前定下来（<html data-fx="on|off">），环境光和装饰动画从第一帧起就按它来，不闪。
// 有存值（用户手动切过）用存值；没有就按设备推断——开了省流量、≤ 2 核、≤ 2GB 内存默认关——
// 推断结果不写回，用户一旦手动切换才落盘。判据与 lib/fx.ts 的 inferFx 是同一套，测试逐条对拍。
const FX_INIT = `(function(){var K='mcq-test:fx:v1',v=null;try{v=localStorage.getItem(K);}catch(e){}if(v!=='on'&&v!=='off'){var n=navigator,c=n.connection,h=n.hardwareConcurrency,m=n.deviceMemory;v=(c&&c.saveData===true)||(typeof h==='number'&&h>0&&h<=2)||(typeof m==='number'&&m>0&&m<=2)?'off':'on';}document.documentElement.dataset.fx=v;})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 两段首帧脚本会在水合前往 <html> 上写 data-theme / data-fx，服务端预渲染的 HTML 里没有，
    // 这是有意的不一致：只压这一层的属性比对告警，子树照常比对
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <script dangerouslySetInnerHTML={{ __html: FX_INIT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
