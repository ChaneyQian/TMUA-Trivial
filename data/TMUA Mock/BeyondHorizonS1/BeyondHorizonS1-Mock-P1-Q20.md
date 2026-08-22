---
database: TMUA
qid: 20132101211120
id: BeyondHorizonS1-Mock-P1-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: [待补答案, 原卷缺陷]
status: 已入库
---

## 题目
A right-circular cone $A$ with base radius $3$ units and height $5$ units is truncated so that the radius of the top circle is $1.5$ units, with the top parallel to the base. A second right-circular cone $B$ with base radius $5$ units and height $6$ units is placed vertically inside cone $A$.
What is the volume of the cone $B$ outside cone $A$ plus the portion of cone $A$ excluding the part inside cone $B$?
$$\mathbf{A} \quad \frac{1867}{40}\pi$$
$$\mathbf{B} \quad \frac{1913}{40}\pi$$
$$\mathbf{C} \quad \frac{2417}{40}\pi$$
$$\mathbf{D} \quad \frac{2153}{40}\pi$$
$$\mathbf{E} \quad \frac{1867}{20}\pi$$
$$\mathbf{F} \quad \frac{2417}{20}\pi$$

## 备注

### 我的备注

### AI备注

- **原卷缺陷：几何描述字面上不可能成立。**
  题面说底半径 5、高 6 的锥 $B$ 被 placed **inside** 截头的锥 $A$（底半径 3、高 2.5），
  但 $B$ 比 $A$ 又宽又高，字面读法自相矛盾。
  按「同轴共底面、$A$ 含于 $B$」读得 $\frac{1475}{40}\pi$，**不在选项内**；
  另试三种摆法同样不命中。唯一能精确命中选项的读法是
  「$B$ 尖朝下从 $A$ 顶部半径 1.5 的开口插入卡住，没入部分为半径 1.5、高 1.8 的小锥」，
  得 $\frac{2417}{40}\pi$ = 选项 C。`ANSWER` 记 C 是基于**这个未在题面写明的摆放假设**，
  并非题面推出的结论。


## 答案
C

## 解析
The quantity asked for is the volume of the symmetric difference, namely $V_A + V_B - 2V_{A \cap B}$. For cone $A$, the radius shrinks linearly from $3$ at the base to $0$ at height $5$, so it equals $1.5$ at height $2.5$; the truncated solid is therefore a frustum of height $2.5$ with radii $3$ and $1.5$, and
$$V_A = \frac{\pi \times 2.5}{3}\left( 3^2 + 3 \times 1.5 + 1.5^2 \right) = \frac{\pi \times 2.5 \times 15.75}{3} = \frac{105\pi}{8}$$
Cone $B$ has volume $V_B = \frac{1}{3}\pi \times 5^2 \times 6 = 50\pi$. Cone $B$ is far too wide to fit inside the frustum, so placing it vertically inside cone $A$ means lowering it point-first into the circular opening of radius $1.5$ at the top; it wedges there, and the part that has entered is the tip of $B$ cut off at radius $1.5$. On cone $B$ the radius grows from the apex at rate $5/6$ per unit of height, so radius $1.5$ is reached at height $1.5 \times \frac{6}{5} = 1.8$, and that submerged tip is a cone of radius $1.5$ and height $1.8$:
$$V_{A \cap B} = \frac{1}{3}\pi \times 1.5^2 \times 1.8 = \frac{27\pi}{20}$$
This tip really does sit inside the frustum, since at depth $d$ below the top face the frustum has inner radius $1.5 + 0.6d$ while the tip has radius at most $1.5$, and the tip is shorter than the frustum's height of $2.5$. Combining,
$$V_A + V_B - 2V_{A \cap B} = \frac{105\pi}{8} + 50\pi - \frac{27\pi}{10} = \frac{525\pi + 2000\pi - 108\pi}{40} = \frac{2417\pi}{40}$$
The answer is C. Options E and F are the traps: they carry the right kind of numerator over the wrong denominator, and F in particular is exactly twice the correct value.
