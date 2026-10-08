'use client';

// 05 密卷锁定态展开后的密码面板——照 9.0 锁定态展开成 Diagnostic 介绍页的模式：
// 一枚封蜡、一句说明、密码框、确认按钮。输错只说「密码不对」，不提示更多；
// 连续输错 5 次冷却 30 秒（规则与常量在 lib/sealed）。
// 这道门的性质只写在 lib/sealed.ts 的注释里，不写到界面上。
//
// 输错计数放在外层（ExamApp 的 state）：面板收起再展开、换区再回来，冷却都不该被重置。
// 窗口外（还没开 / 已结束）正常走不到这里——卡与页签都会先挡下；页面挂着跨过关门那一刻时，
// 面板就地换成「本期开放已结束」，不再给输入框

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { useLang } from '@/lib/LangContext';
import {
  NO_SEALED_TRIES,
  checkSealedPassword,
  noteSealedFailure,
  sealedCooldownLeft,
  sealedCryptoReady,
  sealedUntilDate,
  type SealedPhase,
  type SealedTries,
} from '@/lib/sealed';
import styles from './Sealed.module.css';

interface Props {
  /** 窗口三态；null = 还不知道「现在」（静态导出的首帧），按开着画 */
  phase: SealedPhase | null;
  tries: SealedTries;
  onTries: (next: SealedTries) => void;
  /** 输对了：外层落盘印记、换成配置面板 */
  onUnlock: () => void;
}

export default function SealedGate({ phase, tries, onTries, onUnlock }: Props) {
  const { t } = useLang();
  const inputId = useId();
  const messageId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [password, setPassword] = useState('');
  const [checking, setChecking] = useState(false);
  const [verdict, setVerdict] = useState<'idle' | 'wrong' | 'unsupported'>('idle');
  // 冷却读数要随时间走；面板只在用户点开之后才挂载（不进预渲染），首帧读 Date.now() 不会水合不匹配
  const [now, setNow] = useState(() => Date.now());

  // 环境不支持（http 的局域网地址没有 crypto.subtle）就一进来说清楚，别等用户输完才说
  useEffect(() => {
    if (!sealedCryptoReady()) setVerdict('unsupported');
  }, []);

  // 冷却中每 250ms 走一下读数，冷却完自己停
  useEffect(() => {
    setNow(Date.now());
    if (sealedCooldownLeft(tries, Date.now()) <= 0) return;
    const timer = window.setInterval(() => {
      const at = Date.now();
      setNow(at);
      if (sealedCooldownLeft(tries, at) <= 0) window.clearInterval(timer);
    }, 250);
    return () => window.clearInterval(timer);
  }, [tries]);

  const cooling = sealedCooldownLeft(tries, now);
  const unsupported = verdict === 'unsupported';

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (checking || unsupported || !password || sealedCooldownLeft(tries, Date.now()) > 0) return;
    setChecking(true);
    const result = await checkSealedPassword(password);
    setChecking(false);
    if (result === 'ok') {
      onTries(NO_SEALED_TRIES);
      onUnlock();
      return;
    }
    if (result === 'unsupported') {
      setVerdict('unsupported');
      return;
    }
    // 输错：清空重输；第 5 次进冷却时由冷却那句接管提示
    setPassword('');
    const next = noteSealedFailure(tries, Date.now());
    onTries(next);
    setVerdict(next.lockedUntil > 0 ? 'idle' : 'wrong');
    inputRef.current?.focus();
  };

  const message = unsupported
    ? t.sealed.unsupported
    : cooling > 0
      ? t.sealed.cooldown(Math.ceil(cooling / 1000))
      : verdict === 'wrong'
        ? t.sealed.wrong
        : '';
  const { month, day } = sealedUntilDate();
  const closed = phase === 'before' || phase === 'ended';

  return (
    <div className={styles.gate}>
      {/* 封蜡印：纯装饰，读屏跳过 */}
      <div className={styles.seal} aria-hidden="true">
        <span className={styles.sealMark}>05</span>
      </div>
      <h2 className={styles.title}>{t.zone.title.sealed}</h2>

      {closed ? (
        <p className={styles.lead} role="status">
          {phase === 'before' ? t.sealed.blockNotYet : t.sealed.blockEnded}
        </p>
      ) : (
        <>
          <p className={styles.lead}>{t.sealed.lead(month, day)}</p>
          <form className={styles.form} onSubmit={(event) => void submit(event)} noValidate>
            <label className={styles.label} htmlFor={inputId}>
              {t.sealed.passwordLabel}
            </label>
            <div className={styles.row}>
              <input
                ref={inputRef}
                id={inputId}
                className={styles.input}
                type="password"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
                value={password}
                disabled={unsupported}
                aria-invalid={verdict === 'wrong' || undefined}
                aria-describedby={messageId}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (verdict === 'wrong') setVerdict('idle');
                }}
              />
              <button
                type="submit"
                className={styles.submit}
                disabled={checking || unsupported || cooling > 0 || !password}
                aria-busy={checking || undefined}
              >
                {t.sealed.submit}
              </button>
            </div>
            {/* 提示行常驻（空着也占位）：出错时不顶动下面的东西；读屏经 aria-live 念出来 */}
            <p id={messageId} className={styles.message} aria-live="polite">
              {message}
            </p>
          </form>
        </>
      )}
    </div>
  );
}
