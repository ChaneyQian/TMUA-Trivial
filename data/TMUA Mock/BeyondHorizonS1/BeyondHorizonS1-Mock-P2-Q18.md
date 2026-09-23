---
database: TMUA
qid: 20132101211218
id: BeyondHorizonS1-Mock-P2-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 0
topics: [Logic and Proof, Geometry]
subtopics: [Logic, Euclid Geometry]
tags: [Truth-Value-List, Quantifiers, Sufficient-Condition, Counterexample, 原卷缺陷, 待补答案]
status: 已入库
---

## 题目
Consider the following statements:

	(1) For all polygons, all angles being equal is not sufficient for the polygon to be regular.
	(2) There exists some polygon such that being able to draw a circle around the polygon which touches all its corners is sufficient for the polygon to be regular.
	(3) For all $n$ (where $n$ can take any value in $\{1,2,3,4\}$), there exists a hexagon with $n$ lines of symmetry.

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
- **原卷答案键：B（仅 (1) 真）。** 2026-09-11 由统筹者交来。此前两轮盲解分别答 C 与 E，**都没对上**。
- **键 B 对应的读法**：把「X is (not) sufficient for Y」当作**对多边形整类的一般蕴含**来读——
  (1) 等角 $\not\Rightarrow$ 正（矩形是反例），真；
  (2) 「存在某种多边形，有外接圆 $\Rightarrow$ 正」——任何边数 $n$ 都有非正的圆内接 $n$ 边形，假；
  (3) 六边形不可能有恰好 4 条对称轴（$4 \nmid 6$），假。
- **歧义仍然真实存在**，所以 `原卷缺陷` 标签暂不摘：
  | 读法 | (1) | (2) | (3) | 答案 |
  |---|---|---|---|---|
  | 整类一般蕴含（**键**） | 真 | 假 | 假 | **B** |
  | 逐边数 $n$（$n=3$ 时等角必正） | 假 | 假 | 假 | A |
  | 逐个多边形（(2) 的 "the polygon" 语法） | 假 | 真 | 假 | C |
  | 「某种多边形」允许取子类（菱形：有外接圆 $\Rightarrow$ 正方形） | 真 | 真 | 假 | E |
  四种读法命中 A/B/C/E 四个真实选项。有了键之后 B 是**记录答案**，但学生按 (1) 的字面
  「for all polygons」在 $n=3$ 处找到反例而答 A，从逻辑上说不出错在哪。
- 是否凭键放行进组卷池，由统筹者裁定。
## 答案
B

## 解析
Statement (1) is universally quantified over polygons, so it asserts that for every polygon $P$ the implication "$P$ equiangular $\implies P$ regular" fails. It is enough to exhibit one polygon for which that implication holds, and a triangle does the job: an equiangular triangle is equilateral, hence regular, so for triangles equal angles genuinely is sufficient and the universal claim (1) is false. Statement (2) is existentially quantified and only needs one witness, and any regular pentagon serves, since for that particular polygon "cyclic $\implies$ regular" has a true conclusion; a non-cyclic quadrilateral works equally well by making the hypothesis false. So (2) is true. Statement (3) fails at $n=4$: a polygon with four lines of symmetry has dihedral symmetry group of order eight, which contains a rotation of order four, and such a rotation permutes the six vertices in orbits of size four while fixing no vertex, which is impossible since $4$ does not divide $6$. Hexagons can have $0$, $1$, $2$, $3$ or $6$ lines of symmetry but never $4$, so (3) is false and only statement 2 survives. The answer is C.
