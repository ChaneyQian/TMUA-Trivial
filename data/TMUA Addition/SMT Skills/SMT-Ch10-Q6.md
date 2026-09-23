---
database: TMUA
qid: 90020280600
id: SMT-Ch10-Q6
paper: SMT Skills Ch10
year:
number: Q6
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
$a, b$ and $c$ are integers such that $0 < a \le b \le c$.
If $\frac{1}{a} + \frac{1}{b} + \frac{1}{c} = 1$, which of the following statements must be true.
I. $a = 3, b = 3$ and $c = 3$
II. $b = 3$ or $b = 4$
III. $a > 1$

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
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 10 章 Logic and proof 章末 TMUA style 第 6 题；解析为书后官方 worked solution。

## 答案
G

## 解析
First bound $a$. Since $a \le b \le c$ the three reciprocals satisfy $\frac{1}{c} \le \frac{1}{b} \le \frac{1}{a}$, so

$$1 = \frac{1}{a} + \frac{1}{b} + \frac{1}{c} \le \frac{3}{a},$$

which gives $a \le 3$. Also $a \ne 1$, because $a = 1$ would force $\frac{1}{b} + \frac{1}{c} = 0$, impossible for positive $b$ and $c$. So $a = 2$ or $a = 3$, and in particular statement III is true.

If $a = 3$ then $\frac{1}{b} + \frac{1}{c} = \frac{2}{3}$ with $b \ge 3$, and $\frac{2}{3} \le \frac{2}{b}$ forces $b \le 3$, so $b = 3$ and then $c = 3$.

If $a = 2$ then $\frac{1}{b} + \frac{1}{c} = \frac{1}{2}$ with $b \ge 2$. Here $\frac{1}{2} \le \frac{2}{b}$ forces $b \le 4$, and $\frac{1}{b} < \frac{1}{2}$ forces $b > 2$, so $b = 3$ giving $c = 6$, or $b = 4$ giving $c = 4$.

The complete list of solutions is

$$(a, b, c) = (2, 3, 6), \quad (2, 4, 4), \quad (3, 3, 3).$$

Statement I is false, since two of these are not $(3, 3, 3)$. Statement II holds, as $b$ takes the values $3$, $4$, $3$. Statement III holds, as $a$ takes the values $2$, $2$, $3$.

The correct answer is (G).

Option B is for anyone who spots the symmetric solution and stops looking, and the presence of III in the answer is easy to miss because $a > 1$ looks like an extra assumption rather than something forced by the equation.
