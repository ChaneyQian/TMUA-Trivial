---
database: TMUA
qid: 20132101202116
id: Zetta-Mock-P1-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
$a, b$ and $c$ are positive integers so that
$$ \frac{\dfrac{a}{c} + \dfrac{a}{b} + 1}{\dfrac{b}{a} + \dfrac{b}{c} + 1} = 17 $$
How many solutions are there to the inequality
$$ a + 2b + 3c \leq 50 $$

$$
\mathbf{A} \quad 14
$$

$$
\mathbf{B} \quad 15
$$

$$
\mathbf{C} \quad 16
$$

$$
\mathbf{D} \quad 17
$$

$$
\mathbf{E} \quad 18
$$

$$
\mathbf{F} \quad 19
$$

$$
\mathbf{G} \quad 0
$$

## 备注

### 我的备注

### AI备注

- **题干在 2026-08-22 订正过：原为乘积，实际是商。**
  整卷 MD 首次转写（2026-07-28）把原卷的
  $\dfrac{\left(\frac{a}{c}+\frac{a}{b}+1\right)}{\left(\frac{b}{a}+\frac{b}{c}+1\right)}=17$
  写成了两括号相乘。后果是**方程在正整数里根本无解**——穷举 $a,b,c \in [1,54]$ 零命中，
  而原卷答案键给的是 A（14）。回原卷第 17 页页图逐字确认后订正为商。
  订正后两括号的公共分子 $ab+ac+bc$ 相消，条件化简成 $a=17b$，
  解数恰为 14，与答案键吻合。**这条留在这里是为了防止后来者"照旧版 MD 再改回去"。**


## 答案
A

## 解析
Put each bracket over a common denominator. Both numerators turn out to be the same symmetric expression:

$$ \frac{a}{c}+\frac{a}{b}+1 = \frac{ab+ac+bc}{bc}, \qquad \frac{b}{a}+\frac{b}{c}+1 = \frac{bc+ab+ac}{ac} $$

Dividing one by the other, the whole symmetric factor cancels and only the denominators survive:

$$ \frac{(ab+ac+bc)/bc}{(ab+ac+bc)/ac} = \frac{ac}{bc} = \frac{a}{b} $$

So the condition is simply $a = 17b$, and the problem reduces to counting positive integers with

$$ 17b+2b+3c \leq 50 \implies 19b+3c \leq 50 $$

For $b=1$: $3c \leq 31$, so $c = 1,\dots,10$ — ten solutions. For $b=2$: $3c \leq 12$, so $c=1,\dots,4$ — four solutions. For $b \geq 3$ already $19b > 50$.

That gives $10+4 = 14$ triples, so the answer is A.
