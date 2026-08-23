---
database: TMUA
qid: 20132101212110
id: BeyondHorizonS2-Mock-P1-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: [待补答案, 原卷缺陷]
status: 已入库
---

## 题目
Given that
$$\left(a^3 + \frac{3}{b^3}\right)\left(\frac{3}{a^3} - b^3\right) = 8$$
where $a$ and $b$ are real numbers, what is the least value of $ab$?
$$\mathbf{A} \quad -\sqrt{3}$$
$$\mathbf{B} \quad \sqrt{3}$$
$$\mathbf{C} \quad -2\sqrt{3}$$
$$\mathbf{D} \quad 2\sqrt{3}$$
$$\mathbf{E} \quad -9^{\frac{1}{3}}$$
$$\mathbf{F} \quad -9^{\frac{1}{3}}$$
$$\mathbf{G} \quad 1$$
$$\mathbf{H} \quad -1$$

## 备注

### 我的备注

F改成9^{\frac{1}{3}

### AI备注

- **原卷缺陷（第二轮复核后改判）：重复的那两项正好就是正确答案，本题有两个正确选项。**
  (E) 与 (F) 内容完全相同，都是 $-9^{1/3}$；而正确值**恰好就是** $-9^{1/3}$
  （令 $t=(ab)^{3}$，由题意 $t^{2}+8t-9=0$ 得 $t=-9$ 或 $1$，取最小值支）。
  于是 E 与 F **同时成立**，学生选 F 会被判错。
  首轮曾按「内容重复但答案取首现、题仍可用」归为轻度瑕疵，
  第二轮独立复核指出重复项即答案，故改判为坏题。
  分类口径已相应细化：**重复的两项中若有一项正是答案，即归入「有多个正确答案」一类。**

## 答案
E

## 解析
Expand the product; the two constant cross terms cancel:
$$a^3 \cdot \frac{3}{a^3} - a^3b^3 + \frac{9}{a^3b^3} - \frac{3b^3}{b^3} = 3 - a^3b^3 + \frac{9}{a^3b^3} - 3 = \frac{9}{t} - t,$$
where $t = a^3b^3 = (ab)^3$. The condition becomes $\frac{9}{t} - t = 8$, i.e. $t^2 + 8t - 9 = 0$, so $(t + 9)(t - 1) = 0$ and $t = 1$ or $t = -9$. Taking real cube roots, $ab = 1$ or $ab = -\sqrt[3]{9} = -9^{1/3} \approx -2.08$, and both are attainable with real $a$ and $b$: take $a = 2$, $b = \frac{1}{2}$ for the first and $a = 2$, $b = -\frac{9^{1/3}}{2}$ for the second. The least value is $-9^{1/3}$. The answer is E. Note that options E and F are printed identically in the original paper, so the key is ambiguous between those two letters; E is recorded as the first occurrence.
