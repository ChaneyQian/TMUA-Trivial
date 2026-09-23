---
database: TMUA
qid: 90020270100
id: SMT-Ch9-Q1
paper: SMT Skills Ch9
year:
number: Q1
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: TMUA
solution_source: 书后解答
status: 已入库
---

## 题目
Find the fraction of the interval $0 \le \theta \le 2\pi$ for which the inequality
$$ (\cos \theta + \sin \theta)\left(\frac{\sqrt{3}}{2} + \cos\frac{1}{2}\theta\right)(\cos^2 \theta - 1) \le 0 $$
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
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 9 章 Trigonometry 章末 TMUA style 第 1 题；解析为书后官方 worked solution。

## 答案
B

## 解析
Deal with the third factor first. Since $\cos^2\theta - 1 = -\sin^2\theta$, it is never positive, and it is zero exactly at $\theta = 0, \pi, 2\pi$.
At those three isolated points the whole product is $0$ and the inequality holds; everywhere else the third factor is strictly negative, so dividing by it reverses the inequality:

$$(\cos\theta + \sin\theta)\left(\frac{\sqrt{3}}{2} + \cos\frac{1}{2}\theta\right) \ge 0.$$

For the second factor, as $\theta$ runs from $0$ to $2\pi$ the half-angle $\frac{1}{2}\theta$ runs from $0$ to $\pi$, over which $\cos\frac{1}{2}\theta$ decreases steadily from $1$ to $-1$.
It equals $-\frac{\sqrt{3}}{2}$ once, at $\frac{1}{2}\theta = \frac{5\pi}{6}$, i.e. $\theta = \frac{5\pi}{3}$.
So the factor is positive for $\theta < \frac{5\pi}{3}$ and negative for $\theta > \frac{5\pi}{3}$.

For the first factor, $\cos\theta + \sin\theta = 0$ means $\tan\theta = -1$, i.e. $\theta = \frac{3\pi}{4}$ or $\theta = \frac{7\pi}{4}$, and at $\theta = 0$ the factor equals $1 > 0$.

![[Image/SMT-Ch9-Q1-sol1.png]]

The two factors have the same sign on $0 \le \theta \le \frac{3\pi}{4}$ (both positive) and on $\frac{5\pi}{3} \le \theta \le \frac{7\pi}{4}$ (both negative), and opposite signs elsewhere. The total length of the solution set is therefore

$$\frac{3\pi}{4} + \left(\frac{7\pi}{4} - \frac{5\pi}{3}\right) = \frac{3\pi}{4} + \frac{\pi}{12} = \frac{10\pi}{12} = \frac{5\pi}{6},$$

and as a fraction of the whole interval of length $2\pi$ this is

$$\frac{5\pi/6}{2\pi} = \frac{5}{12}.$$

The correct answer is (B).

Option C, $\frac{1}{2}$, is what you get by ignoring the middle factor altogether: the condition would then be $\cos\theta + \sin\theta \ge 0$, giving $\left[0, \frac{3\pi}{4}\right] \cup \left[\frac{7\pi}{4}, 2\pi\right]$, of total length $\pi$.
