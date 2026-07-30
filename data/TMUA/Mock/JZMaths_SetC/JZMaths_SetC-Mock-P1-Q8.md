---
database: TMUA
qid: 20132101207108
id: JZMaths_SetC-Mock-P1-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 6.5
topics: []
subtopics: []
tags: [Integration, Sequences and Series]
status: 已入库
---

## 题目
For positive integers $n$ let:
$$ I(n) = \int_0^{2n} \frac{|n - x|}{n} \, dx $$
What is the largest positive integer $n$ for which
$$ \sum_{r=1}^n I(r) < 210? $$
$$ \mathbf{A} \quad 15 $$
$$ \mathbf{B} \quad 16 $$
$$ \mathbf{C} \quad 19 $$
$$ \mathbf{D} \quad 20 $$
$$ \mathbf{E} \quad 21 $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
For any positive integer $k$,
$$ I(k) = \int_0^{2k} \frac{|k - x|}{k} \, dx. $$
The graph of $y = |k - x|$ from $x = 0$ to $x = 2k$ forms two right-angled triangles, each with base $k$ and height $k$. Therefore
$$ \int_0^{2k} |k - x| \, dx = 2 \cdot \frac{1}{2} k^2 = k^2. $$
So
$$ I(k) = \frac{k^2}{k} = k. $$
Hence
$$ \sum_{r=1}^n I(r) = 1 + 2 + \cdots + n = \frac{n(n + 1)}{2}. $$
Therefore we need $\frac{n(n + 1)}{2} < 210$ or $n(n + 1) < 420$.
Trial and error: $19 \cdot 20 = 380 < 420$, $20 \cdot 21 = 420$.
