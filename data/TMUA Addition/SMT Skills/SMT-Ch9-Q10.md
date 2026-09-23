---
database: MAT
qid: 90020371000
id: SMT-Ch9-Q10
paper: SMT Skills Ch9
year:
number: Q10
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: MAT
solution_source: 书后解答
status: 已入库
---

## 题目
The line $y = x$ intersects the circle $(x - 1)^2 + (y - 1)^2 = 1$ at the point $A$ where the $x$ coordinate and $y$ coordinate of $A$ are both less than $1$. The point $B$ is on the circumference of the circle and directly above its centre, $X$. The point $C$ is such that $ABC$ forms a right-angled triangle. This is shown in the diagram.

![[Image/SMT-Ch9-Q10-fig1.png]]

From this diagram, $\tan 67.5^\circ$ is equal to

(a) $\frac{\sqrt{2}}{2}$
(b) $1 + \sqrt{2}$
(c) $\frac{1}{1 + \sqrt{2}}$
(d) $1 - \sqrt{2}$
(e) $\sqrt{2} - 1$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 9 章 Trigonometry 章末 MAT style 第 10 题；解析为书后官方 worked solution。

## 答案
B

## 解析
First pin down the points. Substituting $y = x$ into the circle gives

$$2(x-1)^2 = 1, \qquad x = 1 \pm \frac{1}{\sqrt{2}},$$

and the intersection with both coordinates less than $1$ is

$$A = \left(1 - \frac{\sqrt{2}}{2},\ 1 - \frac{\sqrt{2}}{2}\right).$$

The centre is $X = (1,1)$ and $B$, directly above it on the circle, is $B = (1, 2)$. From the diagram $C$ is the foot of the right angle, level with $A$ and directly below $B$, so $C = \left(1,\ 1 - \frac{\sqrt{2}}{2}\right)$.

![[Image/SMT-Ch9-Q10-sol1.png]]

Next find the angle at $A$. The radius $XB$ points straight up and the radius $XA$ points from $X$ back down the line $y = x$, which is $45^\circ$ below the horizontal, so

$$\angle AXB = 90^\circ + 45^\circ = 135^\circ.$$

Triangle $AXB$ is isosceles because $XA = XB = 1$ are both radii, so its two base angles are equal:

$$\angle XAB = \frac{180^\circ - 135^\circ}{2} = 22.5^\circ.$$

Since $AC$ is horizontal and $AX$ lies along $y = x$, we also have $\angle XAC = 45^\circ$, and therefore

$$\angle BAC = 45^\circ + 22.5^\circ = 67.5^\circ.$$

Finally, $ABC$ is right-angled at $C$, so $\tan\angle BAC = \frac{BC}{AC}$ with

$$AC = 1 - \left(1 - \frac{\sqrt{2}}{2}\right) = \frac{\sqrt{2}}{2}, \qquad BC = 2 - \left(1 - \frac{\sqrt{2}}{2}\right) = 1 + \frac{\sqrt{2}}{2}.$$

Hence

$$\tan 67.5^\circ = \frac{1 + \frac{\sqrt{2}}{2}}{\frac{\sqrt{2}}{2}} = \frac{2 + \sqrt{2}}{\sqrt{2}} = \sqrt{2} + 1.$$

The correct answer is (b).

The same diagram gives $\tan 22.5^\circ = \frac{AC}{BC} = \frac{1}{1+\sqrt{2}}$, which is the trap: options (c) and (e) are both this reciprocal value.

> ⚠️ **原书选项重复** —— 选项 (c) $\frac{1}{1+\sqrt{2}}$ 与 (e) $\sqrt{2}-1$ 是同一个数：$\frac{1}{1+\sqrt{2}} = \frac{\sqrt{2}-1}{(\sqrt{2}+1)(\sqrt{2}-1)} = \sqrt{2}-1$。
> 二者都等于 $\tan 22.5^\circ$，都不是本题答案，但一份合格的选择题不应把同一个值印成两个不同选项。
