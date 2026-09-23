---
database: TMUA
qid: 90020260500
id: SMT-Ch8-Q5
paper: SMT Skills Ch8
year:
number: Q5
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: TMUA
solution_source: 书后解答
status: 已入库
---

## 题目
The geometric progression $A$ has a common ratio $r$ where $-1 < r < 1$ and terms $a_1, a_2, a_3, a_4, \dots$
The geometric progression $B$ has terms $a_1^3, a_2^3, a_3^3, a_4^3, \dots$
The sum to infinity of $B$ is denoted by $B_\infty$ and the sum to infinity of $A$ is denoted by $A_\infty$.
Given that $B_\infty = \frac{1}{7}(A_\infty)^3$, find the common ratio, $r$, of $A$.

$$\mathbf{A} \quad r = \frac{1}{2}$$

$$\mathbf{B} \quad r = \frac{1}{3}$$

$$\mathbf{C} \quad r = \frac{1}{4}$$

$$\mathbf{D} \quad r = \frac{1}{5}$$

$$\mathbf{E} \quad r = \frac{1}{6}$$

$$\mathbf{F} \quad r = \frac{1}{7}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 8 章 Sequences and series 章末 TMUA style 第 5 题；解析为书后官方 worked solution。
- 原书（Ch08 分册 p33–34）把选项印成 A、B、C、D、F、E 的跳序，读书笔记照原样保留；入库时按字母重排，各项内容与字母的对应未变。

## 答案
A

## 解析
Let the first term of $A$ be $a$. Then $A$ has common ratio $r$ with $-1 < r < 1$, and $B$ has first term $a^3$ and common ratio $r^3$, with $-1 < r^3 < 1$, so both sums to infinity exist:

$$A_\infty = \frac{a}{1-r}, \qquad B_\infty = \frac{a^3}{1-r^3}.$$

Substituting into $B_\infty = \frac{1}{7}\left(A_\infty\right)^3$ and cancelling $a^3$ (a geometric progression has $a \neq 0$),

$$\begin{aligned}
\frac{a^3}{1-r^3} &= \frac{1}{7} \times \frac{a^3}{(1-r)^3} \
7(1-r)^3 &= 1 - r^3 = (1-r)\left(1 + r + r^2\right) \
7(1-r)^2 &= 1 + r + r^2 \
7 - 14r + 7r^2 &= 1 + r + r^2 \
6r^2 - 15r + 6 &= 0 \
2r^2 - 5r + 2 &= 0 \
(2r - 1)(r - 2) &= 0.
\end{aligned}$$

So $r = \frac{1}{2}$ or $r = 2$, and the condition $-1 < r < 1$ rules out $r = 2$.

The correct answer is (A).

The root $r = 2$ is the built-in trap: it satisfies the algebra but neither sum to infinity exists for it.

> ⚠️ **原书排版怪癖（已核对原卷并更正正文）** —— 原书 Ch08 分册 p33–34 把这题的选项按 A、B、C、D 之后先 **F** $r = \frac{1}{7}$ 再 **E** $r = \frac{1}{6}$
> 的顺序印刷（字母跳序，是原书自己的排版怪癖）。本笔记正文原先按字母顺序重排成 E $= \frac{1}{7}$、F $= \frac{1}{6}$，等于把两个字母的取值对调了；
> 已照原卷改回 F $= \frac{1}{7}$、E $= \frac{1}{6}$。正确答案是 A（$r = \frac{1}{2}$），本身不受影响。

### MAT style questions
