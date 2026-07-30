---
database: TMUA
qid: 20132101206208
id: JZMaths_SetB-Mock-P2-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 7
topics: []
subtopics: []
tags: [Logic Deduction, General Trigonometry]
status: 已入库
---

## 题目
The following is an attempted proof of the conjecture:

**If** $\sin \theta > \cos \theta$, **then** $\sin \theta > \frac{1}{\sqrt{2}}$.

Suppose $\sin \theta > \cos \theta$.

Then $\sin \theta-\cos \theta>0$. (I)

Squaring the positive quantity $\sin \theta-\cos \theta$ gives $(\sin \theta-\cos \theta)^2>0$, which expands using $\sin^2\theta+\cos^2\theta=1$ to $1-2\sin\theta\cos\theta>0$, so $\sin\theta\cos\theta<\frac12$. (II)

From (II), $(\sin\theta+\cos\theta)^2=1+2\sin\theta\cos\theta<2$, hence $|\sin\theta+\cos\theta|<\sqrt2$, so in particular $\sin\theta+\cos\theta>-\sqrt2$. (III)

Adding (I) and (III) gives $2\sin\theta>-\sqrt2$, so $\sin\theta>-\frac{1}{\sqrt2}$; squaring this inequality yields $\sin^2\theta>\frac12$. (IV)

Since $\sin^2\theta>\frac12$ means $|\sin\theta|>\frac{1}{\sqrt2}$, and $\sin\theta>-\frac{1}{\sqrt2}$ rules out $\sin\theta<-\frac{1}{\sqrt2}$, we conclude $\sin\theta>\frac{1}{\sqrt2}$. (V)

Which one of the following is the case?

$$ \mathbf{A} \quad \text{The proof is correct.} $$
$$ \mathbf{B} \quad \text{The proof is incorrect, and the first error occurs in line (I).} $$
$$ \mathbf{C} \quad \text{The proof is incorrect, and the first error occurs in line (II).} $$
$$ \mathbf{D} \quad \text{The proof is incorrect, and the first error occurs in line (III).} $$
$$ \mathbf{E} \quad \text{The proof is incorrect, and the first error occurs in line (IV).} $$
$$ \mathbf{F} \quad \text{The proof is incorrect, and the first error occurs in line (V).} $$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
The conjecture is false: $\theta=\frac{5\pi}{6}$ gives $\sin\theta=\frac12$ and $\cos\theta=-\frac{\sqrt3}{2}$.

Lines (I)-(III) are valid. The first error is in line (IV): from $\sin\theta>-\frac{1}{\sqrt2}$ one cannot square both sides and preserve the claimed inequality because the left side need not be non-negative. For example, $0>-\frac{1}{\sqrt2}$ but $0^2<\frac12$. Therefore the answer is E.
