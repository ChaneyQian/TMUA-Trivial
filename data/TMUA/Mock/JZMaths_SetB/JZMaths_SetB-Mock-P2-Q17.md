---
database: TMUA
qid: 20132101206217
id: JZMaths_SetB-Mock-P2-Q17
paper: TMUA Mock
year:
number: Q17
section: Multiple Choice
difficulty: 8
topics: []
subtopics: []
tags: [Logic Deduction]
status: 已入库
---

## 题目
Find the units digit of
$$ 7^{7^{7^{7^7}}} . $$
You may find it useful to consider the remainder of odd powers of 7 when divided by 4.

$$ \mathbf{A} \quad 1 $$
$$ \mathbf{B} \quad 2 $$
$$ \mathbf{C} \quad 3 $$
$$ \mathbf{D} \quad 4 $$
$$ \mathbf{E} \quad 5 $$
$$ \mathbf{F} \quad 6 $$
$$ \mathbf{G} \quad 0 $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The units digits of powers of $7$ repeat in a cycle:
$$ 7^1 \text{ ends in } 7, \quad 7^2 \text{ ends in } 9, \quad 7^3 \text{ ends in } 3, \quad 7^4 \text{ ends in } 1. $$

So we only need to know where the exponent
$$ 7^{7^{7^7}} $$
falls in this cycle of length 4.

The key to the question is that: **any odd power of 7 is one less than a multiple of 4**.

Since $7 = 8 - 1$, we can write an odd power of 7 as
$$ 7^{2k+1} = (8 - 1)^{2k+1} . $$

When this is expanded, every term except the final term contains a factor of 8, so all those terms together form a multiple of 8, and hence a multiple of 4.

The final term is
$$
(-1)^{2k+1}=-1.
$$

Therefore
$$
(8-1)^{2k+1}=\text{a multiple of }4-1.
$$

So any odd power of 7 is one less than a multiple of 4.

Since apply the result to $7^7$, so it is one less than a multiple of 4, so it is odd, then $7^{7^7}$ is also one less than a multiple of 4, repeatedly apply this, then the overall exponent is also 1 less than a multiple of 4, therefore it is in the third position of the cycle. So the units digit is **3**.

This result can be applied recursively! The number $7^7$ is an odd power of 7, so it is one less than a multiple of 4. In particular, it is odd.

Therefore $7^{7^7}$ is also an odd power of 7, so it is also one less than a multiple of 4. Repeating the same argument, it does not matter whether the tower contains 3 copies of 7 or 10 copies of 7: each new power is still an odd power of 7, and is therefore one less than a multiple of 4.

Hence $7^{7^{7^7}}$ is one less than a multiple of 4, so it is in the third position of the units digit cycle. Therefore the units digit is 3.
