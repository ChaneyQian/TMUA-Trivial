---
database: TMUA
qid: 20132101203207
id: Yotta-Mock-P2-Q7
paper: TMUA Mock
year:
number: Q7
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
$A, B$ and $C$ are three points on a regular $n$-sided polygon, where $n \geq 3$. Let $O$ be the centre of the circle that has $A, B$ and $C$ on its circumference. In radians, $\angle AOB = \frac{5}{6}\pi$ and $\angle BOC = \frac{2}{5}\pi$. Then $n$ is necessarily a multiple of $k$. What is the largest value of $k$ such that this statement is true?

$$
\mathbf{A} \quad 240
$$

$$
\mathbf{B} \quad 120
$$

$$
\mathbf{C} \quad 60
$$

$$
\mathbf{D} \quad 30
$$

$$
\mathbf{E} \quad 12
$$

$$
\mathbf{F} \quad 6
$$

$$
\mathbf{G} \quad 5
$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
The circle through $A$, $B$ and $C$ is the circumcircle of the regular $n$-gon, and its vertices cut that circle into $n$ equal arcs of $\frac{2\pi}{n}$. So the angle subtended at the centre by any two vertices is a whole multiple of $\frac{2\pi}{n}$.

From $\angle AOB = \frac{5\pi}{6}$, there is an integer $a$ with $\frac{5\pi}{6} = a \cdot \frac{2\pi}{n}$, that is $a = \frac{5n}{12}$. For $a$ to be an integer we need $12 \mid 5n$, and since $\gcd(5,12) = 1$ this forces $12 \mid n$.

From $\angle BOC = \frac{2\pi}{5}$, similarly $b = \frac{n}{5}$ must be an integer, so $5 \mid n$.

Therefore $n$ is a multiple of $\operatorname{lcm}(12, 5) = 60$, and $60$ is the largest value of $k$ that is forced (nothing here compels $n$ to be a multiple of $120$ or $240$: $n = 60$ itself is consistent with both conditions).

The answer is C.
