---
database: GMAT
qid: 90020722800
id: ALG-DS-Q28
paper: GMAT Algebra DS Diagnostic
year: 0
number: Q28
section: Data Sufficiency
band: HARD
level: LEVEL 6
solution_source: 非官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
If $s - \dfrac{1}{s} < \dfrac{1}{t} - t$, then is $s > t$ ?

(1) $s > 1$
(2) $t > 0$

$$
\mathbf{A} \quad \text{Statement (1) ALONE is sufficient but statement (2) ALONE is not sufficient.}
$$

$$
\mathbf{B} \quad \text{Statement (2) ALONE is sufficient but statement (1) ALONE is not sufficient.}
$$

$$
\mathbf{C} \quad \text{BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient.}
$$

$$
\mathbf{D} \quad \text{EACH statement ALONE is sufficient.}
$$

$$
\mathbf{E} \quad \text{Statements (1) and (2) TOGETHER are not sufficient.}
$$

## 备注

### 我的备注

### AI备注

## 答案
A

## 解析
**Inofficial Solution:**

Let $f(u)=u-\frac1u$. The stem is $f(s)<-f(t)=f\left(\frac1t\right)$.

**Statement (1):**

If $s>1$, then $s$ is positive. If $t\leq0$, clearly $s>t$. If $t>0$, $f$ is strictly increasing on the positive numbers, so $f(s)<f(1/t)$ implies $s<1/t$. Since $f(s)>0$, the stem also forces $0<t<1$, and in fact $t<1/s<s$. Thus, $s>t$ in all cases. Sufficient.

**Statement (2):**

Knowing only that $t>0$ does not determine whether $s>t$; admissible examples can be chosen on either side of $t$. Not sufficient.

Answer: A
