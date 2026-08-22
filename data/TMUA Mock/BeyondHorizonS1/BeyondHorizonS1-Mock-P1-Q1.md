---
database: TMUA
qid: 20132101211101
id: BeyondHorizonS1-Mock-P1-Q1
paper: TMUA Mock
year:
number: Q1
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
For what values of $x$ is $f(x)$ a valid function?
$$f(x) = \frac{1}{2\log(x^2 - 2x - 3)}$$
$$\mathbf{A} \quad (0, \infty)$$
$$\mathbf{B} \quad (-\infty, -1) \quad x \neq 1 \pm \sqrt{5}$$
$$\mathbf{C} \quad (-\infty, -1) \cup (3, \infty) \quad x \neq 1 \pm \sqrt{5}$$
$$\mathbf{D} \quad (-\infty, -3) \cup (1, \infty) \quad x \neq 1 \pm \sqrt{5}$$
$$\mathbf{E} \quad f(x) \text{ is never valid}$$
$$\mathbf{F} \quad (-\infty, -1) \cup (3, \infty)$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Two conditions must hold. First the logarithm needs a positive argument, so $x^2 - 2x - 3 > 0$, that is $(x-3)(x+1) > 0$, giving $x < -1$ or $x > 3$. Second the denominator must not vanish, so $\log(x^2 - 2x - 3) \neq 0$, i.e. $x^2 - 2x - 3 \neq 1$, i.e. $x^2 - 2x - 4 \neq 0$, whose roots are
$$x = \frac{2 \pm \sqrt{4 + 16}}{2} = 1 \pm \sqrt{5}$$
Both of these lie inside the interval already found, since $1 + \sqrt{5} \approx 3.24 > 3$ and $1 - \sqrt{5} \approx -1.24 < -1$, so both genuinely have to be removed. The domain is therefore $(-\infty,-1) \cup (3,\infty)$ with $x \neq 1 \pm \sqrt{5}$. The answer is C. Option F is the trap: it has the correct interval but forgets that the logarithm may not equal zero.
