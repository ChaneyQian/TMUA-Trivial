---
database: TMUA
qid: 20132101212102
id: BeyondHorizonS2-Mock-P1-Q2
paper: TMUA Mock
year:
number: Q2
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The least possible value of the gradient of the curve $y = (3x + b)(x - b)^2$ at the point where $x = 2$, as $b$ varies, is:
$$\mathbf{A} \quad -\frac{81}{4}$$
$$\mathbf{B} \quad -64$$
$$\mathbf{C} \quad -\frac{36}{4}$$
$$\mathbf{D} \quad \frac{5}{4}$$
$$\mathbf{E} \quad \frac{53}{16}$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
By the product rule, $\frac{dy}{dx} = 3(x - b)^2 + 2(3x + b)(x - b)$, and taking out the common factor $(x - b)$ gives
$$\frac{dy}{dx} = (x - b)\big(3(x - b) + 2(3x + b)\big) = (x - b)(9x - b).$$
Putting $x = 2$ turns the gradient into a quadratic in $b$:
$$(2 - b)(18 - b) = b^2 - 20b + 36 = (b - 10)^2 - 64.$$
This is minimised at $b = 10$, where the gradient equals $-64$. The answer is B. The positive options D and E are decoys for anyone who minimises the size of the gradient instead of the gradient itself.
