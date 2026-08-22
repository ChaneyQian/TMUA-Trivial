---
database: TMUA
qid: 20132101213112
id: BeyondHorizonS3-Mock-P1-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Use the trapezium rule with 3 strips to estimate
$$\int_{1}^{3} 3\log_{10} x \, dx$$
$$\mathbf{A} \quad \log_{10} \frac{3\sqrt{2}}{4}$$
$$\mathbf{B} \quad \log_{10} \frac{1225}{9}$$
$$\mathbf{C} \quad \log_{10} \frac{27}{8}$$
$$\mathbf{D} \quad \log_{10} 4$$
$$\mathbf{E} \quad \log_{10} \frac{1225}{27}$$
$$\mathbf{F} \quad \log_{10} \frac{3\sqrt{17}}{4}$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Three strips across $[1,3]$ give $h = \frac{2}{3}$ and ordinates at $x = 1, \frac{5}{3}, \frac{7}{3}, 3$. The trapezium rule gives $\frac{h}{2}\left[f(1) + 2f\left(\frac{5}{3}\right) + 2f\left(\frac{7}{3}\right) + f(3)\right]$ with $f(x) = 3\log_{10} x$, and the factor $\frac{h}{2} = \frac{1}{3}$ cancels the leading $3$ in $f$. What remains is $\log_{10} 1 + 2\log_{10}\frac{5}{3} + 2\log_{10}\frac{7}{3} + \log_{10} 3$, which the log laws collapse into $\log_{10}\left(\frac{25}{9}\cdot\frac{49}{9}\cdot 3\right) = \log_{10}\frac{3675}{81} = \log_{10}\frac{1225}{27}$. Numerically this is about $1.657$, comfortably close to the exact value $\frac{3}{\ln 10}(3\ln 3 - 2) \approx 1.702$. The answer is E. Option B is the trap for anyone who forgets the final factor of $3$ from $f(3)$ and so fails to reduce $\frac{3675}{81}$ correctly.
