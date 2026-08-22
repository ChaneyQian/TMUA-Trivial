---
database: TMUA
qid: 20132101212203
id: BeyondHorizonS2-Mock-P2-Q3
paper: TMUA Mock
year:
number: Q3
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A television station telecasts three types of programs $X$, $Y$, and $Z$. A survey gives the following data on television viewing. Among the people interviewed 60% watch program $X$, 50% watch program $Y$, 50% watch program $Z$, 30% watch programs $X$ and $Y$, 20% watch programs $Y$ and $Z$, 30% watch programs $X$ and $Z$, while 10% do not watch any television program. The percentage of people watching all the three programs $X$, $Y$, and $Z$ is
$$\mathbf{A} \quad 90$$
$$\mathbf{B} \quad 50$$
$$\mathbf{C} \quad 10$$
$$\mathbf{D} \quad 20$$
$$\mathbf{E} \quad 30$$
$$\mathbf{F} \quad 40$$
TODO(待校对): 原卷此题最后三个选项的字母全部印成 (D)，即 (A)(B)(C)(D)(D)(D)；此处按顺序重标为 D/E/F，选项内容 20/30/40 未改动。

## 备注

### 我的备注

### AI备注

- **原卷选项字母重号：末三项都印成 (D)。**
  原卷第 4 页实际印的是 `(A) 90  (B) 50  (C) 10  (D) 20  (D) 30  (D) 40`。
  入库时顺次重标为 D/E/F，**选项内容 20/30/40 一字未改**，否则字母不连续、题目在前端失效。
  答案不受影响：容斥得 $60+50+50-30-20-30+t = 90 \implies t = 10$，即选项 C。


## 答案
C

## 解析
Since 10% watch nothing, the union satisfies $|X \cup Y \cup Z| = 90$. Writing $t$ for the percentage watching all three and applying inclusion-exclusion,
$$90 = 60 + 50 + 50 - 30 - 20 - 30 + t = 80 + t,$$
so $t = 10$. The answer is C.
