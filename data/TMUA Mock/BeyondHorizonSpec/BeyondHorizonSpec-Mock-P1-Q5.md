---
database: TMUA
qid: 20132101215105
id: BeyondHorizonSpec-Mock-P1-Q5
paper: TMUA Mock
year:
number: Q5
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Given that $A = (3\sqrt{x} + 60) + (3\sqrt{x} + 63) + \ldots + (3\sqrt{x} + 300)$, what is the smallest positive integer value of $x$ such that $\frac{A}{3}$ is a perfect square.
$$\mathbf{A} \quad 16$$
$$\mathbf{B} \quad 4$$
$$\mathbf{C} \quad 8$$
$$\mathbf{D} \quad 64$$
$$\mathbf{E} \quad 2$$
$$\mathbf{F} \quad 32$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
The constants $60, 63, \ldots, 300$ form an arithmetic progression with common difference 3, so there are $\frac{300-60}{3} + 1 = 81$ brackets, and their sum is $\frac{81(60+300)}{2} = 14580$. Each bracket also contributes $3\sqrt{x}$, so $A = 243\sqrt{x} + 14580$ and
$$\frac{A}{3} = 81\sqrt{x} + 4860 = 81\left(\sqrt{x} + 60\right).$$
A perfect square is in particular an integer, so $\sqrt{x}$ must be rational, and a rational square root of an integer is an integer; write $\sqrt{x} = n$. Since $81 = 9^2$ is already a square, $\frac{A}{3} = 9^2(n+60)$ is a perfect square precisely when $n + 60$ is one. The smallest positive $n$ with $n+60$ square is $n = 4$, giving $64$, and hence $x = n^2 = 16$. The answer is A.
