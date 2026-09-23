---
database: MAT
qid: 90020351300
id: SMT-Ch7-Q13
paper: SMT Skills Ch7
year:
number: Q13
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
Which of the following is a sketch of the graph of
$y = \frac{1}{x^3 + 4x^2 - 4x - 16}$?

![[Image/SMT-Ch7-Q13-fig1.png]]

![[Image/SMT-Ch7-Q13-fig2.png]]

(a) graph (a)
(b) graph (b)
(c) graph (c)
(d) graph (d)
(e) graph (e)

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 7 章 Graphs 章末 MAT style 第 13 题；解析为书后官方 worked solution。
- 本题五个选项是图，标号 (a)–(e) 画在图内；下方 `(a) graph (a)` 等五行是入库时补的占位选项，仅为让前端能解析作答，非原书文字。

## 答案
E

## 解析
Factorise the denominator.
$$x^{3} + 4x^{2} - 4x - 16 = x^{2}(x + 4) - 4(x + 4) = (x + 4)\left(x^{2} - 4\right) = (x + 4)(x + 2)(x - 2)$$
So there are vertical asymptotes at $x = -4, -2, 2$: two of them close together on the negative side and one on the positive side. Only graphs (a)
and (e) show that arrangement — (b) and (d) have their isolated asymptote on the right, and (c) has only one asymptote (its denominator has a single real root).
The sign settles it. For large positive $x$ all three factors are positive, so $y \to 0^{+}$; and $y(0) = \frac{1}{-16} < 0$, so the central
branch lies below the axis. That is graph (e); graph (a) is its reflection in the $x$ axis and gets every sign the wrong way round.
The correct answer is (e).
