---
database: TMUA
qid: 90020250300
id: SMT-Ch7-Q3
paper: SMT Skills Ch7
year:
number: Q3
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
$$ \left(2\cos\frac{\theta}{2} + 1\right) (\sin \theta + \cos \theta) \le 0 \text{ is true.} $$

$$\mathbf{A} \quad \frac{1}{6}$$

$$\mathbf{B} \quad \frac{7}{12}$$

$$\mathbf{C} \quad \frac{3}{4}$$

$$\mathbf{D} \quad \frac{1}{4}$$

$$\mathbf{E} \quad \frac{1}{2}$$

$$\mathbf{F} \quad \frac{5}{12}$$

$$\mathbf{G} \quad \frac{5}{6}$$

$$\mathbf{H} \quad \frac{2}{3}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 7 章 Graphs 章末 TMUA style 第 3 题；解析为书后官方 worked solution。

## 答案
F

## 解析
Put $P = 2\cos\frac{\theta}{2} + 1$ and $Q = \sin\theta + \cos\theta = \sqrt{2}\sin\left(\theta + \frac{\pi}{4}\right)$, and note that
$0 \le \theta \le 2\pi$ means $0 \le \frac{\theta}{2} \le \pi$, so $\cos\frac{\theta}{2}$ decreases steadily from $1$ to $-1$.
$$P \le 0 \iff \cos\frac{\theta}{2} \le -\frac{1}{2} \iff \frac{2\pi}{3} \le \frac{\theta}{2} \le \pi \iff \frac{4\pi}{3} \le \theta \le 2\pi$$
$$Q \le 0 \iff \pi \le \theta + \frac{\pi}{4} \le 2\pi \iff \frac{3\pi}{4} \le \theta \le \frac{7\pi}{4}$$
The product is $\le 0$ on two stretches: where $P \ge 0$ and $Q \le 0$, namely $\frac{3\pi}{4} \le \theta \le \frac{4\pi}{3}$, of length
$\frac{7\pi}{12}$; and where $P \le 0$ and $Q \ge 0$, namely $\frac{7\pi}{4} \le \theta \le 2\pi$, of length $\frac{\pi}{4}$.
$$\frac{7\pi}{12} + \frac{3\pi}{12} = \frac{5\pi}{6}, \qquad \frac{5\pi/6}{2\pi} = \frac{5}{12}$$
The correct answer is (F).
On $\frac{4\pi}{3} < \theta < \frac{7\pi}{4}$ both brackets are negative, so the product is positive there; missing that overlap is what produces the $\frac{7}{12}$ and $\frac{5}{6}$ distractors.
