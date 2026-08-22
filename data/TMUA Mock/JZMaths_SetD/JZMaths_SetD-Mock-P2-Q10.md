---
database: TMUA
qid: 20132101208210
id: JZMaths_SetD-Mock-P2-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 7
topics: [Logic and Proof, Function]
subtopics: [Logic, Exponentials and Logarithms]
tags: [Logic-Deduction, Exponentials-and-Logarithms]
status: 已入库
---

## 题目
Let $a$ be a real number with $a > 1$, and let $f$ be a function such that
$$ f(0) = 1, \qquad f(2) > a^2, \qquad f(-1) < a^{-1}. $$

Consider the following four statements.

I. $\quad f(x) = b^x$ for some real number $b$ with $b > a$.

II. $\quad f(x) = b^x$ for some real number $b$ with $0 < b < a$.

III. $\quad f(x) = a^{kx}$ for some real number $k$.

IV. $\quad f(x) = b^{x^2}$ for some positive real number $b$.

Which of the statements **might** be true?

$$ \mathbf{A} \quad \text{Statement I only.} $$
$$ \mathbf{B} \quad \text{Statement III only.} $$
$$ \mathbf{C} \quad \text{Statements I and III only.} $$
$$ \mathbf{D} \quad \text{Statements I, II and III only.} $$
$$ \mathbf{E} \quad \text{Statements I, III and IV only.} $$
$$ \mathbf{F} \quad \text{Statements II and IV only.} $$
$$ \mathbf{G} \quad \text{Statements II, III and IV only.} $$
$$ \mathbf{H} \quad \text{All four statements.} $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
For statement I, if $f(x) = b^x$ with $b > a$, then
$$ f(0) = 1, \qquad f(2) = b^2 > a^2, \qquad f(-1) = \frac{1}{b} < \frac{1}{a}. $$
Therefore, statement I might be true.

For statement II, $0 < b < a$ gives $f(2) = b^2 < a^2$, so statement II cannot be true.

For statement III, choosing $k > 1$ gives $a^k > a$, so $f(x) = a^{kx} = (a^k)^x$ satisfies all three conditions. Therefore, statement III might be true.

For statement IV, $f(2) > a^2$ would give $b^4 > a^2$, so $b > \sqrt{a} > 1$. However, $f(-1) = b < a^{-1} < 1$, which is impossible, so IV cannot be true.

Hence statements I and III only might be true.
