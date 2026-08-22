---
database: TMUA
qid: 20132101211204
id: BeyondHorizonS1-Mock-P2-Q4
paper: TMUA Mock
year:
number: Q4
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Consider the relation "a person $x$ shakes hand with a person $y$." If $x$ shakes hand with $y$, then $y$ shakes hand with $x$. In a gathering of 99 persons, one of the following statements is always true, considering 0 to be an even number. Which one is it?
$$\mathbf{A} \quad \text{There is at least one person who shakes hand exactly with an odd number of persons.}$$
$$\mathbf{B} \quad \text{There is at least one person who shakes hand exactly with an even number of persons.}$$
$$\mathbf{C} \quad \text{There are even numbers of persons who shake hands exactly with an even number of persons.}$$
$$\mathbf{D} \quad \text{None of the foregoing statements.}$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Model the gathering as a graph on $99$ vertices whose edges are the handshakes; the handshake lemma says the sum of all degrees is $2$ times the number of edges, hence even, so the number of people of odd degree must be even. Option A fails on the gathering where nobody shakes hands at all, since then every degree is $0$, which is even. For option B, suppose every one of the $99$ people had odd degree; that would make the number of odd-degree people equal to $99$, an odd number, contradicting the lemma, so at least one person must have even degree and B is always true. Option C then fails automatically: writing $99=(\text{number of even degrees})+(\text{number of odd degrees})$ and knowing the second term is even forces the first term to be odd, never even. The answer is B.
