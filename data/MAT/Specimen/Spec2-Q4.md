---
database: MAT
qid: 90010310400
id: Spec2-Q4
paper: MAT Specimen 2
year: 2009
number: Q4
section: Long Question
audience: Maths
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/1998/98-Q3.md
status: 已入库
---
## 题目
For **APPLICANTS IN** $\left\{\begin{array}{l}\textbf{MATHEMATICS} \\ \textbf{MATHEMATICS \& STATISTICS} \\ \textbf{MATHEMATICS \& PHILOSOPHY}\end{array}\right\}$ **ONLY**.

Let $P$ and $Q$ be the points with co-ordinates $(7, 1)$ and $(11, 2)$.

**(i)** The mirror image of the point $P$ in the $x$-axis is the point $R$ with co-ordinates $(7, -1)$. Mark the points $P$, $Q$ and $R$ on the grid provided opposite.

**(ii)** Consider paths from $P$ to $Q$ each of which consists of two straight line segments $PX$ and $XQ$ where $X$ is a point on the $x$-axis. Find the length of the shortest such path, giving clear reasoning for your answer. (You may refer to the diagram to help your explanation, if you wish.)

**(iii)** Sketch in the line $c$ with equation $y = x$. Find the co-ordinates of $S$, the mirror image in the line $c$ of the point $Q$, and mark in the point $S$.

**(iv)** Consider paths from $P$ to $Q$ each of which consists of three straight line segments $PY$, $YZ$ and $ZQ$, where $Y$ is on the $x$-axis and $Z$ is on the line $c$. Find the shortest such path, giving clear reasoning for your answer.

![[Image/Spec2-Q4-fig1.png]]

## 备注

### 我的备注

### AI备注
本题与 `MAT/1998/98-Q3.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

差异：1998 原卷小问标号为 (a)–(d)，本卷为 (i)–(iv)；本卷附作图网格，1998 那份在库内没有配图。

## 答案
（无）

## 解析
The points $P$ and $Q$ have co-ordinates $(7, 1)$ and $(11, 2)$ respectively.

**(i)** $R$ has co-ordinates $(7, -1)$ and $P$, $Q$, $R$ are all marked on the grids below.

**(ii)** Consider all possible paths $PXQ$ where $X$ is a point on the $x$-axis. Such a path is drawn in the first grid below. Each such path $PXQ$ is of the same length as the path $RXQ$ as $R$ is the mirror image of $P$ in the $x$-axis. So the shortest possible path $PXQ$ will be of the same length as the shortest possible path $RXQ$. But it is clear that $RXQ$ is shortest when $X$ lies on the line segment $RQ$. In which case, Pythagoras' Theorem tells us that the shortest distance is
$$
|RQ| = \sqrt{(11 - 7)^{2} + (2 - (-1))^{2}} = \sqrt{4^{2} + 3^{2}} = 5.
$$

**(iii)** The mirror image of $Q(11, 2)$ in the line $c$ with equation $y = x$ is $S(2, 11)$.

**(iv)** Consider paths of the form $PYZQ$ where $Y$ lies on the $x$-axis and $Z$ lies on the line $c$.

As we have already noted the part of the path $PYZ$ is of the same length as $RYZ$.

Similarly the part of the path $YZQ$ is of the same length as the path $YZS$.

So the path $PYZQ$ is of the same length as $RYZS$ and the shortest such path is the straight line $RS$ which is of length
$$
|RS| = \sqrt{(7 - 2)^{2} + (-1 - 11)^{2}} = \sqrt{5^{2} + 12^{2}} = 13.
$$

![[Image/Spec2-Q4-sol1.png]]
