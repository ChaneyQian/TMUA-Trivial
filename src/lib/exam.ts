'use client';

// 静态版抽题：题目已由 scripts\build-data.mjs 在构建期解析好，
// 这里只负责「从索引里随机挑 N 个 → 取回这 N 份 JSON」。

import { EXAM_DATA } from './config';

export interface ExamChoice {
  label: string; // A–H / a–e / i–iv
  text: string;  // markdown/LaTeX 片段，交给 MathText 渲染；optionsInline 时为空串
}

export interface ExamQuestion {
  qid: number;
  id: string;
  paper: string;
  year: number;
  number: string;
  database: string;
  statement: string;       // 题面（选项已剔除）
  choices: ExamChoice[];
  optionsInline: boolean;  // true=选项仍在题面里（表格式等），按钮只显字母
  answer: string;
  solution: string;
}

export const EXAM_DATABASES = ['TMUA', 'TMUA_MOCK', 'MAT', 'SMC', 'ECAA', 'AMC'] as const;
export type ExamDb = (typeof EXAM_DATABASES)[number] | 'ALL';

/** 索引条目：只有能自动判分的题才会出现在索引里 */
export interface IndexEntry {
  qid: number;
  db: string;
  hidden?: true;
}

export async function fetchIndex(): Promise<IndexEntry[]> {
  const res = await fetch(`${EXAM_DATA}/index.json`);
  if (!res.ok) throw new Error(`题库索引加载失败（HTTP ${res.status}）`);
  return res.json();
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** 从索引随机抽 count 道题并取回全文；顺序即出题顺序 */
export async function buildExam(
  index: IndexEntry[],
  db: ExamDb,
  count: number
): Promise<ExamQuestion[]> {
  const pool = index.filter((e) => db === 'ALL' || e.db === db);
  if (pool.length === 0) throw new Error('该题库没有可用题目');

  const picked = shuffle([...pool]).slice(0, count);
  const questions = await Promise.all(
    picked.map(async (e) => {
      const res = await fetch(`${EXAM_DATA}/q/${e.qid}.json`);
      if (!res.ok) throw new Error(`第 ${e.qid} 题加载失败（HTTP ${res.status}）`);
      return (await res.json()) as ExamQuestion;
    })
  );
  return questions;
}
