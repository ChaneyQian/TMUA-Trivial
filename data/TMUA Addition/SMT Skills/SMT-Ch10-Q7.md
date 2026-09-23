---
database: TMUA
qid: 90020280700
id: SMT-Ch10-Q7
paper: SMT Skills Ch10
year:
number: Q7
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: TMUA
solution_source: 书后解答
status: 已入库
---

## 题目
$a, b$ and $c$ are real numbers with $0 < a < b < c$
Which of the following statements must be true?
I. $0 < a^2 < b^2 < c^2$
II. $a(b + c) > a^2$
III. $\frac{b}{a} < \frac{c}{b}$

$$\mathbf{A} \quad \text{none of them}$$

$$\mathbf{B} \quad \text{I only}$$

$$\mathbf{C} \quad \text{II only}$$

$$\mathbf{D} \quad \text{III only}$$

$$\mathbf{E} \quad \text{I and II only}$$

$$\mathbf{F} \quad \text{I and III only}$$

$$\mathbf{G} \quad \text{II and III only}$$

$$\mathbf{H} \quad \text{I, II and III}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 10 章 Logic and proof 章末 TMUA style 第 7 题；解析为书后官方 worked solution。

## 答案
E

## 解析
Take the three statements in turn.

Statement I is true. Since $0 < a < b$ and both are positive, $b^2 - a^2 = (b - a)(b + a) > 0$, and the same argument gives $c^2 > b^2$; also $a^2 > 0$. So $0 < a^2 < b^2 < c^2$.

Statement II is true. Since $b > a$ and $c > 0$,

$$a(b + c) - a^2 = a(b + c - a) > 0,$$

because $a > 0$ and $b + c - a > c > 0$. Hence $a(b + c) > a^2$.

Statement III is false. Multiplying by the positive number $ab$ turns $\frac{b}{a} < \frac{c}{b}$ into $b^2 < ac$, which asks the three numbers to grow at least geometrically, and
nothing in $0 < a < b < c$ says that. Take $a = 1$, $b = 2$, $c = 3$: then $\frac{b}{a} = 2$ and $\frac{c}{b} = \frac{3}{2}$, so $\frac{b}{a} < \frac{c}{b}$ is false.

The correct answer is (E).

Option H is the answer for anyone who tests III only on rapidly growing examples such as $1, 2, 5$, where $\frac{b}{a} = 2 < \frac{5}{2} = \frac{c}{b}$; a geometric triple such as
$1, 2, 4$ already gives equality, and the arithmetic triple $1, 2, 3$ reverses the inequality outright.
