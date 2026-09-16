---
database: TMUA
qid: 20132101212211
id: BeyondHorizonS2-Mock-P2-Q11
paper: TMUA Mock
year:
number: Q11
section: Multiple Choice
difficulty: 0
topics: [Polynomial, Algebra (Basic)]
subtopics: [Vieta's Formulas, Algebra Manipulation]
tags: [Sum-of-Roots, Clear-Denominators, 原卷缺陷, 待补答案]
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

## 备注

### 我的备注

### AI备注

- **原卷缺陷：正确值不在选项内，且选项 A 与 D 内容完全相同。**
  推出的值是 $-\dfrac{a^{2}+b^{2}}{2}$，四个选项中无此项；
  同时 (A) 与 (D) 都印成 $\dfrac{a^{2}+b^{2}}{2}$（缺负号），疑为排版丢号。
  `ANSWER` 记 B 属折中（唯一带负号者），**不可当作正确答案采信**。
- **键对拍（2026-09-11，键源 tmua.fyi）**：键给 **A**，即印出来的 $\frac{a^2+b^2}{2}$。真值是 $-\frac{a^2+b^2}{2}$，
  所以键证实了「A 项漏印了负号」这一猜测（原先猜 B 是讹误，猜错了对象）。`ANSWER` 改记 A（意图项），印刷缺陷仍在，标签保留。

## 答案
A

## 解析
Clearing denominators gives $c(x + b) + c(x + a) = (x + a)(x + b)$, which rearranges to the quadratic
$$x^2 + (a + b - 2c)x + \bigl(ab - c(a + b)\bigr) = 0.$$
Roots equal in magnitude and opposite in sign have sum zero, so the coefficient of $x$ vanishes, giving $a + b - 2c = 0$ and hence $c = \frac{a + b}{2}$. Substituting this into the constant term yields the product of the roots as
$$ab - \frac{(a + b)^2}{2} = \frac{2ab - a^2 - 2ab - b^2}{2} = -\frac{a^2 + b^2}{2}.$$
This value appears in none of the four printed options: A and D are the identical expression $\frac{a^2 + b^2}{2}$, which has the wrong sign, B has both a different numerator and a different denominator, and C is $c$ itself rather than the product. Option B is the only one carrying a minus sign and is most plausibly a mangling of $-\frac{a^2 + b^2}{2}$, so B is recorded provisionally; the item as printed is defective.
