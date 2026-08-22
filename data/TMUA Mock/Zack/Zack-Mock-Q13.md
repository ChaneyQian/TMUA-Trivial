---
database: TMUA
qid: 20132101204013
id: Zack-Mock-Q13
paper: TMUA Mock
year:
number: Q13
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
How many solutions does
$$ \sin x + \sin^2 x + \sin^3 x + \dots = \tan x $$
have for $0 \leq x \leq 2\pi$?

$$
\mathbf{A} \quad 1
$$

$$
\mathbf{B} \quad 2
$$

$$
\mathbf{C} \quad 3
$$

$$
\mathbf{D} \quad 4
$$

$$
\mathbf{E} \quad 5
$$

$$
\mathbf{F} \quad 6
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The left side is a geometric series with first term $\sin x$ and ratio $\sin x$, which converges only when $|\sin x|<1$. Where it does,

$$ \frac{\sin x}{1-\sin x} = \tan x = \frac{\sin x}{\cos x} $$

Bring everything to one side and factor out $\sin x$:

$$ \sin x\left(\frac{1}{1-\sin x}-\frac{1}{\cos x}\right) = 0 $$

**Case $\sin x = 0$**: on $[0,2\pi]$ this gives $x = 0,\ \pi,\ 2\pi$. All three are legitimate — the series sums to $0$ and $\tan x = 0$ as well.

**Case $\cos x = 1-\sin x$**: rearranging, $\sin x+\cos x = 1$, i.e. $\sqrt2\sin\left(x+\tfrac{\pi}{4}\right) = 1$, giving $x = 0$ or $x = \tfrac{\pi}{2}$. The first is already counted; the second must be rejected because $\sin\tfrac{\pi}{2} = 1$ makes the series diverge (and $\tan$ undefined there anyway).

So there are $3$ solutions, and the answer is C.
