---
database: TMUA
qid: 20132101214109
id: BeyondHorizonS4-Mock-P1-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Evaluate
$$\sum_{n=1}^{50} \log_{10}\left(2^{1-n}\right)$$
$$\mathbf{A} \quad -495\log_{10} 2$$
$$\mathbf{B} \quad 495\log_{10} 2$$
$$\mathbf{C} \quad -1225\log_{10} 2$$
$$\mathbf{D} \quad 1225\log_{10} 2$$
$$\mathbf{E} \quad 1 - 495\log_{10} 2$$
$$\mathbf{F} \quad 1 + 495\log_{10} 2$$
$$\mathbf{G} \quad 1 - 1225\log_{10} 2$$
$$\mathbf{H} \quad 1 + 1225\log_{10} 2$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Bring the exponent down: $\log_{10}\left(2^{1-n}\right) = (1 - n)\log_{10} 2$, so the whole sum is $\left(\sum_{n=1}^{50} (1 - n)\right)\log_{10} 2$. The bracket is $50 - \sum_{n=1}^{50} n = 50 - \frac{50 \cdot 51}{2} = 50 - 1275 = -1225$, giving
$$-1225\log_{10} 2.$$
The answer is C. Option D has the right magnitude but the wrong sign — every term with $n \geq 2$ has $2^{1-n} < 1$ and so contributes a negative logarithm, and the sum must come out negative.
