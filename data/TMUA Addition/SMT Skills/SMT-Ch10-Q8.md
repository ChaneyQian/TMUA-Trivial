---
database: TMUA
qid: 90020280800
id: SMT-Ch10-Q8
paper: SMT Skills Ch10
year:
number: Q8
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
A student attempts to solve the simultaneous equations
$$ \sqrt{2}\sin 2x - 2\cos 2x = 1 - \sqrt{2} \quad \text{(A)} $$
$$ \sin 2x + 2\sqrt{2}\cos 2x = \frac{1}{2}(4 + \sqrt{2}) \quad \text{(B)} $$
for $-\pi \le x \le \pi$.
The student’s attempt is as follows.
$$ \sqrt{2} \times \text{(B)} - \text{(A)} $$
$$ \sqrt{2}\sin 2x + 4\cos 2x - \left(\sqrt{2}\sin 2x - 2\cos 2x\right) $$
$$ = \frac{\sqrt{2}}{2}(4 + \sqrt{2}) - (1 - \sqrt{2}) \quad \text{(I)} $$
$$ \text{So } 6\cos 2x = 3\sqrt{2} \quad \text{(II)} $$
$$ \text{So } \cos 2x = \frac{\sqrt{2}}{2} \quad \text{(III)} $$
$$ \text{So } 2x = \pm \frac{\pi}{4}, \pm \frac{7\pi}{4} \quad \text{(IV)} $$
$$ \text{So } x = \pm \frac{\pi}{8}, \pm \frac{7\pi}{8} \quad \text{(V)} $$
Which of the following best describes this attempt?

$$\mathbf{A} \quad \text{It is completely correct.}$$

$$\mathbf{B} \quad \text{It is incorrect and the first error occurs on line (I).}$$

$$\mathbf{C} \quad \text{It is incorrect and the first error occurs on line (II).}$$

$$\mathbf{D} \quad \text{It is incorrect and the first error occurs on line (III).}$$

$$\mathbf{E} \quad \text{It is incorrect and the first error occurs on line (IV).}$$

$$\mathbf{F} \quad \text{It is incorrect and the first error occurs on line (V).}$$

$$\mathbf{G} \quad \text{It is incorrect and the error is that some of the solutions are not consistent with both equations.}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 10 章 Logic and proof 章末 TMUA style 第 8 题；解析为书后官方 worked solution。

## 答案
G

## 解析
Check the student's lines one at a time. Multiplying (B) by $\sqrt{2}$ gives

$$\sqrt{2}\sin 2x + 4\cos 2x = \frac{\sqrt{2}}{2}\left(4 + \sqrt{2}\right),$$

since $\sqrt{2} \times 2\sqrt{2} = 4$, and subtracting (A) from this is exactly what line (I) writes down, so line (I) is correct.

On the left the terms in $\sin 2x$ cancel and the terms in $\cos 2x$ add to $4\cos 2x + 2\cos 2x = 6\cos 2x$. On the right,

$$\frac{\sqrt{2}}{2}\left(4 + \sqrt{2}\right) - \left(1 - \sqrt{2}\right) = 2\sqrt{2} + 1 - 1 + \sqrt{2} = 3\sqrt{2},$$

so line (II) is correct, and dividing by $6$ makes line (III) correct. Since $-\pi \le x \le \pi$ gives $-2\pi \le 2x \le 2\pi$, the solutions of $\cos 2x = \frac{\sqrt{2}}{2}$ in that
range are exactly $2x = \pm\frac{\pi}{4}$ and $2x = \pm\frac{7\pi}{4}$, so lines (IV) and (V) are correct too.

Every line is right, and yet the answer is wrong, because the combination $\sqrt{2} \times \text{(B)} - \text{(A)}$ is only a *consequence* of the two equations and is not equivalent to
them. It produces candidate solutions, and each one has to be checked, exactly as with the extraneous solution in the section on that topic.

Substituting $\cos 2x = \frac{\sqrt{2}}{2}$ back into (A),

$$\sqrt{2}\sin 2x = 1 - \sqrt{2} + 2 \times \frac{\sqrt{2}}{2} = 1, \qquad \text{so } \sin 2x = \frac{\sqrt{2}}{2}.$$

So $\sin 2x$ and $\cos 2x$ must both equal $\frac{\sqrt{2}}{2}$, which leaves only $2x = \frac{\pi}{4}$ and $2x = \frac{\pi}{4} - 2\pi = -\frac{7\pi}{4}$, that is $x = \frac{\pi}{8}$ and
$x = -\frac{7\pi}{8}$. The other two candidates have $\sin 2x = -\frac{\sqrt{2}}{2}$ and satisfy neither original equation; substituting $x = -\frac{\pi}{8}$ or $x = \frac{7\pi}{8}$ into (A) leaves a residue of $-2$.

The correct answer is (G).

Options B to F all invite you to hunt for a slipped sign or a lost solution, and there is none: sympy confirms that $\sqrt{2} \times \text{(B)} - \text{(A)}$ simplifies to
$6\cos 2x - 3\sqrt{2}$ exactly, and that the system's full solution set on $-\pi \le x \le \pi$ is $\left\{\frac{\pi}{8},\ -\frac{7\pi}{8}\right\}$. The fault is not in any line but in treating a one-way deduction as reversible.
