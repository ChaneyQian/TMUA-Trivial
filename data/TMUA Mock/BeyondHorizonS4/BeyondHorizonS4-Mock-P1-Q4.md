---
database: TMUA
qid: 20132101214104
id: BeyondHorizonS4-Mock-P1-Q4
paper: TMUA Mock
year:
number: Q4
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Evaluate the following sum
$$(1 \cdot 1!) + (2 \cdot 2!) + (3 \cdot 3!) + \cdots + (50 \cdot 50!)$$
$$\mathbf{A} \quad 51!$$
$$\mathbf{B} \quad 2.5!$$
$$\mathbf{C} \quad 51! - 1$$
$$\mathbf{D} \quad 51! + 1$$
$$\mathbf{E} \quad 50! + 1$$
$$\mathbf{F} \quad 50! + 1$$

## 备注

### 我的备注

### AI备注

- **原卷选项 (E) 与 (F) 内容完全相同**（都是 $50! + 1$，已在 500dpi 裁图上逐字确认）。
  照原样保留、未合并。答案不受影响：$\sum_{k=1}^{n} k\cdot k! = (n+1)!-1$，
  故本题为 $51!-1$，即选项 C。


## 答案
C

## 解析
The key identity is $k \cdot k! = (k+1)! - k!$, which makes the sum telescope: every $(k+1)!$ is cancelled by the $-k!$ of the next term, leaving only the last positive term and the first negative one. So
$$\sum_{k=1}^{50} k \cdot k! = 51! - 1! = 51! - 1.$$
The answer is C. Option A, $51!$, is the telescoping value without the leftover $-1!$ at the bottom end.
