---
database: TMUA
qid: 20132101208215
id: JZMaths_SetD-Mock-P2-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 7.5
topics: [Number Theory, Sequences and Series]
subtopics: [Modular Arithmetic and Congruences, Fibonacci Numbers]
tags: [General Algebra, Logic Deduction]
status: 已入库
---

## 题目
A sequence is defined by $a_1 = a_2 = 1$ and $a_{n+2} = a_{n+1} + a_n$ for every positive integer $n$. How many of the terms $a_1, a_2, \dots, a_{100}$ are divisible by 4?

$$ \mathbf{A} \quad 8 $$
$$ \mathbf{B} \quad 16 $$
$$ \mathbf{C} \quad 12 $$
$$ \mathbf{D} \quad 5 $$
$$ \mathbf{E} \quad 15 $$
$$ \mathbf{F} \quad 20 $$
$$ \mathbf{G} \quad 24 $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Only the remainders on division by 4 matter, since the remainder of a sum **depends only** on the remainders of the two numbers being added. Listing the remainders of $a_1, a_2, a_3, \dots$ gives

$$ 1, \ 1, \ 2, \ 3, \ 1, \ 0, \ 1, \ 1, \ 2, \ 3, \ 1, \ 0, \ \dots $$

At $n = 7, 8$ the pair of remainders is $1, 1$, which is exactly the pair we started with. Since each term is determined by the previous two, the list of remainders repeats with period 6 from the start.

Within each block the remainder 0 occurs once, in the sixth position. So $a_n$ is divisible by 4 exactly when $n$ is divisible by 6, and these values of $n$ form the arithmetic sequence $6, 12, 18, \dots, 96$. That sequence has $96 \div 6 = 16$ terms.
