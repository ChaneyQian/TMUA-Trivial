---
database: TMUA
qid: 20132101211218
id: BeyondHorizonS1-Mock-P2-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: [待补答案, 原卷缺陷]
status: 已入库
---

## 题目
Consider the following statements:
> (1) For all polygons, all angles being equal is not sufficient for the polygon to be regular.
>
> (2) There exists some polygon such that being able to draw a circle around the polygon which touches all its corners is sufficient for the polygon to be regular.
>
> (3) For all $n$ (where $n$ can take any value in $\{1,2,3,4\}$), there exists a hexagon with $n$ lines of symmetry.

Which one of the following is/are true?
$$\mathbf{A} \quad \text{None}$$
$$\mathbf{B} \quad 1$$
$$\mathbf{C} \quad 2$$
$$\mathbf{D} \quad 3$$
$$\mathbf{E} \quad \text{1 and 2}$$
$$\mathbf{F} \quad \text{1 and 3}$$
$$\mathbf{G} \quad \text{2 and 3}$$
$$\mathbf{H} \quad \text{1, 2, and 3}$$

## 备注

### 我的备注

### AI备注

- **原卷缺陷：量词作用域有三种合理读法，各自命中一个真实选项。**
  语句 (1)「For all polygons, all angles being equal is not sufficient for the polygon to be regular」
  与语句 (2)「There exists some polygon such that ... is sufficient for the polygon to be regular」
  的「sufficient」到底是相对**单个多边形**、还是相对**多边形整类**、还是**逐边数 $n$**，
  三种读法分别得到：

  | 读法 | (1) | (2) | (3) | 答案 |
  |---|---|---|---|---|
  | 逐个多边形（(2) 的语法迫使此读） | 假 | 真 | 假 | **C** |
  | 整类 | 真（矩形） | 真（有外接圆的菱形必为正方形） | 假 | **E** |
  | 逐边数 $n$ | 假（$n=3$ 时等角必等边） | 假 | 假 | **A** |

  三个答案 A、C、E **都在选项里**，所以这不是干扰项设计，是真歧义。
  语句 (3) 在任何读法下都假（4 条镜轴 $\Rightarrow D_4 \Rightarrow$ 4 阶旋转，
  但 $4 \nmid 6$，六边形的对称轴数只能是 0/1/2/3/6）。
  两轮独立解题分别给出 C 与 E。`ANSWER` 记 C（语句 (2) 的「there exists some polygon
  ... the polygon」在语法上锁定逐个体读法，(1) 与之平行），但不构成定论。

## 答案
C

## 解析
Statement (1) is universally quantified over polygons, so it asserts that for every polygon $P$ the implication "$P$ equiangular $\implies P$ regular" fails. It is enough to exhibit one polygon for which that implication holds, and a triangle does the job: an equiangular triangle is equilateral, hence regular, so for triangles equal angles genuinely is sufficient and the universal claim (1) is false. Statement (2) is existentially quantified and only needs one witness, and any regular pentagon serves, since for that particular polygon "cyclic $\implies$ regular" has a true conclusion; a non-cyclic quadrilateral works equally well by making the hypothesis false. So (2) is true. Statement (3) fails at $n=4$: a polygon with four lines of symmetry has dihedral symmetry group of order eight, which contains a rotation of order four, and such a rotation permutes the six vertices in orbits of size four while fixing no vertex, which is impossible since $4$ does not divide $6$. Hexagons can have $0$, $1$, $2$, $3$ or $6$ lines of symmetry but never $4$, so (3) is false and only statement 2 survives. The answer is C.
