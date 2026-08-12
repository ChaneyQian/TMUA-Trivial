---
database: GMAT
qid: 90020711900
id: ALG-PS-Q19
paper: GMAT Algebra PS Diagnostic
year: 0
number: Q19
section: Problem Solving
band: MEDIUM
level: LEVEL 4
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
What is the value of $|\sqrt{3} - |\sqrt{5}-\sqrt{7}|| - ||\sqrt{3} - \sqrt{5}|-\sqrt{7}|$ ?

$$
\mathbf{A} \quad 2\sqrt{5}-2\sqrt{7}-2\sqrt{3}
$$

$$
\mathbf{B} \quad 2\sqrt{5}-2\sqrt{7}
$$

$$
\mathbf{C} \quad 2\sqrt{7}-2\sqrt{5}
$$

$$
\mathbf{D} \quad 2\sqrt{5}-2\sqrt{7}+2\sqrt{3}
$$

$$
\mathbf{E} \quad 2\sqrt{7}+2\sqrt{5}
$$

## 备注

### 我的备注

### AI备注

## 答案
B

## 解析
**Official Solution:**

To answer this question we should recall the property of the absolute value:

$|x| = x$, when $x \geq 0$;

$|x| = -x$, when $x < 0$.

So, we should evaluate the expressions in the modulus to see whether they are positive or negative.

STEP 1:

Since $\sqrt{5}-\sqrt{7} < 0$, then $|\sqrt{5}-\sqrt{7}|=-(\sqrt{5}-\sqrt{7})=\sqrt{7}-\sqrt{5}$;

Since $\sqrt{3} - \sqrt{5} < 0$, then $|\sqrt{3} - \sqrt{5}|=-(\sqrt{3} - \sqrt{5})= \sqrt{5} -\sqrt{3}$.

Thus, $|\sqrt{3} - |\sqrt{5}-\sqrt{7}|| - ||\sqrt{3} - \sqrt{5}|-\sqrt{7}|$ will become:

$|\sqrt{3} -(\sqrt{7}-\sqrt{5})| - |(\sqrt{5} -\sqrt{3})-\sqrt{7}|=|\sqrt{3} +\sqrt{5}-\sqrt{7}| - |\sqrt{5} -\sqrt{3}-\sqrt{7}|$.

STEP 2:

$\sqrt{3} +\sqrt{5}-\sqrt{7}$ must be positive because $\sqrt{3} +\sqrt{5}=1.something + 2.something=3.something$, while $\sqrt{7} < 3.something$. So, $|\sqrt{3} +\sqrt{5}-\sqrt{7}| =\sqrt{3} +\sqrt{5}-\sqrt{7}$;

$\sqrt{5} -\sqrt{3}-\sqrt{7}$ is obviously negative. So, $\sqrt{5} -\sqrt{3}-\sqrt{7}=-(\sqrt{5} -\sqrt{3}-\sqrt{7})=\sqrt{7}+\sqrt{3}-\sqrt{5}$.

Thus, $|\sqrt{3} +\sqrt{5}-\sqrt{7}| - |\sqrt{5} -\sqrt{3}-\sqrt{7}|$ will become:

$(\sqrt{3} +\sqrt{5}-\sqrt{7})-(\sqrt{7}+\sqrt{3}-\sqrt{5})=2\sqrt{5}-2\sqrt{7}$.

Answer: B
