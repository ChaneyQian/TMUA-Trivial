---
database: TMUA
qid: 90020210900
id: SMT-Ch3-Q9
paper: SMT Skills Ch3
year:
number: Q9
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
Find the coefficient of
$$ (1 - x)^0 - (1 - x)^1 + (1 - x)^2 - (1 - x)^3 + (1 - x)^4 - \dots + (1 - x)^{50} $$

$$\mathbf{A} \quad 51$$

$$\mathbf{B} \quad -51$$

$$\mathbf{C} \quad -25$$

$$\mathbf{D} \quad 25$$

$$\mathbf{E} \quad 1725$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 3 章 Algebra 章末 TMUA style 第 9 题；解析为书后官方 worked solution。

## 答案
C

## 解析
For any positive integer, $n$, the expansion of $(1 - x)^{n}$ begins $1 - nx + \ldots$, and $(1 - x)^{0} \equiv 1$ (assuming $x \neq 0$).
It follows that the $x$ term in the above expression is $- ( - x) + ( - 2x) - ( - 3x) + ( - 4x) - \ldots + ( - 50x)$, and that this has coefficient $1 - 2 + 3 - 4 + \ldots - 50$. This sum is $25$ groups of $n - (n + 1) = - 1$ where $n = 1,\ 3,\ \ldots,\ 49$. Therefore the coefficient of $x$ is $25 \times ( - 1) = - 25$. The answer is C.
