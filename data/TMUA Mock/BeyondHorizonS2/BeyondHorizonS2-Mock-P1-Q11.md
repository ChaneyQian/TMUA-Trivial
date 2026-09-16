---
database: TMUA
qid: 20132101212111
id: BeyondHorizonS2-Mock-P1-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 0
topics: [Geometry]
subtopics: [Solid Geometry]
tags: [Cone-Volume, Tangency, 原卷缺陷, 待补答案]
status: 已入库
---

## 题目
A hollow right circular cone rests on a sphere. The height of the cone is 4 metres and the radius of the base is 1 metre. The volume of the sphere is the same as that of the cone. Then, the distance between the centre of the sphere and the vertex of the cone is
$$\mathbf{A} \quad 4 \text{ metres}$$
$$\mathbf{B} \quad \sqrt{17} \text{ metres}$$
$$\mathbf{C} \quad \sqrt{15} \text{ metres}$$
$$\mathbf{D} \quad 5 \text{ metres}$$
$$\mathbf{E} \quad 6 \text{ metres}$$
$$\mathbf{F} \quad \sqrt{13} \text{ metres}$$

## 备注

### 我的备注

### AI备注
- **键对拍（2026-09-11，键源 tmua.fyi）**：键给 **D**（5 m），库原记 **B**（$\sqrt{17}$）。**两种读法各命中一个真实选项，改归第 4 类解读分歧。**
  键的读法：锥体（当作底面封闭）坐在球顶上、底面中心与球相切，$d=h+r=4+1=5$。
  库的读法：题面写 **hollow**，球在漏斗里与内侧母面相切，$d=r/\sin\alpha=\sqrt{17}$；底缘搁赤道的摆法不成立（球会穿出母面）。
  `ANSWER` 已改记 D（出题人意图），是否凭键放行由统筹者裁定。

## 答案
D

## 解析
The cone has volume $\frac{1}{3}\pi (1)^2 (4) = \frac{4\pi}{3}$, so the equal-volume sphere satisfies $\frac{4}{3}\pi r^3 = \frac{4\pi}{3}$ and has radius $r = 1$. Take the vertical cross-section through the axis. The semi-vertical angle $\alpha$ of the cone satisfies $\tan\alpha = \frac{1}{4}$, hence $\sin\alpha = \frac{1}{\sqrt{17}}$. The cone rests on the sphere with its slant surface tangent to it and the sphere's centre on the axis at distance $d$ from the vertex; the perpendicular distance from that centre to a slant line through the vertex is $d\sin\alpha$, and tangency forces
$$d\sin\alpha = r = 1 \quad \Longrightarrow \quad d = \sqrt{17}.$$
The answer is B. Option A is the trap of assuming the base rim rests on the sphere's equator, which is impossible here: that arrangement would put the centre only $4$ from the vertex, at distance $\frac{4}{\sqrt{17}} < 1$ from the slant surface, so the sphere would cut through the cone.

**Note (2026-09-11).** The published key gives **D**, $5$ metres. That corresponds to a different reading of "rests on a sphere": the cone sits on top of the sphere with its (closed) base tangent to the sphere at the base centre, so the centre is $h + r = 4 + 1 = 5$ from the vertex. The $\sqrt{17}$ above is the ball-in-funnel reading forced by the word "hollow" (the rim cannot sit on the equator, because the sphere would then pierce the slant surface). Both readings hit a printed option; the recorded answer follows the key.
