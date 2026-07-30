---
database: TMUA
qid: 20132101207219
id: JZMaths_SetC-Mock-P2-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 8
topics: []
subtopics: []
tags: [Sequences and Series, Logic Deduction]
status: 已入库
---

## 题目
An infinite sequence of integers $u_1, u_2, u_3, \dots$ satisfies $u_1 = 10$ and

$$ u_n + 2 < u_{n-1} < u_n + 9 \quad \text{for } n > 1. $$

It is given that $u_k = -50$ and that there exists some integer $j$ with $1 < j < k$ such that $u_j = -10$.

How many different values can $k$ take?

**Disclaimer:** This question is inspired by a question from tylertutoring.com. I found the original question very interesting and useful, so I created a new version with a couple of additional twists. Perhaps a few too many?! Enjoy!

$$ \mathbf{A} \quad 4 $$
$$ \mathbf{B} \quad 9 $$
$$ \mathbf{C} \quad 10 $$
$$ \mathbf{D} \quad 12 $$
$$ \mathbf{E} \quad 13 $$
$$ \mathbf{F} \quad 15 $$
$$ \mathbf{G} \quad 36 $$
$$ \mathbf{H} \quad 48 $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
First trick to overcome: the awkward nature of the inequality. We note that it can be rewritten as $u_{n-1} - 8 \leq u_n \leq u_{n-1} - 3$. This form is much more helpful, as we can see that to get to the next term, you just subtract an integer between $3$ to $8$ inclusive from the previous term.

Let's first consider what are the possible steps to get to -10 from 10. Then, the least number of steps is $3$ (subtract as fast as possible, $8$, to reach -10), and greatest is $6$ (subtract as slow as possible). Let the number of steps to -10 be $x$, then $x$ is a number from $3$ to $6$ inclusive.

Similarly, next consider the possible steps to get from -10 to -50. The least number of steps is $5$ ($5$ steps of $8$), and the most is $13$ ($12$ steps of $3$, last step of $4$). Let $y$ be the number of steps from -10 to -50, then $y$ is a number from $5$ to $13$ inclusive.

$k$ is the term count from term 1 then add $x$ and add $y$ steps, so $k = x + y + 1$. Therefore it is enough to count the number of possible values of $x + y$. For examples, smallest $x + y$ is $3 + 5 = 8$, that is to say you cannot get from 10 to -10 then to -50 any faster than $8$ steps. Likewise, the greateset $x + y$ is $6 + 13 = 19$.

Therefore possible values of $x + y$ are $8, 9, 10, \dots , 19$, so a total of $19 - 7 = 12$ values, and hence there are also $12$ possible values for $k$. The answer is **D**.
