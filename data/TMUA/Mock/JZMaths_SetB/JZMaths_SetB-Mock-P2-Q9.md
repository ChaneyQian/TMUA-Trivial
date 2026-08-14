---
database: TMUA
qid: 20132101206209
id: JZMaths_SetB-Mock-P2-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 7
topics: [Algebra (Basic), Function]
subtopics: [Systems Of Linear Equations, Exponentials and Logarithms]
tags: [Exponentials-and-Logarithms, Linear-Equations]
status: 已入库
---

## 题目
Let $k$ be a real constant. Consider the simultaneous equations

$$ k \cdot 2^x + \log_2 y + \log_2 z = 3, $$
$$ 2^x + k \log_2 y + \log_2 z = 2, $$
$$ 2^x + \log_2 y + \log_2 z = k, $$

in real unknowns $x$, $y$ and $z$, subject to $y > 1$ and $z > 0$.

Which of the following is the **necessary and sufficient** condition on $k$ for the system to have a real-valued solution set $\{x, y, z\}$?

$$ \mathbf{A} \quad k > 1 $$
$$ \mathbf{B} \quad 1 < k < 2 $$
$$ \mathbf{C} \quad 1 < k < 3 $$
$$ \mathbf{D} \quad 2 < k < 3 $$
$$ \mathbf{E} \quad k < 2 \text{ and } k \neq 1 $$
$$ \mathbf{F} \quad k > 2 $$
$$ \mathbf{G} \quad k < 1 \text{ or } k > 2 $$
$$ \mathbf{H} \quad \text{All real } k \text{ except } k = 1 $$

## 备注

### 我的备注

### AI备注


## 答案
B

## 解析
Let $X = 2^x$, $Y = \log_2 y$, $Z = \log_2 z$. The constraints translate to $X > 0$, $Y > 0$ (since $y > 1$), and $Z \in \mathbb{R}$ (since $z > 0$). The system becomes

$$ kX + Y + Z = 3, \quad X + kY + Z = 2, \quad X + Y + Z = k. $$

Subtract the third equation from the first: $(k - 1)X = 3 - k$, so $X = \frac{3 - k}{k - 1}$ (requires $k \neq 1$).

Subtract the third from the second: $(k-1)Y=2-k$, so $Y=\frac{2-k}{k-1}$.

Then $Z=k-X-Y$ is automatically a real number.

**Positivity of $X$:**
$$
\frac{3-k}{k-1}>0
\quad\Leftrightarrow\quad
1<k<3.
$$

**Positivity of $Y$:**
$$
\frac{2-k}{k-1}>0
\quad\Leftrightarrow\quad
1<k<2.
$$

Both must be true, therefore: $1<k<2$.
