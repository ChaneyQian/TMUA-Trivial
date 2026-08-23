'use client';

// 公告牌：左下角常驻一枚小药丸，展开成一张票券式告示卡。
//
// 版本化已读：NOTICE_ID 变了（发新公告）会对老用户重新弹出，
// 同一则公告收起过就保持收起。回读放 effect（静态导出首帧按收起渲染，
// 同步读 localStorage 会水合不匹配——同 lang / zone 的老规矩），
// 落盘写在收起的 handler 里而不是 effect 里，免得首帧默认值把已读盖掉。

import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';
import styles from './Notice.module.css';

/** 发新公告时改这个 id，收起状态即对全员失效、重新弹出 */
export const NOTICE_ID = '2026-08-trivial-open';
const NOTICE_KEY = 'mcq-test:notice:v1';

export default function NoticeBoard() {
  // 首帧一律收起：既避免水合不匹配，也让入场动画从「药丸已在」的世界里弹出来
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(NOTICE_KEY) !== NOTICE_ID) setOpen(true);
    } catch {
      /* 无痕模式拿不到 localStorage：每次都弹，宁多勿漏 */
    }
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(NOTICE_KEY, NOTICE_ID);
    } catch {}
  };

  const { t } = useLang();

  return (
    <div className={styles.dock}>
      {open ? (
        <section className={styles.card} role="region" aria-label={t.notice.regionAria}>
          <header className={styles.head}>
            <span className={styles.rule} aria-hidden="true" />
            <span className={styles.title}>{t.notice.title}</span>
            <span className={styles.rule} aria-hidden="true" />
          </header>

          <p className={styles.headline}>{t.notice.headline}</p>

          <ul className={styles.list} role="list">
            <li className={styles.item}>
              <span className={styles.tag}>MAT</span>
              {t.notice.itemMat}
            </li>
            <li className={styles.item}>
              <span className={styles.tag}>TMUA CN</span>
              {t.notice.itemTmuaCn}
            </li>
          </ul>

          {/* 撕票线：告示的下半张是「主观提示」，和上半张的事实公告分开 */}
          <div className={styles.tear} aria-hidden="true" />

          <p className={styles.note}>{t.notice.note}</p>

          <button type="button" className={styles.collapse} onClick={dismiss}>
            {t.notice.collapse}
          </button>
        </section>
      ) : (
        <button
          type="button"
          className={styles.pill}
          aria-expanded="false"
          aria-label={t.notice.pillAria}
          onClick={() => setOpen(true)}
        >
          <span className={styles.pillDot} aria-hidden="true" />
          {t.notice.pill}
        </button>
      )}
    </div>
  );
}
