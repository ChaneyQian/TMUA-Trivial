---
database: TMUA
qid: 20132101203204
id: Yotta-Mock-P2-Q4
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
$f(x)$ is a function defined for **all real** $x$.
Here are 3 statements:
**J:** $f(3) = 1$, and $f(5) = -2$
**K:** $f(x) = 0$ has exactly 3 solutions in the interval $3 < x < 5$
**L:** $f(x) = 0$ has an odd number of solutions in the interval $3 < x < 5$
Here are 3 more statements:
**R:** K is necessary for J
**S:** K is sufficient for J
**T:** L is necessary for J
Which of statements R, S and T are true?

$$
\mathbf{A} \quad \text{None}
$$

$$
\mathbf{B} \quad \text{R only}
$$

$$
\mathbf{C} \quad \text{S only}
$$

$$
\mathbf{D} \quad \text{T only}
$$

$$
\mathbf{E} \quad \text{R and S only}
$$

$$
\mathbf{F} \quad \text{R and T only}
$$

$$
\mathbf{G} \quad \text{S and T only}
$$

$$
\mathbf{H} \quad \text{R, S and T}
$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Everything hinges on two things: "$X$ is necessary for $Y$" means $Y \implies X$, while "$X$ is sufficient for $Y$" means $X \implies Y$; and $f$ is only assumed to be *a function* defined for all real $x$ — it is **not** assumed continuous.

**R: $K$ is necessary for $J$**, i.e. $J \implies K$. False. Knowing $f(3) = 1$ and $f(5) = -2$ says nothing about how many roots lie between. Even for a continuous $f$ the intermediate value theorem gives at least one root, not exactly three; and $f$ need not be continuous at all.

**S: $K$ is sufficient for $J$**, i.e. $K \implies J$. False. A function can have exactly three roots in $(3,5)$ while taking any values whatever at the endpoints.

**T: $L$ is necessary for $J$**, i.e. $J \implies L$. False. Without continuity $f$ can pass from $1$ to $-2$ without ever taking the value $0$ — for instance $f(x) = 1$ for $x \leq 4$ and $f(x) = -2$ for $x > 4$ has no roots in $(3,5)$, and $0$ is even.

None of R, S, T holds, so the answer is A.
