---
database: TMUA
qid: 20132101203111
id: Yotta-Mock-P1-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Worker $n$, where $n$ is an integer, can do a task by themself in $2^n$ days. Let $f(k)$ represent the time taken when workers $0$ to $k$ inclusive are all working on the task simultaneously (assuming their overall speed adds up). What is the value of $f^{-1}\left(\frac{255}{512}\right)$?

$$
\mathbf{A} \quad 8
$$

$$
\mathbf{B} \quad 9
$$

$$
\mathbf{C} \quad 16
$$

$$
\mathbf{D} \quad 17
$$

$$
\mathbf{E} \quad 64
$$

$$
\mathbf{F} \quad 65
$$

$$
\mathbf{G} \quad \text{Doesn't exist}
$$

## 备注

### 我的备注

### AI备注


## 答案
G

## 解析
Worker $n$ completes $\frac{1}{2^{n}}$ of the task per day, so workers $0$ to $k$ together work at rate

$$ R(k) = \sum_{n=0}^{k} \frac{1}{2^{n}} = 2 - \frac{1}{2^{k}} = \frac{2^{k+1} - 1}{2^{k}} $$

and the time taken is $f(k) = \dfrac{2^{k}}{2^{k+1} - 1}$.

Setting $f(k) = \frac{255}{512}$ gives $512 \cdot 2^{k} = 255\left(2^{k+1} - 1\right) = 510 \cdot 2^{k} - 255$, hence $2 \cdot 2^{k} = -255$, which is impossible.

The reason is worth seeing directly: $f(k) = \dfrac{2^{k}}{2^{k+1}-1} > \dfrac{2^{k}}{2^{k+1}} = \dfrac{1}{2}$ for every $k$, so $f$ only ever takes values above $\frac12$, decreasing towards it. But $\frac{255}{512} < \frac{1}{2}$, so it is never attained. The answer is G. (Compare $\frac{255}{511}$, which *is* $f(8)$ — the trap is the denominator.)
