---
database: TMUA
qid: 90020280400
id: SMT-Ch10-Q4
paper: SMT Skills Ch10
year:
number: Q4
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
$a, b$ and $c$ are real numbers.
Given that $a(b - c) = a(c - b)$, which of the following must be true?
I. $a = 0$
II. $a = 0$ or $b = c$
III. $b = c$
IV. $a = 0, b = 0$ and $c = 0$

$$\mathbf{A} \quad \text{none of them}$$

$$\mathbf{B} \quad \text{I only}$$

$$\mathbf{C} \quad \text{II only}$$

$$\mathbf{D} \quad \text{III only}$$

$$\mathbf{E} \quad \text{I and II only}$$

$$\mathbf{F} \quad \text{I and III only}$$

$$\mathbf{G} \quad \text{I and IV}$$

$$\mathbf{H} \quad \text{II and III only}$$

$$\mathbf{I} \quad \text{II and IV only}$$

$$\mathbf{J} \quad \text{III and IV only}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 10 章 Logic and proof 章末 TMUA style 第 4 题；解析为书后官方 worked solution。

## 答案
C

## 解析
Bring everything to one side. Since $c - b = -(b - c)$,

$$a(b - c) = a(c - b) \iff a(b - c) + a(b - c) = 0 \iff 2a(b - c) = 0 \iff a(b - c) = 0,$$

and a product of real numbers is zero exactly when one of the factors is zero, so $a = 0$ or $b = c$. That is statement II, and it must be true.

Statement I fails: $a = 1$, $b = c = 2$ satisfies the given equation with $a \ne 0$. Statement III fails: $a = 0$, $b = 1$, $c = 2$ satisfies it with $b \ne c$. Statement IV is stronger still than I and fails for the same reason.

The correct answer is (C).

Options E, F, G, H, I and J all include I or III, and the two counter-examples above kill every one of them; B is the mistake of dividing by $b - c$ without checking that it is non-zero, and D is the mistake of dividing by $a$.
