---
database: TMUA
qid: 20132101203108
id: Yotta-Mock-P1-Q8
paper: TMUA Mock
year:
number: Q8
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
The graph of $y = \tan(\cos(\sin(x)))$ has a period of $P$ and a maximum value of $M$. Which row is correct?

| | $P$ | $M$ |
|---|---|---|
| **(A)** | $P = 1$ | $M < 1$ |
| **(B)** | $P = 1$ | $M > 1$ |
| **(C)** | $P = \frac{\pi}{2}$ | $M < 1$ |
| **(D)** | $P = \frac{\pi}{2}$ | $M > 1$ |
| **(E)** | $P = \pi$ | $M < 1$ |
| **(F)** | $P = \pi$ | $M > 1$ |
| **(G)** | $P = 2\pi$ | $M < 1$ |
| **(H)** | $P = 2\pi$ | $M > 1$ |

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
**Period.** Because $\sin(x+\pi) = -\sin x$ and cosine is even,

$$ \cos\bigl(\sin(x+\pi)\bigr) = \cos(-\sin x) = \cos(\sin x) $$

so the whole function repeats with period $\pi$. It is no shorter than $\pi$: the inner function $\cos(\sin x)$ attains its maximum $1$ exactly when $\sin x = 0$, i.e. at the integer multiples of $\pi$, and consecutive maxima are $\pi$ apart. So $P = \pi$.

**Maximum.** As $x$ varies, $\sin x$ covers $[-1, 1]$, so $\cos(\sin x)$ covers $[\cos 1, 1]$, with maximum $1$ at $\sin x = 0$. Since $\tan$ is increasing on $[\cos 1, 1] \subset \bigl[0, \frac{\pi}{2}\bigr)$, the maximum of the whole function is $M = \tan 1$. As $1 > \frac{\pi}{4}$ we get $\tan 1 > \tan\frac{\pi}{4} = 1$, so $M > 1$.

The answer is F.
