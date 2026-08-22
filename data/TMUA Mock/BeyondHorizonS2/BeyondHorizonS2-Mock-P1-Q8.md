---
database: TMUA
qid: 20132101212108
id: BeyondHorizonS2-Mock-P1-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
This question is about pairs of functions $f$ and $g$ that satisfy
$$f(x) - g(x) = 3\sin x$$
$$f(x)g(x) = \cos^2 x$$
for all real numbers $x$. Across all solutions for $f(x)$, what is the minimum value that $f(x)$ attains for any $x$?
$$\mathbf{A} \quad 1 - \sqrt{3}$$
$$\mathbf{B} \quad -1 - \sqrt{3}$$
$$\mathbf{C} \quad 0$$
$$\mathbf{D} \quad -1$$
$$\mathbf{E} \quad -2$$
$$\mathbf{F} \quad -3$$
$$\mathbf{G} \quad -4$$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
Eliminate $g$ by writing $g(x) = f(x) - 3\sin x$ and substituting into the product condition, which becomes a quadratic in $f(x)$:
$$f(x)^2 - 3\sin x\, f(x) - \cos^2 x = 0.$$
Solving and using $\cos^2 x = 1 - \sin^2 x$ gives
$$f(x) = \frac{3\sin x \pm \sqrt{9\sin^2 x + 4\cos^2 x}}{2} = \frac{3s \pm \sqrt{4 + 5s^2}}{2}, \qquad s = \sin x \in [-1, 1].$$
The smallest values come from the minus branch, $h(s) = \frac{3s - \sqrt{4 + 5s^2}}{2}$. Its derivative is $h'(s) = \frac{1}{2}\left(3 - \frac{5s}{\sqrt{4 + 5s^2}}\right)$, and since $\frac{5s}{\sqrt{4 + 5s^2}}$ never exceeds $\frac{5}{3}$ in size on $[-1, 1]$, $h'$ is positive and $h$ is strictly increasing. The minimum is therefore at $s = -1$, giving $h(-1) = \frac{-3 - 3}{2} = -3$, attained at $x = -\frac{\pi}{2}$, where $g(x) = 0$ and $\cos^2 x = 0$, so the pair of conditions is genuinely satisfied. The answer is F. Option D is what you get if you only consider the plus branch.
