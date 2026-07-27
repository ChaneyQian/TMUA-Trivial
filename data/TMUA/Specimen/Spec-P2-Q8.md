---
database: TMUA
qid: 20150220800
id: Spec-P2-Q8
paper: TMUA P2
year: 2015
number: Q8
section: Reasoning
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
Consider the following statement about the positive integer $n$:

Statement (\*): The sum of the four consecutive integers, the smallest of which is $n$, is a multiple of 6.

Which one of the following is true?

$$
\mathbf{A} \quad \text{Statement (*) is true for all values of } n.
$$

$$
\mathbf{B} \quad \text{Statement (*) is true for all values of } n \text{ which are odd, but not for any other values of } n.
$$

$$
\mathbf{C} \quad \text{Statement (*) is true for all values of } n \text{ which are multiples of 3, but not for any other values of } n.
$$

$$
\mathbf{D} \quad \text{Statement (*) is true for all values of } n \text{ which are multiples of 6, but not for any other values of } n.
$$

$$
\mathbf{E} \quad \text{Statement (*) is not true for any value of } n.
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
We could start by trying a few examples to get a feeling for the statement.

n = 0 gives 0 + 1 + 2 + 3 = 6, so (∗) is true in this case.

n = 1 gives 1 + 2 + 3 + 4 = 10, so (∗) is false in this case.

n = 2 gives 2 + 3 + 4 + 5 = 14, so (∗) is false in this case.

n = 3 gives 3 + 4 + 5 + 6 = 18, so (∗) is true in this case.

Of the given options, this exploration shows: A is false; B is false (as (∗) is false for n = 1); C may be true; D is false (as (∗) is true for n = 3), and E is false.

So by elimination, the correct answer must be C.

We can also prove this. The sum of the four consecutive integers is

$$
n + (n + 1) + (n + 2) + (n + 3) = 4 n + 6.
$$

This is a multiple of 6 whenever 4n is a multiple of 6. An integer is a multiple of 6 if and only if it is a multiple of both 2 and 3. 4n is always a multiple of 2, and is a multiple of 3 when n is a multiple of 3 and for no other value of $n$. Hence option C is correct.
