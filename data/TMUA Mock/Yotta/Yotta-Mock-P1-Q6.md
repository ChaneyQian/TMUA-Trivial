---
database: TMUA
qid: 20132101203106
id: Yotta-Mock-P1-Q6
paper: TMUA Mock
year:
number: Q6
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
$f(x)$ is a polynomial function defined for all real $x$. Given that $f(x^2 - 12x + 45)$ has two roots at $x = -3$ and $x = 15$, and has a minimum value of $-20$, which row correctly describes $f(9x^2 - 30x + 34)$?

| | Roots | Min Value |
|---|---|---|
| **(A)** | $x = -1$ and $x = 5$ | $-20$ |
| **(B)** | $x = -\frac{4}{3}$ and $x = \frac{14}{3}$ | $-20$ |
| **(C)** | $x = -\frac{2}{3}$ and $x = \frac{16}{3}$ | $-20$ |
| **(D)** | $x = -1$ and $x = 42$ | $-20$ |
| **(E)** | $x = -12$ and $x = 5$ | $-60$ |
| **(F)** | $x = -1$ and $x = 42$ | $-180$ |

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Complete the square on the inner quadratic: $x^{2} - 12x + 45 = (x-6)^{2} + 9$. As $x$ runs over the reals this takes every value in $[9, \infty)$, so the composite $f\bigl((x-6)^{2}+9\bigr)$ sees exactly the values of $f$ on $[9, \infty)$.

Both given roots feed the same input: $(-3-6)^{2} + 9 = 90$ and $(15-6)^{2} + 9 = 90$. So $f(90) = 0$, and $90$ is the only zero of $f$ in $[9, \infty)$. The minimum value $-20$ is the minimum of $f$ over $[9, \infty)$.

Now $9x^{2} - 30x + 34 = (3x-5)^{2} + 9$, which also takes every value in $[9, \infty)$. Therefore the new composite has the *same* minimum value $-20$, and its roots occur where the input equals $90$:

$$ (3x-5)^{2} + 9 = 90 \implies (3x-5)^{2} = 81 \implies 3x - 5 = \pm 9 $$

giving $x = \frac{14}{3}$ and $x = -\frac{4}{3}$. The answer is B.
