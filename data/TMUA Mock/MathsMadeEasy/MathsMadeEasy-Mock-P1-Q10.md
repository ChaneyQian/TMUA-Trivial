---
database: TMUA
qid: 20132101229110
id: MathsMadeEasy-Mock-P1-Q10
paper: TMUA Mock
year:
number: Q10
section: MCQ
difficulty: 0
topics: [Sequences and Series, Miscellaneous Pure]
subtopics: [Recurrence Relations, Inequalities]
tags: [原卷缺陷, Squaring-the-Recurrence, Bounding-a-Sequence]
status: 待复核
---

## 题目
Let $a_1 = 1$ and $a_{n+1} = a_n + \frac{1}{a_n}$. Which statement is true?

$$ \mathbf{A} \quad a_n < \sqrt{2n} \text{for all} n $$
$$ \mathbf{B} \quad a_n > \sqrt{2n} \text{for all} n $$
$$ \mathbf{C} \quad a_n = \sqrt{2n} \text{for infinitely many} n $$
$$ \mathbf{D} \quad a_n < \sqrt{2n+1} \text{for all} n $$
$$ \mathbf{E} \quad a_n > \sqrt{2n+1} \text{for all} n $$

## 备注

### 我的备注

### AI备注
来源：tmua.io 社区卷 `community__maths-made-easy__p1`，作者 **Maths Made Easy**（站点标题：Maths Made Easy TMUA Paper 1）。
第三方录入的第三方模拟卷，**非官方真题，未经原卷核对**；站点不提供解析，`## 解析` 待补。
2026-09-25 代审：原卷答案 D 有误，且无正确选项。平方得 a_n²=2n−1+Σ_{k<n}1/a_k²，而 Σ1/a_k² 发散，n=13 时 a₁₃²≈27.015>27，D 从 n=13 起不成立；A 在 n≥2、B 在 n=1,2、E 在 n=1 起就不成立，C 只在 n=2 成立。最接近的是 B（只在 n=1,2 失效）。答案栏保留原卷 D。

## 答案
D

## 解析
