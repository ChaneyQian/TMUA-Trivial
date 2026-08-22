---
database: TMUA
qid: 20132101212207
id: BeyondHorizonS2-Mock-P2-Q7
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
Given any five points in the square $I^2 = \{(x, y) : 0 \leq x \leq 1, 0 \leq y \leq 1\}$, only one of the following statements is true. Which one is it?
$$\mathbf{A} \quad \text{The five points lie on a circle.}$$
$$\mathbf{B} \quad \text{At least one square can be formed using four of the five points.}$$
$$\mathbf{C} \quad \text{At least three of the five points are collinear.}$$
$$\mathbf{D} \quad \text{There are at least two points such that the distance between them does not exceed } \frac{1}{\sqrt{2}}.$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Cut the unit square into four closed sub-squares of side $\frac{1}{2}$. With five points and four sub-squares the pigeonhole principle forces two of the points into the same sub-square, and the greatest distance between two points of a square of side $\frac{1}{2}$ is its diagonal $\frac{\sqrt{2}}{2} = \frac{1}{\sqrt{2}}$. Hence two of the five points are at distance at most $\frac{1}{\sqrt{2}}$, and this holds for every configuration. The other three statements are defeated by explicit configurations: five points in general position, for instance slightly perturbed off a grid, lie on no common circle, form no square and contain no three collinear points. The answer is D.
