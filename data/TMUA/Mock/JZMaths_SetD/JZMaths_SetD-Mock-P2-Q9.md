---
database: TMUA
qid: 20132101208209
id: JZMaths_SetD-Mock-P2-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 7
topics: [Logic and Proof, Miscellaneous Pure, Function]
subtopics: [Logic, Inequalities, Absolute Value Functions]
tags: [Logic Deduction]
status: 已入库
---

## 题目
The real numbers $x$, $y$ and $z$ are such that exactly two of the following five statements are true.

Which two statements are true?

I $\quad x \le y + z$

II $\quad x \le |y| + |z|$

III $\quad y + z < |x|$

IV $\quad x + y + z > 0$

V $\quad x + y + z \le 0$

$$ \mathbf{A} \quad \text{Statements I and II.} $$
$$ \mathbf{B} \quad \text{Statements I and IV.} $$
$$ \mathbf{C} \quad \text{Statements I and V.} $$
$$ \mathbf{D} \quad \text{Statements III and IV.} $$
$$ \mathbf{E} \quad \text{Statements II and III.} $$
$$ \mathbf{F} \quad \text{Statements II and IV.} $$
$$ \mathbf{G} \quad \text{Statements II and V.} $$
$$ \mathbf{H} \quad \text{Statements III and V.} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Statements IV and V are negations of each other, so exactly one of them is true. Therefore, exactly one of statements I, II and III is true.

Statement I cannot be the only true one, because $y + z \le |y| + |z|$, so
$$ x \le y + z \le |y| + |z|. $$
Thus statement II would also be true.

Statement II cannot be the only true one. If III is false, then $y + z \ge |x| \ge x$, so statement I is also true.

Therefore, III is the only true statement among I, II and III. In particular, II is false, so
$$ x > |y| + |z|. $$

Hence $x > 0$, and moving $|y|$ and $|z|$ to side of $x$ gives:
$$ x + y + z \ge x - |y| - |z| > 0. $$

Therefore, IV is true and V is false.

Hence the two true statements are III and IV.

For example, $x = 3$, $y = 1$ and $z = 1$ satisfy these conditions.
