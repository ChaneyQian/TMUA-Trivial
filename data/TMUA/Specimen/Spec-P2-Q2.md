---
database: TMUA
qid: 20150220200
id: Spec-P2-Q2
paper: TMUA P2
year: 2015
number: Q2
section: Reasoning
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
The gradient of the curve $y = \dfrac{(3x-2)^2}{x\sqrt{x}}$ at the point where $x = 2$ is

$$
\mathbf{A} \quad \dfrac{3}{2}\sqrt{2}
$$

$$
\mathbf{B} \quad 3\sqrt{2}
$$

$$
\mathbf{C} \quad 4\sqrt{2}
$$

$$
\mathbf{D} \quad \dfrac{9}{2}\sqrt{2}
$$

$$
\mathbf{E} \quad 6\sqrt{2}
$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
We expand the brackets and divide through by the denominator to write everything as a single power of x:

$$
\begin{array}{r l} y & = \frac {(3 x - 2) ^ {2}}{x \sqrt {x}} \\ & = \frac {9 x ^ {2} - 1 2 x + 4}{x ^ {\frac {3}{2}}} \\ & = 9 x ^ {\frac {1}{2}} - 1 2 x ^ {- \frac {1}{2}} + 4 x ^ {- \frac {3}{2}}. \end{array}
$$

Therefore

$$
\begin{array}{c} \frac {\mathrm{d} y}{\mathrm{d} x} = 9 \times \frac {1}{2} x ^ {- \frac {1}{2}} - 1 2 \times (- \frac {1}{2}) x ^ {- \frac {3}{2}} + 4 \times (- \frac {3}{2}) x ^ {- \frac {5}{2}} \\ = \frac {9}{2} x ^ {- \frac {1}{2}} + 6 x ^ {- \frac {3}{2}} - 6 x ^ {- \frac {5}{2}}. \end{array}
$$

Substituting in $x = 2$ gives us the gradient at $x = 2 \cdot$

$$
\begin{array}{r l} & {\frac {\mathrm{d} y}{\mathrm{d} x} = \frac {9}{2} \times \frac {1}{\sqrt {2}} + 6 \times \frac {1}{2 \sqrt {2}} - 6 \times \frac {1}{4 \sqrt {2}}} \\ & {\qquad = \frac {9 + 6 - 3}{2 \sqrt {2}}} \\ & {\qquad = \frac {6}{\sqrt {2}}} \\ & {\qquad = 3 \sqrt {2},} \end{array}
$$

hence the answer is option B.
