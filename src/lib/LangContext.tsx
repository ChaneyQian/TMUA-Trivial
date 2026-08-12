'use client';

// 语言状态。默认中文；回读 localStorage 放 useEffect 里——
// 静态导出的 HTML 是按默认语言预渲染的，首帧必须和它一致，
// 否则会水合不匹配（和 theme / zone 的既有处理同一套路数）。

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_LANG,
  DICT,
  LANG_KEY,
  isLang,
  setActiveLang,
  type Lang,
  type Strings,
} from './i18n';

interface LangValue {
  lang: Lang;
  t: Strings;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

const LangCtx = createContext<LangValue>({
  lang: DEFAULT_LANG,
  t: DICT[DEFAULT_LANG],
  setLang: () => {},
  toggle: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (isLang(saved)) setLangState(saved);
    } catch {}
  }, []);

  // 模块级镜像：lib/exam.ts、lib/records.ts 抛错时要按当前语言取文案，
  // 它们不在 React 树里，拿不到 context
  useEffect(() => {
    setActiveLang(lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    setActiveLang(next); // 立刻生效，不等 effect：紧跟着抛的错也要是新语言
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {}
  }, []);

  const value = useMemo<LangValue>(
    () => ({
      lang,
      t: DICT[lang],
      setLang,
      toggle: () => setLang(lang === 'zh' ? 'en' : 'zh'),
    }),
    [lang, setLang],
  );

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang(): LangValue {
  return useContext(LangCtx);
}
