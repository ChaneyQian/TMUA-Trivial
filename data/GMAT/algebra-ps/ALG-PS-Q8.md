---
database: GMAT
qid: 90020710800
id: ALG-PS-Q8
paper: GMAT Algebra PS Diagnostic
year: 0
number: Q8
section: Problem Solving
band: EASY
level: LEVEL 2
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
If $\sqrt{2+\sqrt{2+x} } +\sqrt{2-\sqrt{2+x} }=\sqrt{2x}$, what is the value of $x$ ?

$$
\mathbf{A} \quad -2
$$

$$
\mathbf{B} \quad -\sqrt{2}
$$

$$
\mathbf{C} \quad 1
$$

$$
\mathbf{D} \quad \sqrt{2}
$$

$$
\mathbf{E} \quad 2
$$

## 备注

### 我的备注

### AI备注

## 答案
E

## 解析
**Official Solution:**

APPROACH 1 - USING ANSWER OPTIONS AND ESTIMATION:

To succeed on the GMAT, it's essential to master working backward and estimation techniques. Let's see how we can apply these tools to this problem.

Firstly, note that since all numbers on the GMAT are real numbers, the even roots of negative numbers are undefined. Therefore, options A and B can be ruled out immediately because if $x$ is negative, $\sqrt{2x}$ will not be defined.

Let's check the other answer options.

If $x = 1$, the right-hand side becomes $\sqrt{2x}=\sqrt{2}$, while the left-hand side's first term will be $\sqrt{2+\sqrt{2+1}} =\sqrt{2+\sqrt{3}}$. Since this expression is already greater than $\sqrt{2}$, adding a positive value ($\sqrt{2-\sqrt{2+x}}$) to it will definitely result in a greater value than $\sqrt{2}$. We can eliminate this option.

If $x = \sqrt{2}$, the right-hand side becomes $\sqrt{2x}=\sqrt{2*\sqrt{2}}\approx \sqrt{2*1.4}=\sqrt{2.8}$. Meanwhile, the left-hand side's first term will be $\sqrt{2+\sqrt{2+x}} =\sqrt{2+\sqrt{2+\sqrt{2}}}\approx \sqrt{2+\sqrt{2+1.4}}= \sqrt{2+\sqrt{3.4}}$. Since $\sqrt{3.4}$ is definitely greater than 1, we can conclude that $\sqrt{2+\sqrt{3.4}} > \sqrt{2+1} > \sqrt{2.8}$. Therefore, adding some positive value ($\sqrt{2-\sqrt{2+x}}$) to this expression will definitely result in a greater value than $\sqrt{2.8}$. We can eliminate this option as well.

Therefore, the answer must be E. Nonetheless, for practice sake, we can still test $x = 2$:

The right-hand side becomes $\sqrt{2x}=\sqrt{2*2}=2$, and the left-hand side becomes:

$\sqrt{2+\sqrt{2+x}} +\sqrt{2-\sqrt{2+x}}=$

$=\sqrt{2+\sqrt{2+2}} +\sqrt{2-\sqrt{2+2}}=$

$=\sqrt{2+2} +\sqrt{2-2}=$

$=2+0=2$. The answers match!

APPROACH 2 - ALGEBRA:

We can start by squaring both sides of the given equation:

$(\sqrt{2+\sqrt{2+x}} +\sqrt{2-\sqrt{2+x}})^2=(\sqrt{2x})^2$

Expanding the left-hand side and simplifying, we get:

$(2+\sqrt{2+x}) + 2*(\sqrt{2+\sqrt{2+x}})(\sqrt{2-\sqrt{2+x}})+(2-\sqrt{2+x})=2x$

$4 + 2*\sqrt{ (2+\sqrt{2+x}) (2-\sqrt{2+x}) }=2x$

$4 + 2*\sqrt{2^2-(\sqrt{2+x})^2}=2x$

$4 + 2*\sqrt{4-(2+x)}=2x$

$4 + 2*\sqrt{2-x}=2x$

$2*\sqrt{2-x}=2x-4$

$\sqrt{2-x}=x-2$.

Since the square root of a number cannot be negative, $x-2$ must be positive or zero. This implies that $x \geq 2$.

Squaring both sides of the equation $\sqrt{2-x}=x-2$, we get:

$(\sqrt{2-x})^2=(x-2)^2$

$2-x=x^2-4x+4$

$x^2-3x+2=0$

$x = 1$ or $x = 2$. Since we found that $x \geq 2$, the only valid solution is $x = 2$.

Answer: E
