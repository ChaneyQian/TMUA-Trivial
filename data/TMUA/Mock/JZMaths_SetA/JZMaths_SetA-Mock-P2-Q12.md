---
database: TMUA
qid: 20132101205212
id: JZMaths_SetA-Mock-P2-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 7
topics: []
subtopics: []
tags: [Exponentials and Logarithms, Graphs of Functions]
status: 已入库
---

## 题目
Consider the curve
$$ y = \log_{x-1} 4 \quad \text{for } x > 1,\ x \neq 2. $$

Which of the following statements about this curve are true?

I $y > 0$ for every $x$ in the domain.

II $y$ is a strictly decreasing function of $x$ on the domain.

III For every real number $y$, there exists a value of $x$ in the domain such that $y = \log_{x-1} 4$.

IV $y = 0$ is an asymptote.

$$ \mathbf{A} \quad \text{I only} $$
$$ \mathbf{B} \quad \text{II only} $$
$$ \mathbf{C} \quad \text{III only} $$
$$ \mathbf{D} \quad \text{IV only} $$
$$ \mathbf{E} \quad \text{I and II only} $$
$$ \mathbf{F} \quad \text{I and IV only} $$
$$ \mathbf{G} \quad \text{II and III only} $$
$$ \mathbf{H} \quad \text{III and IV only} $$
$$ \mathbf{I} \quad \text{None of the statements is true.} $$
$$ \mathbf{J} \quad \text{All four statements are true.} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Rewrite $y = \log_{x-1} 4$ as $(x - 1)^y = 4$. Taking natural logarithms gives

$$ y \ln(x - 1) = \ln 4. $$

Since $x \neq 2$, we have $\ln(x - 1) \neq 0$, so

$$ y = \frac{\ln 4}{\ln(x - 1)}. $$

**I.** Take $x = \frac{3}{2}$. Then $\ln(x - 1) = \ln \frac{1}{2} < 0$, so $y < 0$. Therefore, statement **I** is false.

**II.** The function is strictly decreasing on each of the intervals $(1,2)$ and $(2,\infty)$, since the denominator is increasing and does not change sign within either interval. However, $x = 2$ is a vertical asymptote, because $\ln(x - 1) \to 0$ as $x \to 2$. Moreover, the function has opposite signs on the two sides of the asymptote. For example, $x = \frac{3}{2}$ gives $y = -2$, while $x = 3$ gives $y = 2$. Since $\frac{3}{2} < 3$ but $-2 < 2$, the function is not strictly decreasing on its entire domain. Therefore, statement **II** is false.

**III.** The numerator $\ln 4$ is non-zero, so

$$ \frac{\ln 4}{\ln(x - 1)} $$

can never equal $0$. Therefore, there is no value of $x$ for which $y = 0$, so statement **III** is false.

**IV.** As $x \to \infty$, we have $\ln(x - 1) \to \infty$, and hence

$$ \frac{\ln 4}{\ln(x - 1)} \to 0. $$

Therefore, $y = 0$ is a horizontal asymptote, so statement **IV** is true.

Hence only statement **IV** is true.
