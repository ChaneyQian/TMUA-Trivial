---
database: TMUA
qid: 20132101208119
id: JZMaths_SetD-Mock-P1-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 8
topics: []
subtopics: []
tags: [Integration, General Functions]
status: 已入库
---

## 题目
Let functions $f_0(x) = |x|$ and $f_{n+1}(x) = |1 - f_n(x)|$, find
$$\int_0^{100} f_{100}(x) \, dx.$$
$$ \mathbf{A} \quad 5000 $$
$$ \mathbf{B} \quad 2500 $$
$$ \mathbf{C} \quad 100 $$
$$ \mathbf{D} \quad 50 $$
$$ \mathbf{E} \quad 25 $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
This lovely question occurred to me while I was watching R2Drew2's video on my first mock paper. In one question, he drew some very nice sketches of the sine and cosine graphs, and somehow this idea came into my head. So here it is - blame him!

The trick is to sketch successive functions $f_r(x)$ and look for a pattern. Since $|X| = |-X|$, it is easier to write the recurrence relation as
$$f_{n+1}(x) = |f_n(x) - 1|.$$
This corresponds to translating the graph down by 1 unit and then applying the modulus transformation. As you sketch the functions, you will see what is happening:

![[Image/JZMaths_SetD-Mock-P1-Q19-fig1.png]]

Therefore, the area described by the integral is
$$\int_0^{100} f_{100}(x) \, dx = 100 \cdot \frac{1}{2} = 50.$$
