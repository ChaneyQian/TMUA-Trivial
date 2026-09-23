---
database: MAT
qid: 90020351200
id: SMT-Ch7-Q12
paper: SMT Skills Ch7
year:
number: Q12
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
Which of the graphs below shows a sketch of

	$y = e^{-\frac{1}{x^2}}\cos x^2$ for $-\pi \le x \le \pi$?

![[Image/SMT-Ch7-Q12-fig1.png]]

![[Image/SMT-Ch7-Q12-fig2.png]]

> This question requires radians so would not appear on a MAT paper. It is still a useful exercise in graph identification.

(a) graph (a)
(b) graph (b)
(c) graph (c)
(d) graph (d)
(e) graph (e)

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 7 章 Graphs 章末 MAT style 第 12 题；解析为书后官方 worked solution。
- 本题五个选项是图，标号 (a)–(e) 画在图内；下方 `(a) graph (a)` 等五行是入库时补的占位选项，仅为让前端能解析作答，非原书文字。

## 答案
D

## 解析
Read off the features of $y = e^{-\frac{1}{x^{2}}}\cos x^{2}$ one at a time; each one kills at least one option.

Both $\frac{1}{x^{2}}$ and $x^{2}$ are even, so the function is **even** and the graph is symmetric in the $y$ axis. Option (b) has its two halves
related by a half-turn about the origin, so it is out.

As $x \to 0$, $-\frac{1}{x^{2}} \to -\infty$, so $e^{-\frac{1}{x^{2}}} \to 0$ while $\cos x^{2} \to 1$: the curve is pressed extremely flat
against the $x$ axis near the origin. Option (c), which has $y = 1$ at $x = 0$, is out.

Since $0 < e^{-\frac{1}{x^{2}}} < 1$ and this factor increases with $|x|$, the oscillations grow in amplitude but never reach $1$. The zeros on
$0 < x \le \pi$ come from $x^{2} = \frac{\pi}{2},\ \frac{3\pi}{2},\ \frac{5\pi}{2}$, that is
$$x = 1.253,\qquad x = 2.171,\qquad x = 2.803$$
(the next would need $x^{2} = \frac{7\pi}{2} \approx 11.0 > \pi^{2}$), so there are three sign changes on each side, giving the pattern
$+,\ -,\ +,\ -$. Option (e) changes sign only once on each side, so it is out.

That leaves (a) and (d), which have the same sign pattern; the extreme values decide it. The first hump is small, because $e^{-\frac{1}{x^{2}}}$
is still tiny there: its top is about $0.20$ near $x = 0.93$. The later extremes are $-e^{-\frac{1}{\pi}} \approx -0.73$ at $x = \sqrt{\pi}$, then
$e^{-\frac{1}{2\pi}} \approx 0.85$ at $x = \sqrt{2\pi}$, then $-e^{-\frac{1}{3\pi}} \approx -0.90$ at $x = \sqrt{3\pi} \approx 3.07$, after which
the curve rises slightly to $y \approx -0.82$ at $x = \pi$. Graph (d) shows exactly this: a first zero just before $\frac{\pi}{2}$, a very shallow
first hump, and an endpoint just past a minimum near $-0.9$. In (a) the first hump reaches about $0.55$, its first zero is well past
$\frac{\pi}{2}$, and the curve is still plunging steeply through the axis at $x = \pi$.
The correct answer is (d).
