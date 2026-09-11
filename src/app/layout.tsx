import type { Metadata } from "next";
// katex 的样式表已随 MathText 一起走 next/dynamic（见 components/MathTextRender.tsx）：
// 首屏是卡组，一道公式都不渲染，没有理由让它占冷启动
import "./globals.css";

export const metadata: Metadata = {
  title: "MCQ Test — TMUA / MAT / SMC / ECAA 选择题机考",
};

// 首屏前同步套用上次选的配色，避免 light→dark 闪一下
const THEME_INIT = `try{var t=localStorage.getItem('theme');if(t==='dark'||t==='sepia')document.documentElement.dataset.theme=t;else document.documentElement.dataset.theme='light';}catch(e){document.documentElement.dataset.theme='light';}`;

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
