---
database: TMUA
qid: 20132101211208
id: BeyondHorizonS1-Mock-P2-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Given that $\log_p x=\alpha$ and $\log_q x=\beta$, the value of $\log_{p/q} x$ equals:
$$\mathbf{A} \quad \frac{\alpha\beta}{\beta-\alpha};$$
$$\mathbf{B} \quad \frac{\beta-\alpha}{\alpha\beta};$$
$$\mathbf{C} \quad \frac{\alpha-\beta}{\alpha\beta};$$
$$\mathbf{D} \quad \frac{\alpha\beta}{\alpha-\beta}.$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Changing every logarithm to a common base gives $\ln p=\frac{\ln x}{\alpha}$ and $\ln q=\frac{\ln x}{\beta}$, so
$$\log_{p/q}x=\frac{\ln x}{\ln p-\ln q}=\frac{\ln x}{\ln x\left(\frac{1}{\alpha}-\frac{1}{\beta}\right)}=\frac{1}{\frac{\beta-\alpha}{\alpha\beta}}=\frac{\alpha\beta}{\beta-\alpha}.$$
A numerical check confirms the sign convention: with $x=64$, $p=2$, $q=4$ we get $\alpha=6$, $\beta=3$ and $p/q=\tfrac12$, so $\log_{1/2}64=-6$, while $\frac{\alpha\beta}{\beta-\alpha}=\frac{18}{-3}=-6$. The answer is A.
