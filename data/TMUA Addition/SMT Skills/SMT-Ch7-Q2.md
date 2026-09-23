---
database: TMUA
qid: 90020250200
id: SMT-Ch7-Q2
paper: SMT Skills Ch7
year:
number: Q2
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
Find the complete set of values of $x$, with $-\pi \le x \le \pi$, for which $(1 - 2\cos 2x)(1 + 2\sin x) \le 0$.

$$\mathbf{A} \quad -\pi \le x \le -\frac{5\pi}{6}, -\frac{\pi}{6} \le x \le \frac{\pi}{6}, \frac{5\pi}{6} \le x \le \pi$$

$$\mathbf{B} \quad -\pi \le x \le \frac{\pi}{6}, \frac{5\pi}{6} \le x \le \pi$$

$$\mathbf{C} \quad -\frac{5\pi}{6} \le x \le -\frac{\pi}{6}, \frac{\pi}{6} \le x \le \frac{5\pi}{6}$$

$$\mathbf{D} \quad -\pi \le x \le -\frac{5\pi}{6}, -\frac{\pi}{6} \le x \le \frac{\pi}{6}, x = \frac{\pi}{2}, \frac{5\pi}{6} \le x \le \pi$$

$$\mathbf{E} \quad -\pi \le x \le -\frac{5\pi}{6}, x = -\frac{\pi}{2}, \frac{5\pi}{6} \le x \le \pi$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 7 章 Graphs 章末 TMUA style 第 2 题；解析为书后官方 worked solution。

## 答案
B

## 解析
Write $A = 1 - 2\cos 2x$ and $B = 1 + 2\sin x$ and find where each factor is negative.
$$A \le 0 \iff \cos 2x \ge \frac{1}{2} \iff -\frac{\pi}{3} + 2n\pi \le 2x \le \frac{\pi}{3} + 2n\pi$$
With $-\pi \le x \le \pi$, so $-2\pi \le 2x \le 2\pi$, this gives
$$-\pi \le x \le -\frac{5\pi}{6}, \qquad -\frac{\pi}{6} \le x \le \frac{\pi}{6}, \qquad \frac{5\pi}{6} \le x \le \pi$$
and $A \ge 0$ elsewhere, that is on $-\frac{5\pi}{6} \le x \le -\frac{\pi}{6}$ and on $\frac{\pi}{6} \le x \le \frac{5\pi}{6}$.
$$B \le 0 \iff \sin x \le -\frac{1}{2} \iff -\frac{5\pi}{6} \le x \le -\frac{\pi}{6}$$
Now compare the two. Every point where $A \le 0$ lies outside $\left[-\frac{5\pi}{6}, -\frac{\pi}{6}\right]$, so has $B \ge 0$ and hence
$AB \le 0$. And the whole of $\left[-\frac{5\pi}{6}, -\frac{\pi}{6}\right]$, where $B \le 0$, lies in the set where $A \ge 0$, so those points
give $AB \le 0$ too. Taking the union of the four intervals,
$$-\pi \le x \le \frac{\pi}{6} \qquad\text{and}\qquad \frac{5\pi}{6} \le x \le \pi$$
The correct answer is (B).
Option A is only the set where the first bracket is negative; option D adds $x = \frac{\pi}{2}$, where $A = 3$ and $B = 3$, so $AB = 9 > 0$.
