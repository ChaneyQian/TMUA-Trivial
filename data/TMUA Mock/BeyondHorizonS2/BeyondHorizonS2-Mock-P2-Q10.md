---
database: TMUA
qid: 20132101212210
id: BeyondHorizonS2-Mock-P2-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
If $x$ is a real number and $y = \frac{1}{2}(e^x - e^{-x})$, then
$$\mathbf{A} \quad x \text{ can be either } \log\left(y + \sqrt{y^2 + 1}\right) \text{ or } \log\left(y - \sqrt{y^2 + 1}\right)$$
$$\mathbf{B} \quad x \text{ can only be } \log\left(y + \sqrt{y^2 + 1}\right)$$
$$\mathbf{C} \quad x \text{ can be either } \log\left(y + \sqrt{y^2 - 1}\right) \text{ or } \log\left(y - \sqrt{y^2 - 1}\right)$$
$$\mathbf{D} \quad x \text{ can only be } \log\left(y + \sqrt{y^2 - 1}\right)$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Set $u = e^x$, which is strictly positive for every real $x$. The defining relation becomes $2y = u - \frac{1}{u}$, and multiplying through by $u$ gives the quadratic
$$u^2 - 2yu - 1 = 0, \qquad u = y \pm \sqrt{y^2 + 1}.$$
Since $\sqrt{y^2 + 1} > |y|$ for every real $y$, the root $y - \sqrt{y^2 + 1}$ is strictly negative and cannot equal $e^x$, so only $u = y + \sqrt{y^2 + 1}$ survives. Taking logarithms gives the single value $x = \log\left(y + \sqrt{y^2 + 1}\right)$, which is exactly what B asserts. Options C and D carry $y^2 - 1$ under the root, which is the wrong discriminant and need not even be real. The answer is B.
