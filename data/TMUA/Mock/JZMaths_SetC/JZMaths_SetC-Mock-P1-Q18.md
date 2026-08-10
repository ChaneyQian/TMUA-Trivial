---
database: TMUA
qid: 20132101207118
id: JZMaths_SetC-Mock-P1-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 7.5
topics: [Sequences and Series, Probability]
subtopics: [Binomial Theorem, AP GP, Elementary Probability]
tags: [Sequences and Series, Polynomial Expansions]
status: 已入库
---

## 题目
A positive integer $k$ is chosen uniformly at random from $1, 2, 3, \ldots, 8$.

For each non-negative integer $n$, define
$$ a_n = (2k + 1) \sum_{r=0}^n \binom{n}{r} \left(\frac{k - 4}{4}\right)^r. $$

Let
$$ S = a_0 + a_1 + a_2 + \cdots . $$

What is the probability that $S$ converges to a finite value and $S > 8$?

$$ \mathbf{A} \quad \frac{1}{8} $$
$$ \mathbf{B} \quad \frac{1}{4} $$
$$ \mathbf{C} \quad \frac{3}{8} $$
$$ \mathbf{D} \quad \frac{1}{2} $$
$$ \mathbf{E} \quad \frac{5}{8} $$
$$ \mathbf{F} \quad \frac{3}{4} $$
$$ \mathbf{G} \quad \frac{7}{8} $$
$$ \mathbf{H} \quad 1 $$
$$ \mathbf{I} \quad 0 $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Remark: This question is a more challenging variation of a similar past exam question, and I felt students could benefit from more practice with this type of problem, so here it is!

By the binomial theorem,

$$ \sum_{r=0}^{n}\binom{n}{r}\left(\frac{k-4}{4}\right)^r = \left(1+\frac{k-4}{4}\right)^n = \left(\frac{k}{4}\right)^n. $$

So $a_n=(2k+1)\left(\frac{k}{4}\right)^n$, and hence

$$ S=(2k+1)\left(1+\frac{k}{4}+\left(\frac{k}{4}\right)^2+\cdots\right). $$

This converges when $\frac{k}{4}<1$, so $k<4$. Since $k$ is a positive integer, the possible values are $k=1,2,3$.

For these values,

$$ S = \frac{2k+1}{1-\frac{k}{4}} = \frac{4(2k+1)}{4-k}. $$

We need $S>8$, so

$$ \frac{4(2k+1)}{4-k} > 8. $$

Since $k<4$, we can multiply by $4-k$ without changing the inequality. This gives $4(2k+1)>8(4-k)$, so $8k+4>32-8k$, hence $16k>28$. Therefore $k>\frac{7}{4}$.

Among $k=1,2,3$, this gives $k=2,3$. Therefore there are $2$ successful values out of $8$, so the required probability is $\frac{1}{4}$. The answer is B.
