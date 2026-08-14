---
database: TMUA
qid: 20132101209205
id: JZMaths_SetE-Mock-P2-Q5
paper: TMUA Mock
year:
number: Q5
section: Multiple Choice
difficulty: 6
topics: [Logic and Proof, Miscellaneous Pure, Function]
subtopics: [Logic, Inequalities, Absolute Value Functions]
tags: [Logic-Deduction]
status: 已入库
---

## 题目
The real numbers $x$ and $y$ are such that exactly two of the following five statements are true. Which two are true?

I $\quad x < y$

II $\quad x < |y|$

III $\quad |x| < |y|$

IV $\quad x \ge 0$

V $\quad x < 0$

$$ \mathbf{A} \quad \text{I and IV} $$
$$ \mathbf{B} \quad \text{I and V} $$
$$ \mathbf{C} \quad \text{II and IV} $$
$$ \mathbf{D} \quad \text{II and V} $$
$$ \mathbf{E} \quad \text{III and IV} $$
$$ \mathbf{F} \quad \text{III and V} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Statements IV and V are opposites, so exactly one of them is true. Therefore exactly one of I, II and III is true.

I cannot be the only true one: if $x < y$, then $x < y \le |y|$, so II would also be true.

III cannot be the only true one: if II is false, then $x \ge |y|$, and combining this with III gives $x \ge |y| > |x| \ge x$, which is impossible.

So II is the only true statement among the first three, and both I and III are false. From II and the falsity of III, we get $x < |y| \le |x|$. If $x$ were non-negative, then $|x| = x$, giving $x < x$, which is impossible. Hence $x < 0$, so V is true and IV is false.

Therefore the true statements are II and V. For example, $x = y = -1$ satisfies these conditions.
