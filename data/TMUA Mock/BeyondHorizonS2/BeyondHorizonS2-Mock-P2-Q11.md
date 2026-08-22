---
database: TMUA
qid: 20132101212211
id: BeyondHorizonS2-Mock-P2-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: [待补答案, 原卷缺陷]
status: 已入库
---

## 题目
If the roots of
$$\frac{1}{x + a} + \frac{1}{x + b} = \frac{1}{c}$$
are equal in magnitude but opposite in sign, then the product of the roots is
$$\mathbf{A} \quad \frac{a^2 + b^2}{2}$$
$$\mathbf{B} \quad \frac{-a^2 + b^2}{4}$$
$$\mathbf{C} \quad \frac{a + b}{2}$$
$$\mathbf{D} \quad \frac{a^2 + b^2}{2}$$
TODO(待校对): 原卷选项 (A) 与 (D) 内容完全相同，且下面推得的正确值 $-\frac{a^2+b^2}{2}$ 不在任何一个选项里；(B) 疑为 $\frac{-(a^2+b^2)}{2}$ 的排版讹误。此处按原卷原样转写，ANSWER 暂填 B，待统筹者裁定。

## 备注

### 我的备注

### AI备注

- **原卷缺陷：正确值不在选项内，且选项 A 与 D 内容完全相同。**
  推出的值是 $-\dfrac{a^{2}+b^{2}}{2}$，四个选项中无此项；
  同时 (A) 与 (D) 都印成 $\dfrac{a^{2}+b^{2}}{2}$（缺负号），疑为排版丢号。
  `ANSWER` 记 B 属折中（唯一带负号者），**不可当作正确答案采信**。


## 答案
B

## 解析
Clearing denominators gives $c(x + b) + c(x + a) = (x + a)(x + b)$, which rearranges to the quadratic
$$x^2 + (a + b - 2c)x + \bigl(ab - c(a + b)\bigr) = 0.$$
Roots equal in magnitude and opposite in sign have sum zero, so the coefficient of $x$ vanishes, giving $a + b - 2c = 0$ and hence $c = \frac{a + b}{2}$. Substituting this into the constant term yields the product of the roots as
$$ab - \frac{(a + b)^2}{2} = \frac{2ab - a^2 - 2ab - b^2}{2} = -\frac{a^2 + b^2}{2}.$$
This value appears in none of the four printed options: A and D are the identical expression $\frac{a^2 + b^2}{2}$, which has the wrong sign, B has both a different numerator and a different denominator, and C is $c$ itself rather than the product. Option B is the only one carrying a minus sign and is most plausibly a mangling of $-\frac{a^2 + b^2}{2}$, so B is recorded provisionally; the item as printed is defective.
