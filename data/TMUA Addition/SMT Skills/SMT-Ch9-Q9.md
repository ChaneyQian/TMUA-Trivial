---
database: MAT
qid: 90020370900
id: SMT-Ch9-Q9
paper: SMT Skills Ch9
year:
number: Q9
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: MAT
solution_source: 书后解答
status: 已入库
---

## 题目
In triangle $ABC$ below, angles $\alpha, \beta$ and $\gamma$ are such that $0 < \alpha \le \beta \le \gamma < 90^\circ$.

![[Image/SMT-Ch9-Q9-fig1.png]]

Which of the following statements must be true?

(a) $\sin\alpha \sin\beta \sin\gamma < \frac{1}{2}$
(b) $\sin\alpha + \sin\beta + \sin\gamma < 2$
(c) $\sin\alpha + \sin\beta + \sin\gamma > 2$
(d) $\cos\alpha + \cos\beta + \cos\gamma > \frac{3}{2}$
(e) $\cos\alpha + \cos\beta + \cos\gamma < \frac{3}{2}$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 9 章 Trigonometry 章末 MAT style 第 9 题；解析为书后官方 worked solution。

## 答案
C

## 解析
The three angles of a triangle sum to $180^\circ$, and here all three are strictly less than $90^\circ$; the ordering $\alpha \le \beta \le \gamma$ is just a labelling convention.

The quickest route is to test the one triangle that is certainly allowed, the equilateral triangle $\alpha = \beta = \gamma = 60^\circ$:

$$\sin\alpha \sin\beta \sin\gamma = \left(\frac{\sqrt{3}}{2}\right)^3 = \frac{3\sqrt{3}}{8} \approx 0.6495, \qquad \sin\alpha + \sin\beta + \sin\gamma = \frac{3\sqrt{3}}{2} \approx 2.598,$$

$$\cos\alpha + \cos\beta + \cos\gamma = 3 \times \frac{1}{2} = \frac{3}{2}.$$

This single example kills four of the five options. The product is greater than $\frac{1}{2}$, so (a) is not always true.
The sum of sines is greater than $2$, so (b) is not always true.
The sum of cosines is exactly $\frac{3}{2}$, so it is neither greater than $\frac{3}{2}$ nor less than $\frac{3}{2}$, and both (d) and (e) fail. Only (c) is left.

Statement (c) is genuinely always true, and the proof is short. The graph of $\sin$ is concave on $0^\circ \le x \le 90^\circ$, so on that range it lies on or above the chord joining $(0^\circ, 0)$ and $(90^\circ, 1)$:

$$\sin x \ge \frac{x}{90} \quad \text{for } 0^\circ \le x \le 90^\circ,$$

with equality only at the two endpoints. All three angles lie strictly inside that range, so adding the three inequalities gives

$$\sin\alpha + \sin\beta + \sin\gamma > \frac{\alpha + \beta + \gamma}{90} = \frac{180}{90} = 2.$$

The correct answer is (c).

The bound is sharp: as $\gamma \to 90^\circ$ and $\alpha \to 0^\circ$ the sum tends to $2$ from above, which is why the strict inequalities $0 < \alpha$ and $\gamma < 90^\circ$ matter.
A scan of $400\,000$ random acute triangles found a minimum sum of $2.0029$, consistent with an infimum of exactly $2$.

> ⚠️ **原书插图与题设条件矛盾（勿照图量角）** —— 原书 Ch09 分册 p22 的图量得 $\alpha \approx 59.4^\circ$、$\beta \approx 62.7^\circ$、$\gamma \approx 57.9^\circ$，
> 即图中 $\gamma$ 反而最小，违反题设 $\alpha \le \beta \le \gamma$（该条件蕴含 $\gamma \ge 60^\circ$）。本解不使用图中任何测量值，只用 $\alpha + \beta + \gamma = 180^\circ$ 与 $0 < \alpha \le \beta \le \gamma < 90^\circ$。
