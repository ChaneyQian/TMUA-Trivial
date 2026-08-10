---
database: TMUA
qid: 20132101205217
id: JZMaths_SetA-Mock-P2-Q17
paper: TMUA Mock
year:
number: Q17
section: Multiple Choice
difficulty: 8
topics: [Logic and Proof, Number Theory]
subtopics: [Proof, Divisibility]
tags: [Logic Deduction]
status: 已入库
---

## 题目
In this question, $n$ is a positive integer.

**Statement:** If $n$ does not divide $k!$ for any positive integer $k$ with $k < n$, then $n$ is prime.

The following is an attempted proof of the statement:

(1) Assume $n$ does not divide $k!$ for any positive integer $k$ with $k < n$.

(2) Suppose for contradiction that $n$ is composite, so $n = ab$ for some integers $a$, $b$ with $1 < a \le b < n$.

(3) Case 1: $a < b$. Then $a$ and $b$ are distinct integers, each in the set $\{2, 3, \ldots, n - 1\}$.

(4) Therefore $a$ and $b$ both appear as factors in the product $(n - 1)! = 1 \cdot 2 \cdots (n - 1)$, so $ab = n$ divides $(n - 1)!$.

(5) Case 2: $a = b$, so $n = a^2$.

(6) Since $a \ge 2$, the integers $a$ and $2a$ both satisfy $a \ge 2$ and $2a \ge 4$, so they are positive integers.

(7) Since $a \ge 2$, we have $a < a^2 = n$ and $2a < a^2 = n$, so $a$ and $2a$ are distinct integers in the set $\{2, 3, \ldots, n - 1\}$.

(8) Therefore $a$ and $2a$ both appear as factors in $(n - 1)!$, so $a \cdot 2a = 2a^2 = 2n$ divides $(n - 1)!$, and in particular $n$ divides $(n - 1)!$.

(9) In both cases $n$ divides $(n - 1)!$, contradicting the assumption in line 1. Hence $n$ is prime.

$$ \mathbf{A} \quad \text{First mistake appears in line 1 and the statement is false.} $$
$$ \mathbf{B} \quad \text{First mistake appears in line 2 and the statement is false.} $$
$$ \mathbf{C} \quad \text{First mistake appears in line 3 and the statement is false.} $$
$$ \mathbf{D} \quad \text{First mistake appears in line 4 and the statement is false.} $$
$$ \mathbf{E} \quad \text{First mistake appears in line 5 and the statement is false.} $$
$$ \mathbf{F} \quad \text{First mistake appears in line 6 and the statement is false.} $$
$$ \mathbf{G} \quad \text{First mistake appears in line 7 and the statement is false.} $$
$$ \mathbf{H} \quad \text{The proof is valid and the statement is true.} $$

## 备注

### 我的备注

### AI备注


## 答案
G

## 解析
Line 7 asserts that $a \ge 2$ implies
$$ 2a < a^2 = n. $$

This is wrong. The inequality $2a < a^2$ is equivalent to $a > 2$, not merely $a \ge 2$.

A counterexample to the statement is $n = 4$. We have

$$ 1! = 1, \qquad 2! = 2, \qquad 3! = 6, $$

and none of these is divisible by 4, yet 4 is not prime. So the statement is false.

Tracing $n = 4$ through the proof, we have $a = b = 2$, so this falls into Case 2. Lines 1 to 6 are all valid, but line 7 claims that $2a < n$. Here this would say $4 < 4$, which is false.

Therefore the first mistake appears in line 7, and the statement is false.
