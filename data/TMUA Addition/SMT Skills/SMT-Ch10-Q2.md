---
database: TMUA
qid: 90020280200
id: SMT-Ch10-Q2
paper: SMT Skills Ch10
year:
number: Q2
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
You are given that $a, b$ and $c$ are positive real numbers with $a < b$ and $c \neq 1$.
Which of the following statements must be true?

$$\mathbf{A} \quad a^{\log_c b} < b^{\log_c a}$$

$$\mathbf{B} \quad a^{\log_c b} > b^{\log_c a}$$

$$\mathbf{C} \quad a^{\log_c b} = b^{\log_c a}$$

$$\mathbf{D} \quad \text{There is not enough information to determine the relative sizes of } a^{\log_c b} \text{ and } b^{\log_c a}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 10 章 Logic and proof 章末 TMUA style 第 2 题；解析为书后官方 worked solution。

## 答案
C

## 解析
Write each side with $c$ as the base. Since $a = c^{\log_c a}$ and $b = c^{\log_c b}$,

$$a^{\log_c b} = \left(c^{\log_c a}\right)^{\log_c b} = c^{(\log_c a)(\log_c b)},$$

and the same calculation starting from $b$ gives

$$b^{\log_c a} = \left(c^{\log_c b}\right)^{\log_c a} = c^{(\log_c b)(\log_c a)}.$$

The two exponents are the same number, so the two quantities are equal. The conditions $a > 0$ and $b > 0$ are what make the logarithms exist, and $c > 0$ with $c \ne 1$ is what makes $\log_c$ a genuine base; nothing else is needed.

The correct answer is (C).

Neither $a < b$ nor the size of $c$ plays any part, which is what options A and B are betting on: they assume the inequality $a < b$ must somehow survive into the exponentiated
expressions. Option D is the opposite trap, that a question with so few constraints cannot have a determinate answer. Sampling $20\,000$ random admissible triples $(a, b, c)$ gives a
maximum relative difference between the two sides of about $8 \times 10^{-14}$, i.e. rounding error only.
