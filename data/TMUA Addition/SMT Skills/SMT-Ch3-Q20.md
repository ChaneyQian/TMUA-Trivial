---
database: MAT
qid: 90020312000
id: SMT-Ch3-Q20
paper: SMT Skills Ch3
year:
number: Q20
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
The term with the greatest coefficient in the expansion of
$$ \left(2x^6 + \frac{1}{x^3}\right)^{12} $$
is

(a) $67 584 x^{60}$
(b) $101 376 x^{27}$
(c) $337 920 x^{45}$
(d) $126 720 x^{36}$
(e) $132 455 x^{54}$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 3 章 Algebra 章末 MAT style 第 20 题；解析为书后官方 worked solution。

## 答案
D

## 解析
Consider the coefficient of one term (say the $r^{\text{th}}$) divided by the coefficient of the next term, for ascending powers of $x$:
$\frac{_{r}^{12}{C \times}2^{r} \times 1^{12 - r}}{_{r + 1}^{12}{C \times}2^{r + 1} \times 1^{11 - r}} \equiv \frac{\left( \frac{12!}{r!(12 - r)!} \right)}{\left( \frac{12!}{(r + 1)!(12 - r - 1)!} \times 2 \right)} \equiv \frac{(r + 1)}{2(12 - r)}$, for $r = 0,\ 1,\ 2,\ 3,\ \ldots,\ 11$.
$\frac{(r + 1)}{2(12 - r)} > 1 \Leftrightarrow r + 1 > 24 - 2r$ since $12 - r > 0$. Then $r + 1 > 24 - 2r \Leftrightarrow 3r > 23 \Leftrightarrow r > \frac{23}{3} = 7\frac{2}{3}$. It follows that $\frac{\text{the coefficient of the }7^{\text{th}}\text{ term}}{\text{the coefficient of the }8^{\text{th}}\text{ term}} < 1$ but $\frac{\text{the coefficient of the }8^{\text{th}}\text{ term}}{\text{the coefficient of the }9^{\text{th}}\text{ term}} > 1$, and that, therefore, the $8^{\text{th}}$ term has the largest coefficient. The $8^{\text{th}}$ term is $_{8}^{12}{C \times}\left( 2x^{6} \right)^{8} \times \left( \frac{1}{x^{3}} \right)^{4} \equiv \frac{12!}{8!4!} \times 256x^{48} \times \frac{1}{x^{12}} \equiv \frac{12 \times 11 \times 10 \times 9}{4 \times 3 \times 2 \times 1} \times 256x^{36} \equiv 990 \times 128x^{36} \equiv (128000 - 1280)x^{36} \equiv 126720x^{36}$. (Realising that only one answer is a multiple of $x^{36}$, it is not necessary to spend time calculating the coefficient). The answer is (d).
