---
database: TMUA
qid: 20132101213104
id: BeyondHorizonS3-Mock-P1-Q4
paper: TMUA Mock
year:
number: Q4
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Which power of $x$ which has the greatest coefficient in the expansion of
$$\left(1 + \frac{2}{3}x\right)^{12}$$
$$\mathbf{A} \quad x^3$$
$$\mathbf{B} \quad x^4$$
$$\mathbf{C} \quad x^5$$
$$\mathbf{D} \quad x^6$$
$$\mathbf{E} \quad x^7$$
$$\mathbf{F} \quad x^8$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The coefficient of $x^r$ is $a_r = \binom{12}{r}\left(\frac{2}{3}\right)^r$, and since all these are positive it is cleanest to track the ratio of consecutive terms: $\frac{a_{r+1}}{a_r} = \frac{12-r}{r+1}\cdot\frac{2}{3}$. This exceeds $1$ precisely when $2(12-r) > 3(r+1)$, that is when $21 > 5r$, i.e. $r < 4.2$. So the coefficients strictly increase from $a_0$ up to $a_5$ and strictly decrease thereafter, putting the maximum at $r = 5$. Numerically $a_4 = 495 \cdot \frac{16}{81} \approx 97.8$, $a_5 = 792 \cdot \frac{32}{243} \approx 104.3$ and $a_6 = 924 \cdot \frac{64}{729} \approx 81.1$, confirming the peak. The answer is C. Option D is the trap for anyone who reads off the largest binomial coefficient $\binom{12}{6}$ and forgets that the factor $\left(\frac{2}{3}\right)^r$ shifts the peak to the left.
