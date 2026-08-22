---
database: TMUA
qid: 20132101203219
id: Yotta-Mock-P2-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A *squarefree* integer is a positive integer which isn't divisible by the square of a prime. Which of these statements about squarefree integers is correct?
1. A squarefree integer with $n$ prime factors has $2^n$ factors.
2. The product of two squarefree integers is always squarefree
3. A squarefree integer cannot be a power of 36.

$$
\mathbf{A} \quad \text{None of them}
$$

$$
\mathbf{B} \quad \text{1 only}
$$

$$
\mathbf{C} \quad \text{2 only}
$$

$$
\mathbf{D} \quad \text{3 only}
$$

$$
\mathbf{E} \quad \text{1 and 2 only}
$$

$$
\mathbf{F} \quad \text{1 and 3 only}
$$

$$
\mathbf{G} \quad \text{2 and 3 only}
$$

$$
\mathbf{H} \quad \text{1, 2 and 3}
$$

## 备注

### 我的备注

### AI备注

- **语句 3 的真假取决于"幂"是否含 $0$ 次。**
  $36^{k}=2^{2k}3^{2k}$ 在 $k \geq 1$ 时必被 $4$ 整除，故非 squarefree；
  但 $36^{0}=1$ 是 squarefree 的。若把 $0$ 次方也算作"a power of 36"，
  语句 3 就有反例、答案会变成 B（1 only）。
  竞赛惯例中"a power of $n$"默认指正整数次幂，故本库按 F 收录。


## 答案
F

## 解析
**Statement 1** is true. A squarefree integer is a product of distinct primes $p_{1}p_{2}\cdots p_{n}$, each to the first power, so its number of factors is $(1+1)^{n} = 2^{n}$.

**Statement 2** is false. Both $2$ and $6$ are squarefree, but $2 \times 6 = 12 = 2^{2} \times 3$ is divisible by $4$. (Even simpler: $2 \times 2 = 4$.)

**Statement 3** is true. Any power $36^{k}$ with $k \geq 1$ equals $\left(2^{2}3^{2}\right)^{k} = 2^{2k}3^{2k}$, which is divisible by $4$ and so is not squarefree.

Statements 1 and 3 hold, so the answer is F.
