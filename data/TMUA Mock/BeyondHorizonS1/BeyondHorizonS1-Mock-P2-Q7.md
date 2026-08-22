---
database: TMUA
qid: 20132101211207
id: BeyondHorizonS1-Mock-P2-Q7
paper: TMUA Mock
year:
number: Q7
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: [待补答案, 原卷缺陷]
status: 已入库
---

## 题目
Let $p,q,s$ be integers such that $p^2=sq^2$. Then it follows that:
$$\mathbf{A} \quad p \text{ is an even number;}$$
$$\mathbf{B} \quad \text{if } s \text{ divides } p, \text{ then } s \text{ is a perfect square;}$$
$$\mathbf{C} \quad s \text{ divides } p;$$
$$\mathbf{D} \quad q^2 \text{ divides } p.$$

## 备注

### 我的备注

### AI备注

- **原卷缺陷：未排除 $q=0$，退化情形下四个选项全假。**
  取 $q=0$ 则 $p=0$，此时 $s$ 可为任意整数：$s=3$ 整除 $0$ 但 $3$ 不是完全平方，
  选项 (B) 的「若 $s \mid p$ 则 $s$ 是完全平方」被证伪；其余三项本就有反例。
  非退化情形（$q \neq 0$）下 B 恒真且 A/C/D 均有反例，两轮独立解题也都落在 B。
  题面必须补 $q \neq 0$ 才成立。`ANSWER` 记 B 是非退化情形下的结论。

## 答案
B

## 解析
Option A dies immediately on $p=q=s=1$, where $p$ is odd. For option C take $p=2$, $q=1$, $s=4$, which satisfies $4=4\cdot 1$ yet $s=4$ does not divide $p=2$; for option D take $p=2$, $q=2$, $s=1$, which satisfies $4=1\cdot 4$ yet $q^2=4$ does not divide $p=2$. That leaves B, and in fact its conclusion holds whenever $q\neq 0$: rearranging gives $s=\left(\tfrac{p}{q}\right)^2$, so the rational number $p/q$ has an integer square, which forces $p/q$ itself to be an integer, and hence $s$ is the square of that integer. The implication in B is then true regardless of whether its hypothesis holds. The answer is B.
