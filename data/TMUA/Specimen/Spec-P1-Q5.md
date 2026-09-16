---
database: TMUA
qid: 90010210500
id: Spec-P1-Q5
paper: TMUA P1
year:
number: Q5
section: Applications
difficulty: 0
topics: []
subtopics: []
tags:
  - Specimen
status: 已入库
---

## 题目
Given that $y = -\log_{10}(1 - x)$ for $x < 1$, find $x$ in terms of $y$.

$$
\mathbf{A} \quad x = -\frac{1}{\log_{10}(1-y)}
$$

$$
\mathbf{B} \quad x = 1 + \log_{10} y
$$

$$
\mathbf{C} \quad x = 1 - \log_{10} y
$$

$$
\mathbf{D} \quad x = 1 - 10^{-y}
$$

$$
\mathbf{E} \quad x = 10^{-y} - 1
$$

$$
\mathbf{F} \quad x = 10^{1-y}
$$

## 备注

### 我的备注

### AI备注


⚠️ 2026-08-15 转写修正：解析段原为「（无）」，内容被切进了 Spec-P1-Q4 的解析末尾，已移回。答案 D 与推导一致。
## 答案
D

## 解析
$$
y = - \log_ {1 0} (1 - x)
$$

$$
\Longleftrightarrow - y = \log_ {1 0} (1 - x)
$$

negate

$$
\Longleftrightarrow 1 0 ^ {- y} = 1 - x
$$

exponentiate to base 10

$$
\Longleftrightarrow x + 1 0 ^ {- y} = 1
$$

add x

$$
\Longleftrightarrow \qquad x = 1 - 1 0 ^ {- y}
$$

subtract $10^{-y}$

so the answer is D.

