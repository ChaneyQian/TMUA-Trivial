---
database: TMUA
qid: 20132101208118
id: JZMaths_SetD-Mock-P1-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 8
topics: [Calculus, Function, Sequences and Series]
subtopics: [Integration, "Floor, Ceiling and Fractional Part Functions", Exponentials and Logarithms, Sequences and Series]
tags: [Exponentials-and-Logarithms, Integration]
status: 已入库
---

## 题目
Let $\lfloor x \rfloor$ denote the greatest integer less than or equal to $x$.

Find the value of
$$\int_{100}^1 \log_{10} \left( \frac{\lfloor 2x \rfloor}{\lfloor 2x \rfloor + 1} \right) \, dx.$$
$$ \mathbf{A} \quad -1 $$
$$ \mathbf{B} \quad \log_{10} 99 $$
$$ \mathbf{C} \quad \log_{10} 101 $$
$$ \mathbf{D} \quad -\log_{10} 99 $$
$$ \mathbf{E} \quad -\log_{10} 101 $$
$$ \mathbf{F} \quad 1 $$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
**Remark:** Students often find integrals involving step functions difficult, so here is an opportunity to practise! I have added a couple of extra twists to this one. Do you like them?!

Reversing the limits changes the sign of the integral:
$$\int_{100}^1 \log_{10} \left( \frac{\lfloor 2x \rfloor}{\lfloor 2x \rfloor + 1} \right) \, dx = - \int_1^{100} \log_{10} \left( \frac{\lfloor 2x \rfloor}{\lfloor 2x \rfloor + 1} \right) \, dx.$$
For $\frac{k}{2} \le x < \frac{k+1}{2}$, we have $\lfloor 2x \rfloor = k$. From $x = 1$ to $x = 100$, the values of $\lfloor 2x \rfloor$ are $2, 3, \dots, 199$, each lasting for an interval of length $\frac{1}{2}$. Therefore
$$\int_1^{100} \log_{10} \left( \frac{\lfloor 2x \rfloor}{\lfloor 2x \rfloor + 1} \right) \, dx = \frac{1}{2} \sum_{k=2}^{199} \log_{10} \left( \frac{k}{k+1} \right)$$
$$= \frac{1}{2} \log_{10} \left( \frac{2}{3} \cdot \frac{3}{4} \cdot \frac{4}{5} \dots \frac{199}{200} \right) = \frac{1}{2} \log_{10} \left( \frac{1}{100} \right) = -1.$$
Hence
$$\int_{100}^1 \log_{10} \left( \frac{\lfloor 2x \rfloor}{\lfloor 2x \rfloor + 1} \right) \, dx = -(-1) = 1.$$
So the answer is $1$, how neat!
