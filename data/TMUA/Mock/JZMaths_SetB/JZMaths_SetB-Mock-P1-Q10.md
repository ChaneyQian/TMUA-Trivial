---
database: TMUA
qid: 20132101206110
id: JZMaths_SetB-Mock-P1-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 7
topics: []
subtopics: []
tags: [General Trigonometry, Area Integration]
status: 已入库
---

## 题目
Which of the following integrals has the **greatest** value?

$$ \mathbf{A} \quad \int_{-\frac{\pi}{2}}^{\frac{\pi}{2}} (\sin^{\frac{1}{3}} x) \, dx $$
$$ \mathbf{B} \quad \int_{-\frac{\pi}{2}}^{\frac{\pi}{2}} |\cos(\frac{\pi}{2} - x)| \, dx $$
$$ \mathbf{C} \quad \int_{-\frac{\pi}{2}}^{\frac{\pi}{2}} (\sin^2 x) \, dx $$
$$ \mathbf{D} \quad \int_{0}^{\pi} \sqrt{\left|\sin \left(x - \frac{\pi}{2}\right)\right|} \, dx $$
$$ \mathbf{E} \quad \int_{-\frac{\pi}{2}}^{\frac{\pi}{2}} \sqrt{1 - \cos^2 x} \, dx $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Answer: D

Option A is $0$ since $\sin^{\frac{1}{3}} x$ is an odd function.

Option B: $|\cos(\frac{\pi}{2} - x)| = |\sin x|$, therefore value of B is $2$ times the area under the graph of $\sin x$ between $0$ to $\frac{\pi}{2}$.

Option E: $\sqrt{1 - \cos^2 x} = \sqrt{\sin^2 x} = |\sin x|$, so B and E have the same area, and so are both eliminated - there cannot be two correct options!

Option C: $\sin^2 x < |\sin x|$ since $-1 \le \sin x \le 1$, so C has an area less than B or E.

Therefore it must be D.

Let's check it anyway. $\sqrt{\left|\sin \left(x - \frac{\pi}{2}\right)\right|} = \sqrt{|\cos x|}$, therefore value of D is $2$ times the area under the graph of $\sqrt{\cos x}$ between $0$ to $\frac{\pi}{2}$, this is the same as that of $\sqrt{\sin x}$, which is greater than $\sin x$ since $\sqrt{a} \ge a$ if $a$ is between $0$ and $1$.
