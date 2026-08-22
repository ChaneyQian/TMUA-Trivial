---
database: TMUA
qid: 20132101213114
id: BeyondHorizonS3-Mock-P1-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
If $\alpha$ and $\beta$ are roots of the equation $x^2 + 5x - 5 = 0$, then $\left(\frac{1}{\alpha+1}\right)^3 + \left(\frac{1}{\beta+1}\right)^3$ equals
$$\mathbf{A} \quad -322$$
$$\mathbf{B} \quad \frac{4}{27}$$
$$\mathbf{C} \quad -\frac{4}{27}$$
$$\mathbf{D} \quad 3 + \sqrt{5}$$
$$\mathbf{E} \quad 4 + \sqrt{5}$$
$$\mathbf{F} \quad 5 + \sqrt{2}$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
From the quadratic, $\alpha + \beta = -5$ and $\alpha\beta = -5$. Write $u = \frac{1}{\alpha+1}$ and $v = \frac{1}{\beta+1}$. Then $(\alpha+1)(\beta+1) = \alpha\beta + \alpha + \beta + 1 = -5 - 5 + 1 = -9$, so $uv = -\frac{1}{9}$, while $u + v = \frac{(\alpha+1)+(\beta+1)}{-9} = \frac{-3}{-9} = \frac{1}{3}$. The identity $u^3 + v^3 = (u+v)^3 - 3uv(u+v)$ then gives $\frac{1}{27} - 3\left(-\frac{1}{9}\right)\left(\frac{1}{3}\right) = \frac{1}{27} + \frac{1}{9} = \frac{4}{27}$. A numerical check with $\alpha, \beta = \frac{-5 \pm \sqrt{45}}{2}$ returns $0.1481\ldots = \frac{4}{27}$. The answer is B. Option C is the sign trap, arising if one takes $uv = +\frac{1}{9}$ and mishandles the middle term.
