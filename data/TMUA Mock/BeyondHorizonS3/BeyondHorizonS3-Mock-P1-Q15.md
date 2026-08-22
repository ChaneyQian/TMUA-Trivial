---
database: TMUA
qid: 20132101213115
id: BeyondHorizonS3-Mock-P1-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The functions $f$, $g$, and $h$ are related by
$$f'(x) = g(x+2)$$
$$g'(x) = h(x-2)$$
It follows that $f''(3x)$ equals
$$\mathbf{A} \quad h(3x+2)$$
$$\mathbf{B} \quad 3h'(3x)$$
$$\mathbf{C} \quad h(3x)$$
$$\mathbf{D} \quad 9h(3x)$$
$$\mathbf{E} \quad 6h'(3x)$$
$$\mathbf{F} \quad h(3x-2)$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Differentiate the first relation with respect to $x$. The inner function $x+2$ has derivative $1$, so the chain rule contributes nothing extra and $f''(x) = g'(x+2)$. Substituting $x+2$ into the second relation gives $g'(x+2) = h((x+2)-2) = h(x)$, so $f''(x) = h(x)$ identically — the two shifts cancel. Evaluating this identity at the point $3x$ gives $f''(3x) = h(3x)$. The answer is C. Options B, D and E are traps for anyone who confuses evaluating the function $f''$ at $3x$ with differentiating the composite $f(3x)$, which would indeed produce factors of $3$ or $9$.
