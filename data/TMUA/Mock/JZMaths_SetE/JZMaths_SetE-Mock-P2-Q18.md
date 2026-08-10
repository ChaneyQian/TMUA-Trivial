---
database: TMUA
qid: 20132101209218
id: JZMaths_SetE-Mock-P2-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 8
topics: [Sequences and Series, Algebra (Basic)]
subtopics: [AP GP, Surds and indices]
tags: [Sequences and Series]
status: 已入库
---

## 题目
In a geometric progression, the third term is $3 - \sqrt{5}$ and the seventh term is $18 - 8\sqrt{5}$. Given that every term of the progression is positive, what is the sum to infinity?
$$ \mathbf{A} \quad \sqrt{5} - 1 $$
$$ \mathbf{B} \quad 2 $$
$$ \mathbf{C} \quad \sqrt{5} + 1 $$
$$ \mathbf{D} \quad 3 - \sqrt{5} $$
$$ \mathbf{E} \quad 2\sqrt{5} + 4 $$
$$ \mathbf{F} \quad \frac{3 + \sqrt{5}}{2} $$
$$ \mathbf{G} \quad 3 + \sqrt{5} $$

## 备注

### 我的备注

### AI备注


## 答案
G

## 解析
Let the first term be $a$ and common ratio $r$. From $ar^2 = 3 - \sqrt{5}$ and $ar^6 = 18 - 8\sqrt{5}$, divide to get
$$ r^4 = \frac{18 - 8\sqrt{5}}{3 - \sqrt{5}}. $$

Rationalise by multiplying numerator and denominator by $(3 + \sqrt{5})$: numerator $(18 - 8\sqrt{5})(3 + \sqrt{5}) = 54 + 18\sqrt{5} - 24\sqrt{5} - 40 = 14 - 6\sqrt{5}$; denominator $9 - 5 = 4$.

Therefore
$$ r^4 = \frac{7 - 3\sqrt{5}}{2} = \frac{14 - 6\sqrt{5}}{4} = \frac{5 + 9 - 2 \cdot 3 \cdot \sqrt{5}}{4} = \left(\frac{3 - \sqrt{5}}{2}\right)^2. $$

Hence $r^2 = \frac{3 - \sqrt{5}}{2}$, taking the non-negative square root since $r^2 \ge 0$. Then $r = \pm \frac{\sqrt{5} - 1}{2}$ since $\left(\frac{\sqrt{5} - 1}{2}\right)^2 = \frac{6 - 2\sqrt{5}}{4} = \frac{3 - \sqrt{5}}{2}$. The positivity condition forces $r > 0$, so $r = \frac{\sqrt{5} - 1}{2}$.

Now $a = \frac{3 - \sqrt{5}}{r^2} = \frac{3 - \sqrt{5}}{(3 - \sqrt{5}) / 2} = 2$. Finally $1 - r = \frac{3 - \sqrt{5}}{2}$, so
$$ S_{\infty} = \frac{2}{(3 - \sqrt{5}) / 2} = \frac{4}{3 - \sqrt{5}} = \frac{4(3 + \sqrt{5})}{9 - 5} = \frac{4(3 + \sqrt{5})}{4} = 3 + \sqrt{5}. $$
