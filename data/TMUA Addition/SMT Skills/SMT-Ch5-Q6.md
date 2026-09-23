---
database: TMUA
qid: 90020230600
id: SMT-Ch5-Q6
paper: SMT Skills Ch5
year:
number: Q6
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
Find the greatest sum, $x + y$, of the real values $x$ and $y$ that satisfy the simultaneous equations
$$ \log_2\left(\frac{x^2}{y}\right) = 6 \text{ and } 12 - \log_2 x = (\log_2 x)(\log_2 y). $$

$$\mathbf{A} \quad 16 + \frac{\sqrt{2}}{2}$$

$$\mathbf{B} \quad 32 + \frac{\sqrt{2}}{4}$$

$$\mathbf{C} \quad 16$$

$$\mathbf{D} \quad 20$$

$$\mathbf{E} \quad 32$$

$$\mathbf{F} \quad \frac{1 + 128\sqrt{2}}{512}$$

$$\mathbf{G} \quad 120$$

$$\mathbf{H} \quad 256$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 5 章 Functions 章末 TMUA style 第 6 题；解析为书后官方 worked solution。

## 答案
D

## 解析
$\log_{2}x^{2} - \log_{2}y = 6\ \ \overset{\Leftrightarrow}{\ }\ \ 2\log_{2}x - \log_{2}y = 6$

Let $a = \log_{2}x$ and $b = \log_{2}y$ so from the first equation $2a - b = 6$ A

From $12 - \log_{2}x = \left( \log_{2}x \right)\left( \log_{2}y \right)$, $12 - a = ab\ \ \overset{\Leftrightarrow}{\ }\ \ a(b + 1) = 12$ B

From A: $b = 2a - 6$

Substituting this into B: $a(2a - 5) = 12$

$2a^{2} - 5a - 12 = 0$

$(2a + 3)(a - 4) = 0$

$a = - \frac{3}{2}$ or $a = 4$

If $a = - \frac{3}{2}$, $b = - 3 - 6 = - 9$

If $a = 4$, $b = 8 - 6 = 2$

From $\left( - \frac{3}{2}, - 9 \right)$: $\log_{2}x = - \frac{3}{2}\ \ \overset{\Leftrightarrow}{\ }\ \ x = 2^{- \frac{3}{2}} = \frac{1}{2\sqrt{2}}$ and $\log_{2}y = - 9\ \ \overset{\Leftrightarrow}{\ }\ y = 2^{- 9} = \frac{1}{512}$

From $(4,2)$: $\log_{2}x = 4\ \ \overset{\Leftrightarrow}{\ }\ \ x = 2^{4} = 16$ and $\log_{2}y = 2\ \ \overset{\Leftrightarrow}{\ }\ y = 2^{2} = 4$

The maximum value of $x + y = 20$.

The correct answer is D
