---
database: TMUA
qid: 20132101213219
id: BeyondHorizonS3-Mock-P2-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: [待补答案, 原卷缺陷]
status: 已入库
---

## 题目
If $a$ and $b$ are positive numbers and $c$ and $d$ are real numbers, positive or negative, then $a^c \leq b^d$
$$\mathbf{A} \quad \text{if } a \leq b \text{ and } c \leq d$$
$$\mathbf{B} \quad \text{if either } a \leq b \text{ or } c \leq d$$
$$\mathbf{C} \quad \text{if } a \geq 1,\, b \geq 1,\, d \geq c$$
$$\mathbf{D} \quad \text{if } a \leq 2,\, b \leq 2,\, d \geq 2$$
$$\mathbf{E} \quad \text{if } a \leq 0,\, b \leq 1,\, d \leq c$$
$$\mathbf{F} \quad \text{is not implied by any of the above conditions}$$

## 备注

### 我的备注

### AI备注

- **原卷缺陷：选项 (E) 的前件与题干前提直接冲突，导致 E 与 F 同时成立。**
  题干设「$a$ and $b$ are positive numbers」，而 (E) 的条件写的是 $a \leq 0$。
  该前件**永不成立**，故在标准数理逻辑下「若 (E) 则 $a^{c} \leq b^{d}$」是**空真**，
  即 E 技术上正确；而 (F)「is not implied by any of the above conditions」
  因 E 成立而为假。
  另一方面，出题人显然是想让 F 当答案（A–D 均有明确反例），
  (E) 里的 $a \leq 0$ 极可能是排印错误。
  两轮独立解题分别给出 E 与 F。`ANSWER` 记 E（严格逻辑下可辩护的那个），但不构成定论。

## 答案
E

## 解析
Each option asserts an implication of the form "condition $\implies a^c \leq b^d$", so to reject an option it is enough to find numbers meeting the condition for which the conclusion fails.

Option A fails with $a = b = \tfrac{1}{2}$, $c = 1$, $d = 2$: here $a \leq b$ and $c \leq d$, yet $a^c = \tfrac{1}{2}$ and $b^d = \tfrac{1}{4}$, so $a^c > b^d$. Option B is weaker than A, so the same example kills it. Option C fails with $a = 4$, $b = 1$, $c = 1$, $d = 2$: then $a \geq 1$, $b \geq 1$, $d \geq c$, but $a^c = 4 > 1 = b^d$. Option D fails with $a = 2$, $b = 1$, $c = 1$, $d = 2$: then $a \leq 2$, $b \leq 2$, $d \geq 2$, but $a^c = 2 > 1 = b^d$.

Option E is different in kind. Its condition requires $a \leq 0$, but the question states that $a$ is positive, so the condition can never be met. An implication whose hypothesis is never satisfied is vacuously true: there is no case in which the condition holds and $a^c \leq b^d$ fails. Hence E states a true implication, and consequently F, which claims that none of the conditions implies the conclusion, is false. The answer is E.
