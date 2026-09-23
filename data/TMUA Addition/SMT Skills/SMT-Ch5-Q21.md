---
database: MAT
qid: 90020332100
id: SMT-Ch5-Q21
paper: SMT Skills Ch5
year:
number: Q21
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
The function $f(n)$ is defined for positive integers $n$ by $f(1) = 1, f(2) = -1$ and then by the identities
$$ f(2n) = (f(n))^n, \quad f(2n+1) = (f(n))^{n+1} \text{ for } n \ge 2 $$
The sum $f(1) + f(2) + f(3) + \dots + f(100)$ equals

(a) $88$
(b) $80$
(c) $60$
(d) $50$
(e) $-22$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 5 章 Functions 章末 MAT style 第 21 题；解析为书后官方 worked solution。

## 答案
A

## 解析
All of the values will be $1$ or $- 1$. The only values that will be $- 1$ will stem from $2$. They have to be odd powers of $- 1$.

$$
\begin{matrix}
2 \
-1
\end{matrix} \rightarrow \begin{matrix}
2n + 1 = 5 \
( - 1)^{3} = - 1
\end{matrix} \rightarrow \begin{matrix}
2n = 10 \
( - 1)^{5} = - 1
\end{matrix} \rightarrow \begin{matrix}
2n + 1 = 21 \
( - 1)^{11} = - 1
\end{matrix} \rightarrow \begin{matrix}
2n = 42 \
( - 1)^{21} = - 1
\end{matrix} \rightarrow \begin{matrix}
2n + 1 = 85 \
( - 1)^{43} = - 1
\end{matrix}
$$

These are the only possible $- 1$ values in $f(1)$ to $f(100)$ since the next time $- 1$ occurs is for $f(85 \times 2)$ which is not a part of the sum.

There are six values that give $- 1$ and $94$ values that give $1$.

Hence the sum is $94 - 6 = 88$

The correct answer is (a)
