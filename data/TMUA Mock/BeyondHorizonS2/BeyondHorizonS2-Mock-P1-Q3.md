---
database: TMUA
qid: 20132101212103
id: BeyondHorizonS2-Mock-P1-Q3
paper: TMUA Mock
year:
number: Q3
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: [待补答案, 原卷缺陷]
status: 已入库
---

## 题目
It is given that
$$y = (1 + \cos x) \sin 3x \quad \text{for} \quad 0 < x < \pi$$
The complete set of values of $x$ for which $y$ is negative is:
$$\mathbf{A} \quad 0 < x < \frac{\pi}{6}$$
$$\mathbf{B} \quad 0 < x < \frac{\pi}{3}$$
$$\mathbf{C} \quad \frac{\pi}{3} < x < \frac{\pi}{2}$$
$$\mathbf{D} \quad \frac{2\pi}{3} < x < \pi$$
$$\mathbf{E} \quad 0 < x < \frac{\pi}{2}$$
$$\mathbf{F} \quad \frac{\pi}{6} < x < \frac{\pi}{2}$$

## 备注

### 我的备注

### AI备注

- **原卷缺陷：定义域下无正确选项。**
  题面写 $0 < x < \pi$。因 $1+\cos x > 0$ 在该区间恒成立，$y<0 \iff \sin 3x<0$；
  $3x \in (0,3\pi)$ 时 $\sin 3x<0$ 当且仅当 $3x \in (\pi,2\pi)$，即
  $$\frac{\pi}{3} < x < \frac{2\pi}{3}$$
  六个选项 A–F 中**没有这个区间**。若定义域实为 $0<x<\frac{\pi}{2}$，答案恰为选项 C
  （$\frac{\pi}{3}<x<\frac{\pi}{2}$），故高度怀疑原卷把 $\frac{\pi}{2}$ 误印成 $\pi$。
  按「以原卷为准」题面未改，`ANSWER` 记的 C 只是最接近项，**不是正确答案**。


## 答案
C

## 解析
On the open interval $0 < x < \pi$ we have $-1 < \cos x < 1$, so the factor $1 + \cos x$ is strictly positive throughout and the sign of $y$ is the sign of $\sin 3x$ alone. As $x$ runs over $(0, \pi)$ the argument $3x$ runs over $(0, 3\pi)$, and $\sin 3x < 0$ exactly when $3x \in (\pi, 2\pi)$, that is when
$$\frac{\pi}{3} < x < \frac{2\pi}{3}.$$
That interval is not offered by any of the six options, so as printed the question has no correct answer. The option list does fit the same computation carried out on the smaller domain $0 < x < \frac{\pi}{2}$, where the negative part of $(1 + \cos x)\sin 3x$ is precisely $\frac{\pi}{3} < x < \frac{\pi}{2}$, matching option C; on that reading the answer is C. The recorded answer is therefore provisional and the printed upper limit of the domain needs checking against the author's intent.
TODO(待校对): Q3 的正确解集为 $\frac{\pi}{3} < x < \frac{2\pi}{3}$，六个选项均无此项；若定义域改成 $0 < x < \frac{\pi}{2}$ 则恰为选项 C。此处 ANSWER 暂记 C，待裁定。
