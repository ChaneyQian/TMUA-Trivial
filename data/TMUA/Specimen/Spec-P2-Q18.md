---
database: TMUA
qid: 20150221800
id: Spec-P2-Q18
paper: TMUA P2
year: 2015
number: Q18
section: Reasoning
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
A group of five numbers are such that:

- their mean is 0
- their range is 20

What is the largest possible median of the five numbers?

$$
\mathbf{A} \quad 0
$$

$$
\mathbf{B} \quad 4
$$

$$
\mathbf{C} \quad 4\dfrac{1}{2}
$$

$$
\mathbf{D} \quad 6\dfrac{1}{2}
$$

$$
\mathbf{E} \quad 8
$$

$$
\mathbf{F} \quad 20
$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
We can approach this algebraically or just by reasoning about numbers.

We begin with an algebraic approach. Let the five numbers be, in increasing order, $a , b , c , d , e ,$ so that the median is c. The range is 20, so $e - a = 2 0 { \mathrm { ~ o r ~ } } a = e - 2 0$ . Also, the mean is zero, so $a + b + c + d + e = 0$

Since $c \leqslant d \leqslant e , a = e - 2 0$ and $a \leqslant b \leqslant c .$ , we see that the sum of the five numbers is at least

$$
(e - 2 0) + (e - 2 0) + c + c + c = 3 c + 2 e - 4 0
$$

Since the sum is zero, this means that $0 \geqslant 3 c + 2 e - 4 0 .$ , or that $3 c \leqslant 4 0 - 2 e , \mathrm { s o } 3 c + 2 e \leqslant 4 0$ But $c \leqslant e ,$ so 5c $\leqslant 3 c + 2 e \leqslant 4 0$ , so $c \leqslant 8$ . We can have $c = d = e = 8$ and then $a = b = - 1 2$ , so the largest possible median is 8, option E.

Alternatively, we can just reason as follows. Let’s say that we have five numbers

$$
\begin{array}{c c c c c} a & b & c & d & e \end{array}
$$

arranged in increasing order, with mean 0 and range 20, and let’s suppose that the median is as large as possible.

We ask if there is any way of increasing c while keeping the mean equal to 0 and the median equal to 20.

If $c < d ,$ , then we can increase the median without changing the mean or range by replacing each of c and d by their mean. So we must have $c = d .$

Similarly, if $d < e ,$ we could increase both c and d by a small amount and decrease e and a by the same small amount. As long as d and e don’t swap order in this process, the mean and range will not change, but the median will increase. (So we must take this small amount to be at most $\frac { 1 } { 2 } ( e - d ) . )$ Therefore we must have $c = d = e$

Now consider a and b. If $a < b ,$ we can do a similar trick: we increase $a , c ,$ d and e by a small amount k and decrease b by 4k; this preserves the mean and range while increasing the median. (So that a and b don’t swap places, we require k to be at most ${ \frac { 1 } { 4 } } ( b - a ) . )$ It follows that $a = b$

We therefore have $a = b$ and $c = d = e$ . Since the range is 20, the numbers must be $a , a , a + 2 0$ 2 $a + 2 0 , a + 2 0$ . Their sum is $5 a + 6 0 = 0$ , so $a = - 1 2$ and $a + 2 0 = 8$ , which is the largest possible median.
