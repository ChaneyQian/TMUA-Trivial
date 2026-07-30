---
database: TMUA
qid: 20132101206120
id: JZMaths_SetB-Mock-P1-Q20
paper: TMUA Mock
year:
number: Q20
section: Multiple Choice
difficulty: 8
topics: []
subtopics: []
tags: [General Trigonometry, Inequalities]
status: 已入库
---

## 题目
Let $y = t^{\sin 2x} - 2t^{-\sin 2x}$, where $t > 0$ and $x$ is real. For what values of $t$, is the product between the maximum value of $y$ and the minimum value of $y$ positive.

$$ \mathbf{A} \quad 0 < t < \frac{1}{\sqrt{2}} $$
$$ \mathbf{B} \quad t > \sqrt{2} $$
$$ \mathbf{C} \quad \frac{1}{\sqrt{2}} < t < \sqrt{2} $$
$$ \mathbf{D} \quad \frac{1}{\sqrt{2}} \leq t \leq \sqrt{2} $$
$$ \mathbf{E} \quad 0 < t < \sqrt{2} $$
$$ \mathbf{F} \quad 1 < t < \sqrt{2} $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Let $u = t^{\sin 2x}$. Then $y = u - 2/u$.

For $u > 0$, the expression $u - \frac{2}{u}$ increases as $u$ increases, because

$$ \frac{d}{du}\left(u - \frac{2}{u}\right) = 1 + \frac{2}{u^2} > 0. $$

**Case 1:** $t \geq 1$.

Since $-1 \leq \sin 2x \leq 1$, we have $\frac{1}{t} \leq u \leq t$. Hence the maximum value of $y$ is $t - \frac{2}{t}$, and the minimum value of $y$ is $\frac{1}{t} - 2t$.

Since $t \geq 1$, we have $\frac{1}{t} - 2t < 0$. Therefore the product is positive exactly when $t - \frac{2}{t} < 0$. 
Multiplying by $t > 0$ gives $t^2 < 2$, so $t < \sqrt{2}$. In this case, we get $1 \leq t < \sqrt{2}$.

**Case 2:** $0 < t \leq 1$.

Now $t \leq u \leq \frac{1}{t}$. Hence the maximum value of $y$ is $\frac{1}{t} - 2t$, and the minimum value of $y$ is $t - \frac{2}{t}$.

Since $0 < t \leq 1$, we have $t - \frac{2}{t} < 0$. Therefore the product is positive exactly when $\frac{1}{t} - 2t < 0$. 
Multiplying by $t > 0$ gives $1 - 2t^2 < 0$, so $t > \frac{1}{\sqrt{2}}$. In this case, we get $\frac{1}{\sqrt{2}} < t \leq 1$.

Combining the two cases gives
$$
\frac{1}{\sqrt{2}}<t<\sqrt{2}.
$$
