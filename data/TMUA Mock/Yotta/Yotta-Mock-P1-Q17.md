---
database: TMUA
qid: 20132101203117
id: Yotta-Mock-P1-Q17
paper: TMUA Mock
year:
number: Q17
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
$f(x) = 1!x^{2!x^{3!x^{4!x^{5!x^{6!x}}}}}$. Which of these is the closest value of $f(\frac{1}{2})$?

$$
\mathbf{A} \quad 0
$$

$$
\mathbf{B} \quad \frac{1}{8}
$$

$$
\mathbf{C} \quad \frac{1}{4}
$$

$$
\mathbf{D} \quad \frac{1}{2}
$$

$$
\mathbf{E} \quad 1
$$

$$
\mathbf{F} \quad 2
$$

$$
\mathbf{G} \quad 1000000
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Read the expression as $f(x) = 1!\,x^{\,2!\,x^{\,3!\,x^{\,4!\,x^{\,5!\,x^{\,6!\,x}}}}}$: at each level the factorial multiplies, and only $x$ is raised to the next level. Evaluate from the top down at $x = \frac12$.

The top is $6!\,x = 720 \times \frac12 = 360$. Then $5!\,x^{360} = 120 \cdot 2^{-360}$, which is fantastically small — call it $\varepsilon_{1} \approx 0$.

Next, $4!\,x^{\varepsilon_{1}} = 24 \cdot \left(\frac12\right)^{\varepsilon_{1}} \approx 24$, since raising to a near-zero power gives nearly $1$.

Next, $3!\,x^{24} = 6 \cdot 2^{-24} = \frac{6}{16777216} \approx 3.6 \times 10^{-7}$, again essentially $0$; call it $\varepsilon_{2}$.

Next, $2!\,x^{\varepsilon_{2}} = 2 \cdot \left(\frac12\right)^{\varepsilon_{2}} \approx 2$.

Finally $f\left(\tfrac12\right) = 1!\,x^{2} = \left(\frac12\right)^{2} = \frac14$.

The answer is C. (Carrying the small quantities exactly gives $0.2500001$, so $\frac14$ is indeed the closest listed value.)
