---
database: TMUA
qid: 20132101207105
id: JZMaths_SetC-Mock-P1-Q5
paper: TMUA Mock
year:
number: Q5
section: Multiple Choice
difficulty: 6
topics: [Function, Logic and Proof]
subtopics: [Exponentials and Logarithms, Graphical Arguments]
tags: [General Algebra, Exponentials and Logarithms]
status: 已入库
---

## 题目
How many distinct real solutions does $4^x + 6^x = 9^x$ have?
$$ \mathbf{A} \quad 0 $$
$$ \mathbf{B} \quad 1 $$
$$ \mathbf{C} \quad 2 $$
$$ \mathbf{D} \quad 3 $$
$$ \mathbf{E} \quad 4 $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Compare the graphs of $y = 4^x + 6^x$ and $y = 9^x$. There is a solution between 1 and 2, since
$$ 4^1 + 6^1 > 9^1 $$
but
$$ 4^2 + 6^2 < 9^2. $$

After this crossing, $9^x$ grows faster than both $4^x$ and $6^x$, so once $9^x$ has overtaken $4^x + 6^x$, it cannot be caught again. This suggests that there is exactly one real solution.

**Remark:** This question belongs to a well-known class of problems. The usual version is more demanding and asks for the value of $x$. This is how it is done.

Divide through by $9^x$:
$$ \left(\frac{4}{9}\right)^x + \left(\frac{6}{9}\right)^x = 1, \quad \text{that is} \quad \left(\frac{2}{3}\right)^{2x} + \left(\frac{2}{3}\right)^x = 1. $$

Let $u = \left(\frac{2}{3}\right)^x$. Then $u > 0$ and
$$ u^2 + u - 1 = 0, $$
whose only positive root is
$$ u = \frac{\sqrt{5} - 1}{2}. $$

Since $\left(\frac{2}{3}\right)^x$ takes every positive value exactly once, there is exactly one real solution.
