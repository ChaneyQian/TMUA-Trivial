---
database: TMUA
qid: 20132101204018
id: Zack-Mock-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
For which function is
$$ f(f(f(f(f(x))))) $$
never equal to 0 for any real $x$?

$$
\mathbf{A} \quad f(x) = \sin(x)
$$

$$
\mathbf{B} \quad f(x) = x^7
$$

$$
\mathbf{C} \quad f(x) = e^x - 1
$$

$$
\mathbf{D} \quad f(x) = \cos^2(x)
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Test each: we want a function whose fivefold composite can never hit $0$.

For $\sin x$, starting at $x=0$ gives $0$ at every stage, so $f^{5}(0)=0$. For $x^{7}$ the same is true at $x=0$. For $e^{x}-1$ we again have $f(0)=0$, so the composite vanishes at $0$. Each of A, B, C therefore fails.

For $f(x) = \cos^{2}x$, note first that after one application the value lies in $[0,1]$, and it stays there forever. To get $f^{5}(x) = 0$ we would need $\cos^{2}\left(f^{4}(x)\right) = 0$, i.e. $f^{4}(x) = \tfrac{\pi}{2}+k\pi$. But $f^{4}(x) \in [0,1]$ and the smallest such value is $\tfrac{\pi}{2} \approx 1.571 > 1$, so it is unreachable.

The answer is D.
