---
database: TMUA
qid: 99000200100
id: Wild-Q01
paper: TMUA Wild
year:
number: Q1
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
answer_verified: true
status: 已入库
---

## 题目
Find the fraction of the interval $0 \leq \theta \leq 2\pi$ for which the inequality
$$
(\cos\theta + \sin\theta)\left(\frac{\sqrt{3}}{2} + \cos\frac{1}{2}\theta\right)(\cos 2\theta - 1) \leq 0
$$
is satisfied.

$$\mathbf{A} \quad \frac{1}{4}$$

$$\mathbf{B} \quad \frac{5}{12}$$

$$\mathbf{C} \quad \frac{1}{2}$$

$$\mathbf{D} \quad \frac{2}{3}$$

$$\mathbf{E} \quad \frac{3}{4}$$

$$\mathbf{F} \quad \frac{5}{6}$$

## 备注

### 我的备注

### AI备注
- **来源**：用户 2026-09-18 转来的一篇文章里的 10 题之一（原文第 9 题）。其余 9 题在库内都有出处（Yotta Mock ×4、MAT 2004/2005 ×3、TMUA 2018 P1 Q19、MAT 2023 Q1J），唯独这题全库、`TMUA MD/`、`TMUA mock MD/` 均未找到，出处不明，故入「野题」。
- **疑似改编**：句式与 **TMUA 2019 P1 Q17**（`Find the fraction of the interval … for which the inequality … is satisfied`）逐字相同，那题是 $\left(\sin 2\theta - \tfrac12\right)(\sin\theta - \cos\theta) \geq 0$、区间 $[0, \pi]$。
- **答案 C 级**：无答案键，统筹者自解；另用 200 万点中点采样独立数值确认比例 $= 0.4166\ldots = \tfrac{5}{12}$。
- 设计要点：第三个因子 $\cos 2\theta - 1 = -2\sin^2\theta \leq 0$ 恒成立，是个「不改变符号、只贡献零点」的因子——看不出这一点就会去解三因子的符号表。
- qid 用 `9900` 年段（无年份卷保留段里给「野题」划的一段），见 `题库端Qid.md` §3。

## 答案
B

## 解析
Since $\cos 2\theta - 1 = -2\sin^{2}\theta \leq 0$ for every $\theta$, the third factor never changes the sign of the product; it is zero only at $\theta = 0, \pi, 2\pi$, which are isolated points and do not affect the fraction. So, apart from those points, the inequality holds exactly when
$$
(\cos\theta + \sin\theta)\left(\frac{\sqrt{3}}{2} + \cos\frac{1}{2}\theta\right) \geq 0.
$$

For the first factor, $\cos\theta + \sin\theta = \sqrt{2}\sin\left(\theta + \frac{\pi}{4}\right)$, which is non-negative for $0 \leq \theta \leq \frac{3\pi}{4}$ and for $\frac{7\pi}{4} \leq \theta \leq 2\pi$, and negative in between.

For the second factor, $\frac{1}{2}\theta$ runs over $[0, \pi]$, and $\cos\frac{1}{2}\theta > -\frac{\sqrt{3}}{2}$ exactly when $\frac{1}{2}\theta < \frac{5\pi}{6}$, i.e. $\theta < \frac{5\pi}{3}$. So the second factor is positive on $\left[0, \frac{5\pi}{3}\right)$ and negative on $\left(\frac{5\pi}{3}, 2\pi\right]$.

Both factors are non-negative on $\left[0, \frac{3\pi}{4}\right]$ (the interval $\left[\frac{7\pi}{4}, 2\pi\right]$ lies beyond $\frac{5\pi}{3}$, where the second factor is negative). Both are non-positive on $\left[\frac{5\pi}{3}, \frac{7\pi}{4}\right]$. The total length is
$$
\frac{3\pi}{4} + \left(\frac{7\pi}{4} - \frac{5\pi}{3}\right) = \frac{3\pi}{4} + \frac{\pi}{12} = \frac{5\pi}{6},
$$
and the required fraction is
$$
\frac{5\pi/6}{2\pi} = \frac{5}{12}.
$$

The answer is B.
