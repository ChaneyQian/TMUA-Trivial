---
database: TMUA
qid: 20132101234107
id: StepMaths-Mock-P1-Q7
paper: TMUA Mock
year:
number: Q7
section: MCQ
difficulty: 0
topics: [Probability]
subtopics: [Elementary Probability]
tags: [原卷缺陷, Layered-Cube, Sampling-Without-Replacement, Off-by-One, Limiting-Behaviour]
status: 待复核
---

## 题目
A white wooden cube is made of $n^3$ identical, smaller cubes, where $n$ is an even number. Each small cube on the surface of the large cube is numbered with a "$0$". The numbered cubes are then removed, and the small cubes on the new surface of the remaining cube are all numbered with "$1$". The process repeats, so that we have small cubes with numbers $0, 1, 2, 3, \ldots$ The wooden block is now dismantled into the $n^3$ constituent cubes and put into a bag. Small cubes are picked consecutively at random without replacement. As $n$ increases, which of the following is true of the probability that all the numbers from $0$ to $\frac{n}{2}$ inclusive have been picked before any number repeats itself?

![[Image/StepMaths-Mock-P1-Q7-fig1.png]]

$$ \mathbf{A} \quad \text{It increases towards} 1 $$
$$ \mathbf{B} \quad \text{It decreases towards} 0 $$
$$ \mathbf{C} \quad \text{It increases towards a limit less than} 1 $$
$$ \mathbf{D} \quad \text{It decreases towards a limit greater than} 0 $$
$$ \mathbf{E} \quad \text{It is constant} $$

## 备注

### 我的备注

### AI备注
来源：tmua.io 社区卷 `community__stepmaths__p1`，作者 **StepMaths**（站点标题：StepMaths Mock Paper 1）。
第三方录入的第三方模拟卷，**非官方真题，未经原卷核对**；站点不提供解析，`## 解析` 待补。
2026-09-25 代审：题面差一。n 为偶数时标号只到 n/2−1，照字面「0 到 n/2 全部取到」概率恒为 0，得 E（原卷答案）；若按本意改成「0 到 n/2−1」，概率随 n 严格递减趋于 0，得 B。答案栏保留原卷 E。

## 答案
E

## 解析
