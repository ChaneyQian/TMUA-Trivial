---
database: TMUA
qid: 90010221200
id: Spec-P2-Q12
paper: TMUA P2
year:
number: Q12
section: Reasoning
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
A polynomial $p(x)$ has the property that $p(1) = 2$.

Which one of the following can be deduced from this?

$$
\mathbf{A} \quad p(x) = (x-1)q(x) + 2 \text{ for some polynomial } q(x).
$$

$$
\mathbf{B} \quad p(x) = (x+1)q(x) + 2 \text{ for some polynomial } q(x).
$$

$$
\mathbf{C} \quad p(x) = (x-1)q(x) - 2 \text{ for some polynomial } q(x).
$$

$$
\mathbf{D} \quad p(x) = (x+1)q(x) - 2 \text{ for some polynomial } q(x).
$$

$$
\mathbf{E} \quad p(x) = (x-2)q(x) + 1 \text{ for some polynomial } q(x).
$$

$$
\mathbf{F} \quad p(x) = (x+2)q(x) + 1 \text{ for some polynomial } q(x).
$$

$$
\mathbf{G} \quad p(x) = (x-2)q(x) - 1 \text{ for some polynomial } q(x).
$$

$$
\mathbf{H} \quad p(x) = (x+2)q(x) - 1 \text{ for some polynomial } q(x).
$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
This is an application of the remainder theorem. If we divide $p ( x )$ by $( x - 1 )$ , we $\mathrm { g e t }$ a quotient $q ( x )$ and a remainder r. We can write this as

$$
p (x) = (x - 1) q (x) + r.
$$

If we now substitute $x = 1$ into this identity, we obtain

$$
p (1) = r,
$$

so we must have $r = 2$ (since we are told $p ( 1 ) = 2 )$ . Therefore

$$
p (x) = (x - 1) q (x) + 2 \text {   for   some   polynomial   } q (x),
$$

which is option A.

It may be the case that some or all of $B$, $D$, $E$, $F$, $G$ and $H$ are also true, but we cannot deduce this from the given information. C must be false, as if we substitute $x = 1$ , we obtain $2 = - 2$
