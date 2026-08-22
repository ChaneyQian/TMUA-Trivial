---
database: TMUA
qid: 20132101202107
id: Zetta-Mock-P1-Q7
paper: TMUA Mock
year:
number: Q7
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Let $A(n)$ be the area of a regular polygon with n sides, each of length 1, where $n \geq 3$.
Find, in terms of n, an expression for
$$ \frac{A(n)}{A(n + 1)} $$
[Angles in degrees]

$$
\mathbf{A} \quad \frac{(n + 1)\tan(90 - \frac{180}{n+1})}{n\tan(90 - \frac{180}{n})}
$$

$$
\mathbf{B} \quad \frac{n\tan(90 - \frac{180}{n})}{(n + 1)\tan(90 - \frac{180}{n+1})}
$$

$$
\mathbf{C} \quad \frac{n\tan(180 - \frac{360}{n})}{(n + 1)\tan(180 - \frac{360}{n+1})}
$$

$$
\mathbf{D} \quad \frac{4n\tan(180 - \frac{360}{4n})}{(n + 1)\tan(180 - \frac{360}{n+1})}
$$

$$
\mathbf{E} \quad \frac{n\tan(\frac{180}{n})}{(n + 1)\tan(\frac{180}{n+1})}
$$

$$
\mathbf{F} \quad \frac{n\tan(180 - \frac{360}{n})}{n\tan(90 - \frac{180}{n})}
$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Split the regular $n$-gon into $n$ isosceles triangles from the centre. Each has base $1$ and apex angle $\dfrac{360}{n}$, so its base angles are $\dfrac12\left(180-\dfrac{360}{n}\right) = 90-\dfrac{180}{n}$ and its height is $\dfrac12\tan\left(90-\dfrac{180}{n}\right)$. Hence

$$ A(n) = n\cdot\frac12\cdot 1\cdot\frac12\tan\left(90-\frac{180}{n}\right) = \frac{n}{4}\tan\left(90-\frac{180}{n}\right) $$

Taking the ratio, the factor $\tfrac14$ cancels:

$$ \frac{A(n)}{A(n+1)} = \frac{n\tan\left(90-\frac{180}{n}\right)}{(n+1)\tan\left(90-\frac{180}{n+1}\right)} $$

The answer is B. Option A is this ratio upside down, so check which of $A(n)$, $A(n+1)$ belongs on top.
