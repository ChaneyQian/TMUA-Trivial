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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
