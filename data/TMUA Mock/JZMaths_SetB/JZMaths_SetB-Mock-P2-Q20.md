---
database: TMUA
qid: 20132101206220
id: JZMaths_SetB-Mock-P2-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 9
topics: [Logic and Proof, Miscellaneous Pure]
subtopics: [Logic, Combinatorics]
tags: [Logic-Deduction]
status: 已入库
---

## 题目
A safe is protected by a 6-character password that uses each of the letters $a,b,c,d,e,f$ exactly once. After each attempt the safe reports only the number of positions in which the attempted string agrees with the password. The following attempts have already been made:

- $abcdef$ gave 0 correct positions;
- $feadbc$ gave 0 correct positions;
- $fbdcae$ gave 3 correct positions.

A player now plays optimally, choosing each subsequent attempt with full knowledge of all responses received so far. What is the smallest number $N$ such that the player is guaranteed to be able to identify the password after at most $N$ further attempts?

$$ \mathbf{A} \quad 1 $$
$$ \mathbf{B} \quad 2 $$
$$ \mathbf{C} \quad 3 $$
$$ \mathbf{D} \quad 4 $$
$$ \mathbf{E} \quad \text{more than 5} $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Write a candidate password as $\pi_1\pi_2\pi_3\pi_4\pi_5\pi_6$.

The two zero-score attempts rule out
$$
\pi_1\in\{a,f\},\quad
\pi_2\in\{b,e\},\quad
\pi_3\in\{a,c\},\quad
\pi_4=d,\quad
\pi_5\in\{b,e\},\quad
\pi_6\in\{c,f\}.
$$

In the third attempt, the first two positions are already known to be wrong. Therefore exactly three of
$$
\pi_3=d,\quad \pi_4=c,\quad \pi_5=a,\quad \pi_6=e
$$
hold. Enumerating the possibilities subject to the earlier exclusions gives exactly six candidates:

$$
\{badcfe,\ bcdfae,\ bdfcae,\ cfdbae,\ dfbcae,\ efdcab\}.
$$

One further attempt cannot guarantee identification. Any two candidates in this set agree in at least two positions, so their scores against any fixed attempt can differ by at most four. Hence the six integer scores cannot all be distinct.

Two attempts suffice. Try $abcfde$. The six candidates above return, in the displayed order,

$$ 1,\ 2,\ 1,\ 1,\ 1,\ 0. $$

A response of 0 identifies $efdcab$, and a response of 2 identifies $bcdfae$. If the response is 1, the remaining candidates are

$$ \{badcfe,\ bdfcae,\ cfdbae,\ dfbcae\}. $$

Now try $baecdf$. These four candidates return respectively

$$ 3,\ 2,\ 0,\ 1, $$

which are all distinct. Thus two further attempts always suffice, while one cannot; hence $N=2$.
