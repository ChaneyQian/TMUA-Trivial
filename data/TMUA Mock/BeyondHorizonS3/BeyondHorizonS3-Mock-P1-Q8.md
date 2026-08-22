---
database: TMUA
qid: 20132101213108
id: BeyondHorizonS3-Mock-P1-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: [待补答案, 原卷缺陷]
status: 已入库
---

## 题目
The area enclosed between the line $y = kx$ and the curve $y = x^3$ is $8$. What is the value of $k$?
$$\mathbf{A} \quad 2$$
$$\mathbf{B} \quad 4$$
$$\mathbf{C} \quad \sqrt{2}$$
$$\mathbf{D} \quad \sqrt{5}$$
$$\mathbf{E} \quad 4\sqrt{2}$$
$$\mathbf{F} \quad 2\sqrt{5}$$

## 备注

### 我的备注

### AI备注

- **原卷缺陷：「the area」指代不明，两种读法各自命中一个真实选项。**
  直线 $y=kx$ 与曲线 $y=x^{3}$ 交于 $x=0,\pm\sqrt{k}$ 三点，围出**两块全等区域**，
  而题面用的是单数 "the area"：

  - 按两块之和 $\dfrac{k^{2}}{2}=8$ 得 $k=4$ —— 选项 B
  - 按单块 $\dfrac{k^{2}}{4}=8$ 得 $k=4\sqrt2$ —— 选项 E

  两者都在选项里。两轮独立解题都按通行的「总面积」读法取 B，故 `ANSWER` 记 B，
  但题面需补「total area」或「the area in the first quadrant」才唯一。

## 答案
B

## 解析
The two graphs meet where $x^3 = kx$, i.e. at $x = 0$ and $x = \pm\sqrt{k}$, so a closed region exists only for $k > 0$ and it consists of two congruent lobes symmetric about the origin (both $y = kx$ and $y = x^3$ are odd). On $0 < x < \sqrt{k}$ the line lies above the cubic, so the total enclosed area is $2\int_0^{\sqrt{k}} (kx - x^3)\,dx = 2\left[\frac{kx^2}{2} - \frac{x^4}{4}\right]_0^{\sqrt{k}} = 2\left(\frac{k^2}{2} - \frac{k^2}{4}\right) = \frac{k^2}{2}$. Setting $\frac{k^2}{2} = 8$ gives $k^2 = 16$ and, taking the positive root demanded by the geometry, $k = 4$. The answer is B. Option A is the trap for anyone who computes only one lobe and solves $\frac{k^2}{4} = 8$ incorrectly, or who stops at $k^2/2 = 8$ and reads off the wrong root.
