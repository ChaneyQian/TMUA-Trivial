---
database: TMUA
qid: 20132101100213
id: Spec-P2-Q13
paper: TMUA P2
year:
number: Q13
section: Reasoning
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
Five runners competed in a race: Fred, George, Hermione, Lavender, and Ron.
	Fred beat George.
	Hermione beat Lavender.
	Lavender beat George.
	Ron beat George.

Assuming there were no ties, how many possible finishing orders could there have been, given only this information?

$$
\mathbf{A} \quad 1
$$

$$
\mathbf{B} \quad 6
$$

$$
\mathbf{C} \quad 12
$$

$$
\mathbf{D} \quad 18
$$

$$
\mathbf{E} \quad 24
$$

$$
\mathbf{F} \quad 120
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Let us indicate the runners by their initials, and write $A > B$ to mean that A beat B.

We are given $F > G , H > L , L > G$ and $R > G$ , which combine to give $F > G , H > L > G$. $R > G$ . So G came last, and the other four runners could have come in any order, except that $H > L$ . There are $4 ! = 2 4$ ways of ordering these four runners. In half of them, $H > L$ while in the other half, $L > H$ . (More precisely, we can pair every finishing order with $H > L$ together with the finishing order in which $H$ and $L$ are swapped, so there are the same number of finishing orders with $H > L$ as there are with $L > H . )$

So the number of possible finishing orders is $\begin{array} { r } { \frac { 2 4 } { 2 } = 1 2 } \end{array}$ , and the answer is $\mathrm { C }$
