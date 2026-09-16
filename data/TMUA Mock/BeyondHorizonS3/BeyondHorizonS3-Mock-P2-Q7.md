---
database: TMUA
qid: 20132101213207
id: BeyondHorizonS3-Mock-P2-Q7
paper: TMUA Mock
year:
number: Q7
section: Multiple Choice
difficulty: 0
topics: [Algebra (Basic)]
subtopics: [Algebra Manipulation]
tags: [Homogeneity, Percentage-Change, Scaling]
status: 已入库
---

## 题目
Each of the positive real numbers $a, b, c, d, e$ is decreased by $20\%$. Find the resulting percentage change in the value of the following expression:
$$\frac{a-b}{cd} - \frac{b^2+c^2}{d^3+ae^2}$$
$$\mathbf{A} \quad \text{No change}$$
$$\mathbf{B} \quad \text{Decrease of 20\%}$$
$$\mathbf{C} \quad \text{Increase of 20\%}$$
$$\mathbf{D} \quad \text{Decrease of 25\%}$$
$$\mathbf{E} \quad \text{Increase of 25\%}$$

## 备注

### 我的备注

### AI备注
- **键对拍（2026-09-11，键源 tmua.fyi）**：键给 **D**（减少 25%），库记 **E**（增加 25%）。**库是对的，键错。**
  两个分式都是 $-1$ 次齐次式，全体变量乘 $0.8$ 后整体乘 $1/0.8=1.25$，无论原值正负，变化率都是 $+25\%$；
  随机取值数值验证得 $+25.0\%$。出题人多半想当然「输入减小 ⟹ 输出减小」。

## 答案
E

## 解析
Decreasing every variable by $20\%$ means replacing each of $a, b, c, d, e$ by $k$ times itself with $k = 0.8$. The point is that each of the two fractions is homogeneous, so the whole expression simply picks up a power of $k$.

In the first fraction, the numerator $a - b$ has degree $1$ and becomes $k(a-b)$, while the denominator $cd$ has degree $2$ and becomes $k^2 cd$. The fraction therefore becomes
$$\frac{k(a-b)}{k^2 cd} = \frac{1}{k} \cdot \frac{a-b}{cd}.$$
In the second fraction, the numerator $b^2 + c^2$ has degree $2$ and becomes $k^2(b^2+c^2)$, while every term of the denominator, $d^3$ and $ae^2$, has degree $3$, so the denominator becomes $k^3(d^3+ae^2)$. The fraction therefore becomes $\frac{1}{k}$ times its old value as well.

Both parts scale by the same factor $1/k$, so the whole expression is multiplied by
$$\frac{1}{0.8} = 1.25,$$
whatever the sign of the original value. That is an increase of $25\%$. The answer is E.
