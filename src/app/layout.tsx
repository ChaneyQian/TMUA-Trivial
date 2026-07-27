import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "MCQ Test — TMUA / MAT / SMC 选择题机考",
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
