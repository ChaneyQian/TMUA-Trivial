---
database: TMUA
qid: 20132101203206
id: Yotta-Mock-P2-Q6
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
$f(x)$ is a polynomial function defined for all real $x$.
**Statement P:** $f'(5) = 0$
**Statement Q:** There is a turning point at $x = 5$
Which option is true?

$$
\mathbf{A} \quad \text{P is neither necessary nor sufficient for Q}
$$

$$
\mathbf{B} \quad \text{P is necessary but not sufficient for Q}
$$

$$
\mathbf{C} \quad \text{P is sufficient but not necessary for Q}
$$

$$
\mathbf{D} \quad \text{P is necessary and sufficient for Q}
$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
**Necessary.** A polynomial is differentiable everywhere, so at a turning point at $x = 5$ the gradient must vanish: $Q \implies P$. Hence $P$ is necessary for $Q$.

**Not sufficient.** A vanishing derivative need not give a turning point — it may be a stationary point of inflection. Take $f(x) = (x-5)^{3}$: then $f'(5) = 0$, but $f$ is increasing on both sides of $x = 5$, so there is no turning point. Hence $P \not\implies Q$.

The answer is B.
