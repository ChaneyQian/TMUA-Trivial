---
database: TMUA
qid: 20132101206111
id: JZMaths_SetB-Mock-P1-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 7
topics: [Trigonometry, Sequences and Series]
subtopics: [Trigonometry, Sequences and Series]
tags: [Sequences-and-Series, General-Trigonometry]
status: 已入库
---

## 题目
Given
$$ a_n = \sin\left(\frac{2\pi}{3}n\right) + \cos\left(\frac{\pi}{6}(1+4n)\right) $$
and
$$ S = \sum_{n=1}^k a_n. $$
For how many values of positive integer $k$ such that $1 \le k \le 100$, is $S = 0$.

$$ \mathbf{A} \quad 0 $$
$$ \mathbf{B} \quad 33 $$
$$ \mathbf{C} \quad 34 $$
$$ \mathbf{D} \quad 66 $$
$$ \mathbf{E} \quad 67 $$
$$ \mathbf{F} \quad 100 $$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
As $n$ increases by $1$, the angle in $\sin\left(\frac{2\pi}{3}n\right)$ increases by $\frac{2\pi}{3}$. Hence this term has period $3$.

For $n=1, 2, 3$, its values are

$$ \sin\left(\frac{2\pi}{3}\right) = \frac{\sqrt{3}}{2}, \qquad \sin\left(\frac{4\pi}{3}\right) = -\frac{\sqrt{3}}{2}, \qquad \sin(2\pi) = 0. $$

Similarly, as $n$ increases by $1$, the angle in $\cos\left(\frac{\pi}{6}(1+4n)\right)$ also increases by $\frac{2\pi}{3}$. Hence this term also has period $3$.

For $n=1, 2, 3$, its values are

$$ \cos\left(\frac{5\pi}{6}\right) = -\frac{\sqrt{3}}{2}, \qquad \cos\left(\frac{3\pi}{2}\right) = 0, \qquad \cos\left(\frac{13\pi}{6}\right) = \frac{\sqrt{3}}{2}. $$

Therefore the sequence $a_n$ repeats every 3 terms, with values obtained by adding the corresponding values of the $\cos$ and $\sin$ terms:
$$
0,\quad -\frac{\sqrt{3}}{2},\quad \frac{\sqrt{3}}{2}.
$$
So each complete block of 3 terms has sum 0.

The running sums $a_1$, $a_1+a_2$, $a_1+a_2+a_3$ are therefore:
$$
0,\quad -\frac{\sqrt{3}}{2},\quad 0.
$$

So $S_k=0$ when $k$ is either the first or third position in one of these repeated blocks of 3, or we can say is when $k$ is $1$ or $0 \pmod 3$.

From 1 to 99, there are 33 complete blocks, giving 2 suitable values of $k$ from each block. This gives
$$
33\cdot 2=66
$$
values. The remaining value $k=100$ is the first position in the next block, so it gives one more suitable value.

Hence the total number of values is $66+1=67$.
