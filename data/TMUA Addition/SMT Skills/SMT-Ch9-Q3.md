---
database: TMUA
qid: 90020270300
id: SMT-Ch9-Q3
paper: SMT Skills Ch9
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
Find the number of solutions of the equation $x^2 \cos 4x = 8\sin 4x$ in the interval $0 \le x \le \pi$.

$$\mathbf{A} \quad 0$$

$$\mathbf{B} \quad 1$$

$$\mathbf{C} \quad 2$$

$$\mathbf{D} \quad 3$$

$$\mathbf{E} \quad 4$$

$$\mathbf{F} \quad 5$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 9 章 Trigonometry 章末 TMUA style 第 3 题；解析为书后官方 worked solution。

## 答案
E

## 解析
If $\cos 4x = 0$ then the equation forces $\sin 4x = 0$ as well, which is impossible. So $\cos 4x \neq 0$ at every solution and the equation is equivalent to

$$\tan 4x = \frac{x^2}{8}.$$

On $0 \le x \le \pi$ the function $\tan 4x$ has vertical asymptotes where $4x = \frac{\pi}{2}, \frac{3\pi}{2}, \frac{5\pi}{2}, \frac{7\pi}{2}$,
that is at $x = \frac{\pi}{8}, \frac{3\pi}{8}, \frac{5\pi}{8}, \frac{7\pi}{8}$, which cut the interval into five pieces.

![[Image/SMT-Ch9-Q3-sol1.png]]

The parabola $y = \frac{x^2}{8}$ climbs from $0$ to $\frac{\pi^2}{8} \approx 1.23$, and its gradient $\frac{x}{4}$ never exceeds $\frac{\pi}{4} < 1$,
whereas the gradient of $\tan 4x$ is $\frac{4}{\cos^2 4x} \ge 4$.
So on each branch the difference $\tan 4x - \frac{x^2}{8}$ is strictly increasing, and each branch can meet the parabola at most once.

On the first piece $0 \le x < \frac{\pi}{8}$ both sides are $0$ at $x = 0$, so $x = 0$ is a solution; after that the strictly increasing difference stays positive, so there is no second crossing there.

On each of the three middle pieces $\tan 4x$ sweeps from $-\infty$ to $+\infty$, so the difference does too and there is exactly one crossing on each: three more solutions.

On the last piece $\frac{7\pi}{8} < x \le \pi$ the function $\tan 4x$ climbs from $-\infty$ only as far as $\tan 4\pi = 0$, while $\frac{x^2}{8} > 0$ throughout, so there is no crossing.

That gives $1 + 3 = 4$ solutions in total.

The correct answer is (E).

Option D, $3$, is what you get by counting only the three "full" branches and overlooking the solution $x = 0$ at the very start of the interval.
