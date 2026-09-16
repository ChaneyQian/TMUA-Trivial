---
database: TMUA
qid: 90010211600
id: Spec-P1-Q16
paper: TMUA P1
year:
number: Q16
section: Applications
difficulty: 0
topics: []
subtopics: []
tags:
  - Specimen
status: 已入库
---

## 题目
Given that $c$ and $d$ are non-zero integers, the expression $\dfrac{10^{c - 2d} \times 20^{2c + d}}{8^c \times 125^{c + d}}$ is an integer if

$$
\mathbf {A} \quad c < 0
$$

$$
\mathbf {B} \quad d < 0
$$

$$
\mathbf {C} \quad c < 0 \text{ and } d < 0
$$

$$
\mathbf {D} \quad c < 0 \text{ and } d > 0
$$

$$
\mathbf {E} \quad c > 0 \text{ and } d < 0
$$

$$
\mathbf {F} \quad c > 0 \text{ and } d > 0
$$

$$
\mathbf {G} \quad d > 0
$$

$$
\mathbf {H} \quad c > 0
$$
## 备注

### 我的备注

### AI备注


⚠️ 2026-08-15 解析转写修正：末句「an integer if d < 0.)」的收尾被 OCR 成乱码，已按 官方 Specimen Paper 1 Solutions（Version 1.1, Nov 2020） p18 改回。另：对齐块第三行 2^{5c)} 的多余反括号原册即如此，属原册错误，未改。
## 答案
E

## 解析
We begin by simplifying this expression; we write each term as a product of prime powers to obtain:

$$
\begin{array}{r l} \frac {1 0 ^ {c - 2 d} \times 2 0 ^ {2 c + d}}{8 ^ {c} \times 1 2 5 ^ {c + d}} & = \frac {(2 \times 5) ^ {c - 2 d} \times (2 ^ {2} \times 5) ^ {2 c + d}}{(2 ^ {3}) ^ {c} \times (5 ^ {3}) ^ {c + d}} \\ & = \frac {2 ^ {c - 2 d + 2 (2 c + d)} \times 5 ^ {c - 2 d + (2 c + d)}}{2 ^ {3 c} \times 5 ^ {3 (c + d)}} \\ & = \frac {2 ^ {5 c)} \times 5 ^ {3 c - d}}{2 ^ {3 c} \times 5 ^ {3 c + 3 d}} \\ & = 2 ^ {2 c} \times 5 ^ {- 4 d} \end{array}
$$

For this to be an integer, we require 2c and −4d to be non-negative integers. Since $c$ and $d$ are non-zero integers, we need $c > 0$ and $d < 0$ , which is option E.

(In fact, this is an “if and only if” condition; options C, D and F would make the expression non-integer, as would A and $\mathrm { G }$; while conditions $B$ and $H$ are necessary, they are not sufficient: if $d < 0$ , it is still possible that $c < 0$ , so it is not true that the given expression is (necessarily) an integer if $d < 0$.)
