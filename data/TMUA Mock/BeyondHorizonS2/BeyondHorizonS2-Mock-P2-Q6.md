---
database: TMUA
qid: 20132101212206
id: BeyondHorizonS2-Mock-P2-Q6
paper: TMUA Mock
year:
number: Q6
section: Multiple Choice
difficulty: 0
topics: [Logic and Proof, Miscellaneous Pure]
subtopics: [Logic, Proof, Combinatorics]
tags: [Truth-Value-List, Deduction, Double-Counting]
status: 已入库
---

## 题目
From a group of seven persons, seven committees are formed. Any two committees have exactly one member in common. Each person is in exactly three committees. Then
$$\mathbf{A} \quad \text{at least one committee must have more than three members}$$
$$\mathbf{B} \quad \text{each committee must have exactly three members}$$
$$\mathbf{C} \quad \text{each committee must have more than three members}$$
$$\mathbf{D} \quad \text{nothing can be said about the sizes of the committees}$$

## 备注

### 我的备注

### AI备注
- **键对拍（2026-09-11，键源 tmua.fyi）**：站上写 **E**，但本题只有 A–D 四个选项，是站方数据错位。库记 **B** 不动：
  7 人 7 委员会、两两恰共一人、每人恰在 3 个——这是 Fano 平面，每个委员会恰 3 人。

## 答案
B

## 解析
Fix one committee $C$ and let $k$ be its size. Each of the six remaining committees meets $C$ in exactly one person, so counting pairs consisting of another committee together with its common member with $C$ gives six such pairs. Counting the same pairs from the other side, every person of $C$ belongs to exactly three committees and hence to exactly two committees other than $C$, contributing exactly two pairs. Therefore $2k = 6$ and $k = 3$. The committee $C$ was arbitrary, so every committee has exactly three members. As a consistency check, the total number of memberships is $7 \times 3 = 21$, which matches seven committees of size three. The answer is B.
