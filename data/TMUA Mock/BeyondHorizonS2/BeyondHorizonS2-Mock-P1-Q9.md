---
database: TMUA
qid: 20132101212109
id: BeyondHorizonS2-Mock-P1-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: [待补答案, 原卷缺陷]
status: 已入库
---

## 题目
This sequence of transformations is applied to the curve $y = 3x^2$:

1. Translation by $\begin{pmatrix} 2 \\ -4 \end{pmatrix}$
2. Reflection in the $y$-axis
3. Stretch parallel to the $y$-axis with scale factor 3

What is the equation of the resulting curve?
$$\mathbf{A} \quad y = -3x^2 + 8x - 12$$
$$\mathbf{B} \quad y = -3x^2 + 8x - 6$$
$$\mathbf{C} \quad y = 9x^2 - 16x + 12$$
$$\mathbf{D} \quad y = 9x^2 - 36x + 24$$
$$\mathbf{E} \quad y = -27x^2 + 24x - 36$$
$$\mathbf{F} \quad y = -27x^2 + 24x - 18$$

## 备注

### 我的备注

### AI备注

- **原卷缺陷：按题面严格推导的结果不在选项内。**
  平移向量经页图 900dpi 放大确认是 $\binom{2}{-4}$。三步变换依次施加得
  $y = 9(x+2)^{2}-12 = 9x^{2}+36x+24$，选项里没有这一项。
  选项 D 是 $9x^{2}-36x+24 = 9(x-2)^{2}-12$，恰为其关于 $y$ 轴的镜像——
  即「漏掉第 2 步 $y$ 轴反射」或「向量取 $\binom{-2}{-4}$」的结果。
  首项系数与常数项都对得上，D 显然是出题人**意图**的键，但按题面它不成立。
  `ANSWER` 记 D 只是标注出题人意图，**不是题面的正确答案**。


## 答案
D

## 解析
Apply the three steps in order. The translation sends $y = 3x^2$ to $y = 3(x - 2)^2 - 4$, a parabola with vertex $(2, -4)$. Reflecting in the $y$-axis replaces $x$ by $-x$ and moves the vertex to $(-2, -4)$, giving $y = 3(x + 2)^2 - 4$. The stretch parallel to the $y$-axis with scale factor $3$ then multiplies the whole right-hand side by $3$:
$$y = 9(x + 2)^2 - 12 = 9x^2 + 36x + 24.$$
Only options C and D have leading coefficient $9$, and D is $9x^2 - 36x + 24 = 9(x - 2)^2 - 12$, the mirror image of the curve just obtained; it is exactly what the same three steps produce if the reflection in the $y$-axis is dropped, or if the translation vector is taken as $\begin{pmatrix} -2 \\ -4 \end{pmatrix}$. Since both the leading coefficient and the constant term match, D is plainly the intended key and is recorded as the answer, but the sign of the $x$ term disagrees with the printed transformation list. The answer is D.
TODO(待校对): Q9 严格按题面三步变换得 $y = 9x^2 + 36x + 24$，与任何选项都不符；选项 D 只差 $x$ 项符号，相当于漏掉第二步反射，或平移向量应为 $\begin{pmatrix} -2 \\ -4 \end{pmatrix}$。ANSWER 暂记 D，待裁定。
