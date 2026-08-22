---
database: TMUA
qid: 20132101202106
id: Zetta-Mock-P1-Q6
paper: TMUA Mock
year:
number: Q6
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Evaluate
$$ \sum_{n=1}^{6000} \frac{1}{n(n + 1)} $$

$$
\mathbf{A} \quad \frac{6000}{6001}
$$

$$
\mathbf{B} \quad \frac{6001}{6000}
$$

$$
\mathbf{C} \quad \frac{5999}{6000}
$$

$$
\mathbf{D} \quad \frac{6000}{5999}
$$

$$
\mathbf{E} \quad \frac{5999}{6001}
$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Split the term by partial fractions, which makes the sum telescope:

$$ \frac{1}{n(n+1)} = \frac{1}{n}-\frac{1}{n+1} $$

$$ \sum_{n=1}^{6000}\left(\frac1n-\frac1{n+1}\right) = \left(1-\frac12\right)+\left(\frac12-\frac13\right)+\cdots+\left(\frac1{6000}-\frac1{6001}\right) $$

Every interior term cancels, leaving $1-\dfrac{1}{6001} = \dfrac{6000}{6001}$.

The answer is A.
