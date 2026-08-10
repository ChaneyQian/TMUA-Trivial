---
database: TMUA
qid: 20132101208213
id: JZMaths_SetD-Mock-P2-Q13
paper: TMUA Mock
year:
number: Q13
section: Multiple Choice
difficulty: 7
topics: [Miscellaneous Pure]
subtopics: [Combinatorics, Inclusion-Exclusion Principle]
tags: [Polynomial Expansions]
status: 已入库
---

## 题目
In how many ways can $8$ identical balls be placed into $3$ distinct boxes so that no box contains more than $4$ balls?

$$ \mathbf{A} \quad 21 $$
$$ \mathbf{B} \quad 30 $$
$$ \mathbf{C} \quad 45 $$
$$ \mathbf{D} \quad 10 $$
$$ \mathbf{E} \quad 15 $$
$$ \mathbf{F} \quad 24 $$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
For now, let us simplify the problem and remove the restriction that no box may contain more than $4$ balls. What is the total number of ways to distribute the balls? How do we count them?

Imagine the $8$ balls laid out in a row. To split them into $3$ groups, we can add $2$ dividers to divide the row of $8$ balls into $3$ groups. Therefore, we can think of the problem as having $10$ positions, of which we need to choose $2$ for the dividers, with the rest occupied by the balls. Note that if we choose positions $1$ and $2$ for the dividers, then the distribution of balls is $0, 0, 8$, which is allowed in the unrestricted problem. Therefore, the total number is given by $10$ choose $2$:
$$ \binom{10}{2} = 45. $$

Now let us subtract the cases in which a box has $5$ or more balls, to bring back our restriction. Suppose the first box contains at least $5$ balls. Place $5$ balls in that box first, leaving $3$ balls to distribute freely among the three boxes, including the box with $5$ balls. So now we need to place $2$ dividers among a row of $3$ balls. This is the same problem, but with fewer balls, so the total number of ways of doing this is
$$ \binom{5}{2} = 10. $$

There are $3$ choices for the box containing at least $5$ balls, so that gives $10 \times 3 = 30$ ways. Also, no distribution has two such boxes, since that would require at least $10$ balls.

Therefore, the required number of ways is $45 - 30 = 15$.

**Alternatively**, we can enumerate them in an orderly way, writing the numbers of balls in the three boxes as a three-digit numbers, in ascending order:

$$ 044, \ 134, \ 143, \ 224, \ 233, \ 242, \ 314, \ 323, \ 332, \ 341, \ 404, \ 413, \ 422, \ 431, \ 440. $$

Here, for example, $134$ means that the three boxes contain $1$, $3$ and $4$ balls respectively. The initial zero in $044$ means that the first box is empty.

Now count, there are $15$ of them.
