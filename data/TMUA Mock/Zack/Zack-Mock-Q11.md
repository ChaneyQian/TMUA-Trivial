---
database: TMUA
qid: 20132101204011
id: Zack-Mock-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
There are 129 coins on a table. 128 are fair, and one has heads on both sides. A coin is tossed 8 times and lands on heads every time. What is the probability it lands on heads if thrown a 9th time?

$$
\mathbf{A} \quad \frac{1}{2}
$$

$$
\mathbf{B} \quad \frac{9}{10}
$$

$$
\mathbf{C} \quad \frac{7}{8}
$$

$$
\mathbf{D} \quad \frac{5}{6}
$$

$$
\mathbf{E} \quad \frac{2}{3}
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
This is Bayes' theorem: the eight heads are strong evidence that the chosen coin is the two-headed one, so the ninth toss is biased towards heads.

Before tossing, $P(\text{biased}) = \dfrac{1}{129}$ and $P(\text{fair}) = \dfrac{128}{129}$. The likelihoods of eight heads are $1$ and $\left(\tfrac12\right)^{8} = \dfrac{1}{256}$. Hence

$$ P(\text{biased}\mid 8H) = \frac{\frac{1}{129}}{\frac{1}{129}+\frac{128}{129}\cdot\frac{1}{256}} = \frac{1}{1+\frac{128}{256}} = \frac{1}{\frac32} = \frac23 $$

so $P(\text{fair}\mid 8H) = \dfrac13$. The ninth toss is then

$$ \frac23\cdot1+\frac13\cdot\frac12 = \frac23+\frac16 = \frac56 $$

The answer is D. The trap is $\tfrac12$ — "coins have no memory" is true for a *known* fair coin, but here the tosses tell us *which* coin we are holding.
