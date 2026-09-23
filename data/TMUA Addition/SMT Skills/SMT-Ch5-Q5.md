---
database: TMUA
qid: 90020230500
id: SMT-Ch5-Q5
paper: SMT Skills Ch5
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
The function $P$ is defined by $P(x) = x^4 + ax^3 + bx^2 + cx + 1$.
$a, b$ and $c$ are integers such that $|b| > |c| > |a|$ and $a \neq b \neq c \neq 0$.
The remainder when $P(x)$ is divided by $(x - 1)$ is $R$.
The remainder when $P(x)$ is divided by $(x + 1)$ is $S$.
Given that $S - R = 4$ and that $S = 2R$, what is the value of $c$?

$$\mathbf{A} \quad 1$$

$$\mathbf{B} \quad -1$$

$$\mathbf{C} \quad -2$$

$$\mathbf{D} \quad -3$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 5 章 Functions 章末 TMUA style 第 5 题；解析为书后官方 worked solution。

## 答案
D

## 解析
$p(1) = R$, $p( - 1) = S$

$$
S - R = 4
$$

$$
S = 2R
$$

$$
p( - 1) - p(1) = 4
$$

$$
p( - 1) = 2p(1)
$$

$$
p( - 1) = 1 - a + b - c + 1 = 2 - a + b - c
$$

$$
p(1) = 1 + a + b + c + 1 = 2 + a + b + c
$$

$$
2 - a + b - c - (2 + a + b + c) = 4\ \ \overset{\Leftrightarrow}{\ }\  - 2a - 2c = 4\ \ \overset{\Leftrightarrow}{\ }\ \ a + c = - 2
$$

$$
2 - a + b - c = 2(2 + a + b + c)\ \ \overset{\Leftrightarrow}{\ }\ 3a + 3c + b = - 2
$$

$- 6 + b = - 2\ \ \overset{\Leftrightarrow}{\ }\ \ b = 4$

$a \neq b \neq c \neq 0$

$|b| > |c| > |a|$ so possible values for $c$ are $\pm 3$, $\pm 2$ and $\pm 1$

If $c = - 3$, $a = 1$ which satisfies all of the required conditions

If $c = 3$, $a = - 5$ making $|b| > |c| > |a|$ untrue so reject this

If $c = - 2$, $a = 0$ making $a \neq b \neq c \neq 0$ untrue so reject this

If $c = 2$, $a = - 4$ making $|b| > |c| > |a|$ untrue so reject this

If $c = - 1$, $a = - 1$ making $a \neq b \neq c \neq 0$ and $|b| > |c| > |a|$ untrue so reject this

If $c = 1$, $a = - 3$ making $|b| > |c| > |a|$ untrue so reject this

The only value that fits all criteria is $c = - 3$ so the correct answer is D
