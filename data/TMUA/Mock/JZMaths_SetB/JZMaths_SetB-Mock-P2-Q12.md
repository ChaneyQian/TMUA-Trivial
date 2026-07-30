---
database: TMUA
qid: 20132101206212
id: JZMaths_SetB-Mock-P2-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 7.5
topics: []
subtopics: []
tags: [Logic Deduction, Logic Equivalence]
status: 已入库
---

## 题目
Let $P$ be a property of a real number $x$. Each of the following is a statement about all real values of $x$. **Exactly one** of the following statements is true. Which one is it?
$$ \mathbf{A} \quad \text{If } |x| < 1\text{, then } P \text{ is true.} $$
$$ \mathbf{B} \quad \text{If } |x| < 2\text{, then } P \text{ is true.} $$
$$ \mathbf{C} \quad \text{If } P \text{ is true, then } |x| < 1. $$
$$ \mathbf{D} \quad \text{If } P \text{ is true, then } |x| < 2. $$
$$ \mathbf{E} \quad \text{If } P \text{ is not true, then } x^2 \ge 1. $$
$$ \mathbf{F} \quad \text{If } P \text{ is not true, then } x^2 \ge 4. $$
$$ \mathbf{G} \quad P \text{ is true only if } x^2 < 1. $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
The fifth statement is the contrapositive of
$$ x^2 < 1 \Rightarrow P. $$
Since $x^2 < 1$ is equivalent to $|x| < 1$, the fifth statement is equivalent to the first statement. So neither can be the unique true statement.

The sixth statement is the contrapositive of
$$ x^2 < 4 \Rightarrow P. $$
Since $x^2 < 4$ is equivalent to $|x| < 2$, the sixth statement is equivalent to the second statement. So neither can be the unique true statement.

Also, if the second statement is true, then the first statement is true, because $|x| < 1$ implies $|x| < 2$. So the second statement cannot be the unique true statement.

The seventh statement means that if $P$ is true, then $x^2<1$. Since $x^2<1$ is equivalent to $|x|<1$, the seventh statement is equivalent to the third statement. So neither can be the unique true statement.

Also, if the third statement is true, then the fourth statement is true, because $|x|<1$ implies $|x|<2$. So the third statement cannot be the unique true statement.

Therefore the only statement that can be the unique true statement is the **fourth statement**, which also is not a sufficient condition for any other statements, therefore it confirms to be the answer.

**Remark:** There is often confusion about a statement such as A. Statement A means: whenever $x$ is between $-1$ and $1$, $P$ must be true. Statement B makes the stronger claim that whenever $x$ is between $-2$ and $2$, $P$ must be true. Therefore B implies A, because every value satisfying $|x|<1$ also satisfies $|x|<2$. However, A does not imply B. For example, A could be true while $P$ is false when $x=1.5$. This would not contradict A, since 1.5 is not in the range $|x|<1$, but it would contradict B, since 1.5 is in the range $|x|<2$.
