---
database: TMUA
qid: 20132101209211
id: JZMaths_SetE-Mock-P2-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 7
topics: [Logic and Proof]
subtopics: [Logic]
tags: [Logic-Negation]
status: 已入库
---

## 题目
Let $f$ be a real function and let $a$ be a real number.

We say that $f$ is **smoothly joined** at $x=a$ if and only if, for every real number $h > 0$, there exists a real number $d > 0$ such that, for every real number $x$, if $|x - a| < d$, then $|f(x) - f(a)| < h$.

Which of the following means that $f$ is **not smoothly joined** at $x = a$?
$$ \mathbf{A} \quad \text{For every real number } h > 0, \text{ for every real number } d > 0, \text{ there exists a real number } x \text{ such that } |x - a| < d \text{ and } |f(x) - f(a)| \ge h. $$
$$ \mathbf{B} \quad \text{There exists a real number } h > 0 \text{ such that there exists a real number } d > 0 \text{ such that, for every real number } x, \text{ if } |x - a| < d, \text{ then } |f(x) - f(a)| \ge h. $$
$$ \mathbf{C} \quad \text{There exists a real number } h > 0 \text{ such that, for every real number } d > 0, \text{ there exists a real number } x \text{ such that } |x - a| < d \text{ and } |f(x) - f(a)| \ge h. $$
$$ \mathbf{D} \quad \text{There exists a real number } h > 0 \text{ such that, for every real number } d > 0, \text{ for every real number } x, \text{ if } |x - a| < d, \text{ then } |f(x) - f(a)| \ge h. $$
$$ \mathbf{E} \quad \text{For every real number } h > 0, \text{ there exists a real number } d > 0 \text{ such that, for every real number } x, \text{ if } |x - a| < d, \text{ then } |f(x) - f(a)| \ge h. $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The definition says that $f$ is **smoothly joined** at $x = a$ exactly when

for every $h > 0$, there exists $d > 0$, such that for every $x$, if $|x - a| < d$, then $|f(x) - f(a)| < h$.

To negate this, reverse each quantifier and negate the final implication, starting from the outside and working inwards, and recursively do this until the innermost statement is reached.

So start with: there exists some $h > 0$ for which the following statement is false.

The false version of the following statement is its negation. Therefore we need:

for all $d > 0$, the following statement is false.

Now the false version of the following statement is also its negation. Therefore we get:

there must exist some $x$ with the desired property $|x - a| < d$, for which the following statement is false, that is, $|f(x) - f(a)| \ge h$.

Putting it all together, $f$ is therefore **not smoothly joined** at $x = a$ means:

there exists $h > 0$ such that for every $d > 0$, there exists $x$ such that $|x - a| < d$ and $|f(x) - f(a)| \ge h$.

This is the third statement.
