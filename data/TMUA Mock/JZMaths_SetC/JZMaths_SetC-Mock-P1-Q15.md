---
database: TMUA
qid: 20132101207115
id: JZMaths_SetC-Mock-P1-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 7
topics: [Sequences and Series]
subtopics: [Sequences and Series, AP GP, Recurrence Relations]
tags: [Sequences-and-Series, General-Algebra]
status: 已入库
---

## 题目
A sequence is defined by $a_0 = \frac{1}{2}$, and $a_n = 2 \sum_{r=0}^{n-1} a_r$ for $n \ge 1$. Evaluate
$$ \sum_{r=1}^\infty \frac{1}{a_r + a_{r+1}}. $$
$$ \mathbf{A} \quad \text{the sum does not converge} $$
$$ \mathbf{B} \quad \frac{3}{8} $$
$$ \mathbf{C} \quad \frac{5}{6} $$
$$ \mathbf{D} \quad \frac{4}{5} $$
$$ \mathbf{E} \quad \frac{5}{9} $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
The sequence $(a_n)$ is a geometric sequence in disguise! To see this, let
$$ S_n = \sum_{r=0}^n a_r. $$
For $n \ge 1$, we have
$$ a_n = 2 \sum_{r=0}^{n-1} a_r = 2S_{n-1}. $$
Therefore
$$ S_n = S_{n-1} + a_n = S_{n-1} + 2S_{n-1} = 3S_{n-1}. $$
Since $S_0 = a_0 = \frac{1}{2}$, it follows that $S_n$ is a geometric sequence:
$$ S_n = \frac{1}{2} \cdot 3^n. $$
For $n \ge 1$,
$$ a_n = S_n - S_{n-1} = \frac{1}{2} \cdot 3^n - \frac{1}{2} \cdot 3^{n-1} = 3^{n-1} $$
