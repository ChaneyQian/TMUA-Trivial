---
database: TMUA
qid: 20132101211209
id: BeyondHorizonS1-Mock-P2-Q9
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
Let $a,b,c$ be real numbers. Then the fourth-degree polynomial in $x$:
$$acx^4+b(a+c)x^3+(a^2+b^2+c^2)x^2+b(a+c)x+ac$$
$$\mathbf{A} \quad \text{has four complex (non-real) roots;}$$
$$\mathbf{B} \quad \text{has either four real roots or four complex roots;}$$
$$\mathbf{C} \quad \text{has two real roots and two complex roots;}$$
$$\mathbf{D} \quad \text{has four real roots.}$$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
The coefficients are palindromic, which suggests splitting the quartic into two quadratics built from the same three letters, and expanding $(ax^2+bx+c)(cx^2+bx+a)$ gives
$$acx^4+(ab+bc)x^3+(a^2+b^2+c^2)x^2+(ab+bc)x+ac,$$
which is exactly the given polynomial since $ab+bc=b(a+c)$. The two quadratic factors $ax^2+bx+c$ and $cx^2+bx+a$ have the same discriminant $b^2-4ac$, so their root types are locked together: if $b^2\geq 4ac$ both contribute two real roots, giving four real roots, while if $b^2<4ac$ both contribute a conjugate pair, giving four non-real roots. No choice of $a,b,c$ can produce a mixture, so C is impossible, and neither A nor D holds universally. The answer is B.
