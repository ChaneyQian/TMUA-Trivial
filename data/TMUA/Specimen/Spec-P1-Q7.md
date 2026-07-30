---
database: TMUA
qid: 90010210700
id: Spec-P1-Q7
paper: TMUA P1
year:
number: Q7
section: Applications
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
A bag contains $n$ red balls, $n$ yellow balls, and $n$ blue balls.

One ball is selected at random and not replaced.

A second ball is then selected at random and not replaced.

Each ball is equally likely to be chosen.

The probability that the two balls are **not** the same colour is

$$
\mathbf{A} \quad \frac{n-1}{3n-1}
$$

$$
\mathbf{B} \quad \frac{2n-2}{3n-1}
$$

$$
\mathbf{C} \quad \frac{2n}{3n-1}
$$

$$
\mathbf{D} \quad \frac{(n-1)^3}{27(3n-1)^3}
$$

$$
\mathbf{E} \quad \frac{3(n-1)}{3n-1}
$$

$$
\mathbf{F} \quad \frac{n^3}{27(3n-1)^3}
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
We could do this using a tree diagram, but it would have $3 \times 3$ branches, which is somewhat unwieldy in a short test.

Here are two alternative approaches.

## Approach 1: use symmetry

The first ball can be anything; it does not matter what. We are left with $n - 1$ balls of the same colour and 2n balls of different colours; there are $3 n - 1$ balls left in total. (This is because there are equal numbers of each colour to begin with. Were there different numbers of different colours, we would have to treat each colour separately.)

So the probability that the two balls are not the same colour is $\frac { 2 n } { 3 n - 1 }$ , which is option C.

## Approach 2: use negation

The probability that the two balls not the same colour is 1 minus the probability that they are the same colour. This gives

$$
1 - \left(\frac {n}{3 n} \times \frac {n - 1}{3 n - 1} + \frac {n}{3 n} \times \frac {n - 1}{3 n - 1} + \frac {n}{3 n} \times \frac {n - 1}{3 n - 1}\right)
$$

where we have added the three colours separately. This simplifies to

$$
1 - \frac {n - 1}{3 n - 1} = \frac {2 n}{3 n - 1}.
$$

We could have simplified the calculation in the same way as in approach 1: the probability that the second ball is the same colour as the first is $\frac { n - 1 } { 3 n - 1 }$ , so the probability that they are different colours is 1 minus this.
