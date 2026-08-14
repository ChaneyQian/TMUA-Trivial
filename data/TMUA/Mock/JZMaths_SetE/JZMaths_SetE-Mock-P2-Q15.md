---
database: TMUA
qid: 20132101209215
id: JZMaths_SetE-Mock-P2-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 7.5
topics: [Function]
subtopics: ["Floor, Ceiling and Fractional Part Functions", Iterated Functions]
tags: [General-Functions]
status: 已入库
---

## 题目
For a real number $x$, let $\lfloor x \rfloor$ denote the greatest integer less than or equal to $x$. The fractional part of $x$ is then defined by
$$ \{x\} = x - \lfloor x \rfloor, $$
so $0 \le \{x\} < 1$.

For example, $\lfloor 3.7 \rfloor = 3$, so $\{3.7\} = 3.7 - 3 = 0.7$.

Also, $\lfloor -1.4 \rfloor = -2$, since $-2 \le -1.4 < -1$. Therefore $\{-1.4\} = -1.4 - (-2) = 0.6$.

Define
$$ f(x) = \{\{2x\} + \{3x\}\}. $$
How many values of $x$ with $0 \le x < 1$ satisfy $f(f(x)) = 1 - x$?
$$ \mathbf{A} \quad 20 $$
$$ \mathbf{B} \quad 21 $$
$$ \mathbf{C} \quad 24 $$
$$ \mathbf{D} \quad 25 $$
$$ \mathbf{E} \quad 26 $$
$$ \mathbf{F} \quad 30 $$
$$ \mathbf{G} \quad 31 $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
For any real $t$, Write $2t = \lfloor 2t \rfloor + \{2t\}$ and $3t = \lfloor 3t \rfloor + \{3t\}$. Then
$$ 5t = \lfloor 2t \rfloor + \lfloor 3t \rfloor + \{2t\} + \{3t\}. $$
Since $\lfloor 2t \rfloor + \lfloor 3t \rfloor$ is an integer, adding it does not change the fractional part. Hence
$$ \{5t\} = \{\{2t\} + \{3t\}\}. $$

For any real $t$,
$$ f(t) = \{\{2t\} + \{3t\}\} = \{5t\}. $$
Hence
$$ f(f(x)) = \{5\{5x\}\} = \{25x\}. $$
Suppose $\{25x\} = 1 - x$. Writing $n = \lfloor 25x \rfloor$ gives $25x - n = 1 - x$, so
$$ x = \frac{n + 1}{26}. $$
This gives the $25$ values
$$ x = \frac{1}{26}, \frac{2}{26}, \dots, \frac{25}{26}. $$
