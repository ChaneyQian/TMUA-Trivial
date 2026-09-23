---
database: TMUA
qid: 90020270200
id: SMT-Ch9-Q2
paper: SMT Skills Ch9
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
Find the value of $\sum_{r=0}^{100} \cos\left(\frac{2r + 1}{4}\pi\right)$.

$$\mathbf{A} \quad 0$$

$$\mathbf{B} \quad \frac{\sqrt{2}}{2}$$

$$\mathbf{C} \quad \sqrt{2}$$

$$\mathbf{D} \quad 2\sqrt{2}$$

$$\mathbf{E} \quad 100\sqrt{2}$$

$$\mathbf{F} \quad 101\sqrt{2}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 9 章 Trigonometry 章末 TMUA style 第 2 题；解析为书后官方 worked solution。

## 答案
B

## 解析
Consecutive angles differ by $\frac{2\pi}{4} = \frac{\pi}{2}$, so the terms repeat with period $4$:

$$\cos\frac{\pi}{4} = \frac{\sqrt{2}}{2}, \quad \cos\frac{3\pi}{4} = -\frac{\sqrt{2}}{2}, \quad \cos\frac{5\pi}{4} = -\frac{\sqrt{2}}{2}, \quad \cos\frac{7\pi}{4} = \frac{\sqrt{2}}{2},$$

and any four consecutive terms add to $0$.

The sum runs over $r = 0, 1, \dots, 100$, which is $101$ terms. The first $100$ of them split into $25$ complete blocks of four and contribute nothing, leaving only the term $r = 100$:

$$\frac{2(100) + 1}{4}\pi = \frac{201\pi}{4} = 50\pi + \frac{\pi}{4},$$

so that term is $\cos\left(50\pi + \frac{\pi}{4}\right) = \cos\frac{\pi}{4} = \frac{\sqrt{2}}{2}$.

The correct answer is (B).

Option A, $0$, is the trap for anyone who assumes the blocks of four exhaust the sum; $101$ is one more than a multiple of $4$, not a multiple of $4$.
