---
database: GMAT
qid: 90020711400
id: ALG-PS-Q14
paper: GMAT Algebra PS Diagnostic
year: 0
number: Q14
section: Problem Solving
band: MEDIUM
level: LEVEL 3
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
$x_1+x_2+...+x_{100} = 1$;
$x_1+x_2+...+x_{99} = 2$;
$x_1+x_2+...+x_{98} = 3$;
...
$x_1= 100$.

What is the value of $x_1*x_2*...*x_{100}$?

$$
\mathbf{A} \quad -100
$$

$$
\mathbf{B} \quad -1
$$

$$
\mathbf{C} \quad 0
$$

$$
\mathbf{D} \quad 1
$$

$$
\mathbf{E} \quad 100
$$

## 备注

### 我的备注

### AI备注

## 答案
A

## 解析
**Official Solution:**

By subtracting the second equation from the first, we obtain $(x_1+x_2+...+x_{100})-(x_1+x_2+...+x_{99}) = 1-2$, which simplifies to $x_{100}= -1$.

Similarly, subtracting the third equation from the second yields $(x_1+x_2+...+x_{99}) -(x_1+x_2+...+x_{98}) = 2-3$, which simplifies to $x_{99}= -1$.

By repeating this process for each successive pair of equations, we can determine that every term up to $x_1$ is also equal to -1.

Therefore, $x_1*x_2*...*x_{100}=100(-1)(-1)(-1)...(-1)=100(-1)^{99}=-100$.

Answer: A
