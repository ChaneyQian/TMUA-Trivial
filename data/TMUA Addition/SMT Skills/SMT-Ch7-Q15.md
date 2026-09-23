---
database: MAT
qid: 90020351500
id: SMT-Ch7-Q15
paper: SMT Skills Ch7
year:
number: Q15
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
The graph of all the points $(x, y)$ in the $xy$-plane that satisfy the equation $\sin(x + y) = 1$ is shown in

![[Image/SMT-Ch7-Q15-fig1.png]]

![[Image/SMT-Ch7-Q15-fig2.png]]

![[Image/SMT-Ch7-Q15-fig3.png]]

> This question requires radians so would not appear on a MAT paper. It is still a useful exercise in graph identification.

(a) graph (a)
(b) graph (b)
(c) graph (c)
(d) graph (d)
(e) graph (e)

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 7 章 Graphs 章末 MAT style 第 15 题；解析为书后官方 worked solution。
- 本题五个选项是图，标号 (a)–(e) 画在图内；下方 `(a) graph (a)` 等五行是入库时补的占位选项，仅为让前端能解析作答，非原书文字。

## 答案
B

## 解析
Solve the equation rather than guessing from the picture.
$$\sin(x + y) = 1 \iff x + y = \frac{\pi}{2} + 2n\pi \iff y = -x + \frac{\pi}{2} + 2n\pi$$
This is a family of parallel straight lines of gradient $-1$, with $y$ intercepts $\frac{\pi}{2} + 2n\pi$, that is
$\ldots, -\frac{3\pi}{2}, \frac{\pi}{2}, \frac{5\pi}{2}, \ldots$, spaced $2\pi$ apart vertically.
Graphs (c) and (d) have gradient $+1$, so they are wrong at once; (e) shows both families at once. Graph (a) does have gradient $-1$, but its
intercepts are $2n\pi$, so it is the graph of $x + y = 2n\pi$, that is of $\cos(x + y) = 1$.
The correct answer is (b).

> 关于 Ex2 Q12 与 Q15 的选项图，书中另注：这两题需要弧度制，因此不会出现在真正的 MAT 试卷上，但作为识图练习仍然有用。
