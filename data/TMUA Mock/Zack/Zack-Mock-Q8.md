---
database: TMUA
qid: 20132101204008
id: Zack-Mock-Q8
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
Find $x$ such that
$$ \ln(x\ln(x\ln(x\ln(x\ln(x\dots = e $$

$$
\mathbf{A} \quad e
$$

$$
\mathbf{B} \quad e^3
$$

$$
\mathbf{C} \quad e^{e+1}
$$

$$
\mathbf{D} \quad e^e
$$

$$
\mathbf{E} \quad e^{e-1}
$$

## 备注

### 我的备注

### AI备注


## 答案
E

## 解析
Let $y$ denote the value of the whole infinite nest, so $y = e$ by hypothesis. The nest is self-similar: peeling off one layer leaves the same nest inside, so

$$ y = \ln(xy) $$

Substituting $y = e$:

$$ e = \ln(xe) \implies e^{e} = xe \implies x = \frac{e^{e}}{e} = e^{e-1} $$

The answer is E. (Options B and D are what you get from mis-peeling the nest as $\ln x \cdot \ln x \cdots$ or forgetting to divide by $e$.)
