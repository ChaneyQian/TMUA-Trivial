// 按钮里的小转圈：开考从点下去到题目载入完成（phase 'loading'）挂在开始 / 快速开始按钮上（Design §22 P8-A4）。
// 纯装饰：「正在抽题」由按钮的 aria-busy 与文字「抽题中…」报给读屏，这一圈不念。
// 它是操作反馈，不归光效开关管（光效关时照转）；减动效下停住，只剩一个静止的缺口圈。
import styles from './BusySpinner.module.css';

export default function BusySpinner() {
  return <span className={styles.spinner} aria-hidden="true" />;
}
