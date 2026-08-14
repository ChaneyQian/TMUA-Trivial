---
database: TMUA
qid: 20132101209120
id: JZMaths_SetE-Mock-P1-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 9
topics: [Calculus, Logic and Proof, Function]
subtopics: [Integral of Inverse function, Graphical Arguments, Integration, Exponentials and Logarithms]
tags: [Integration, Exponentials-and-Logarithms, Graphs-of-Functions]
status: 已入库
---

## 题目
You may use the following fact.

If $f$ and $g$ are strictly increasing functions defined for $x \ge 0$, and satisfy $f(g(x)) = x$ for all $x \ge 0$, then the graphs of $f$ and $g$ are reflections of each other in the line $y = x$.

Given that
$$ \int_0^4 \left( 2^{\sqrt{x}} - 1 \right) \, dx = k \, , $$
find
$$ \int_0^3 \left( \log_2(4 - x) \right)^2 \, dx $$
in terms of $k$.

$$ \mathbf{A} \quad 2k $$
$$ \mathbf{B} \quad 3 $$
$$ \mathbf{C} \quad 6 - k $$
$$ \mathbf{D} \quad 6 + k $$
$$ \mathbf{E} \quad 12 - k $$
$$ \mathbf{F} \quad k $$
$$ \mathbf{G} \quad 9 - k $$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
First consider
$$ f(x) = 2^{\sqrt{x}} - 1 $$
and
$$ g(x) = \left( \log_2(4 - x) \right)^2. $$

It is natural to check whether $f(g(x)) = x$, but this is not true.

However, reflecting the graph of $y = (\log_2(4 - x))^2$ in the line $x = \frac{3}{2}$ does not change the area under the graph from $x = 0$ to $x = 3$. This reflection replaces $x$ by $3 - x$, giving
$$ g(x) = (\log_2(4 - (3 - x)))^2 = (\log_2(x + 1))^2 \, . $$

Now, for $x \ge 0$, we have $\log_2(x + 1) \ge 0$, so
$$ f(g(x)) = 2^{\sqrt{(\log_2(x + 1))^2}} - 1 = 2^{\log_2(x + 1)} - 1 = x. $$

Therefore $f$ and $g$ are inverse functions, so their graphs are reflections of each other in the line $y = x$.

Since $f(0) = 0$ and $f(4) = 3$, the areas under the two graphs fill a rectangle of dimensions $4$ by $3$. Hence
$$ \int_0^4 \left( 2^{\sqrt{x}} - 1 \right) \, dx + \int_0^3 \left( \log_2(x + 1) \right)^2 \, dx = 12. $$

The first integral is $k$, so
$$ \int_0^3 (\log_2(x + 1))^2 \, dx = 12 - k. $$

Finally, reflection in the line $x = \frac{3}{2}$ preserves the area, so
$$ \int_0^3 (\log_2(4 - x))^2 \, dx = 12 - k. $$

**Remark.** Well done - you survived this horrific question, which combines two difficult geometric ideas: reflection in the line $y = x$ and reflection in a vertical line $x = a$. Each idea is tricky on its own; together, they make one hell of a puzzle!
