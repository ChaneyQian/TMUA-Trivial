---
database: GMAT
qid: 90020741300
id: WORD-DS-Q13
paper: GMAT Word Problems DS Diagnostic
year: 0
number: Q13
section: Data Sufficiency
band: VERY HARD
level: LEVEL 7
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A poll conducted among the members of a football fan club, revealed that 100 of them root for Portugal, 150 of them root for France, and 200 of them root for Argentina. Also, 120 of them root for exactly two of the three teams. How many members does the fan club have ?

(1) Equal number of members root for Portugal only and for Argentina only.
(2) For every 2 members of the club who root for none of the three teams, there is 1 member who roots for all three of the teams.

$$
\mathbf{A} \quad \text{Statement (1) ALONE is sufficient but statement (2) ALONE is not sufficient.}
$$

$$
\mathbf{B} \quad \text{Statement (2) ALONE is sufficient but statement (1) ALONE is not sufficient.}
$$

$$
\mathbf{C} \quad \text{BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient.}
$$

$$
\mathbf{D} \quad \text{EACH statement ALONE is sufficient.}
$$

$$
\mathbf{E} \quad \text{Statements (1) and (2) TOGETHER are not sufficient.}
$$

## 备注

### 我的备注

### AI备注

## 答案
B

## 解析
**Official Solution:**

Check the diagram below:

![Football fan club Venn diagram](Image/word-ds-q13.png)

Given:

(i) 100 people root for Portugal: $a + d + f + g = 100$;
(ii) 200 people  root for Argentina: $b + e + d + g = 200$.
(iii) 150 people  root for France: $c + e + f + g = 150$;

(iiii) 120 people root for exactly two of the three teams: $d + e + f = 150$.

The question asks to find $total = a + b + c + d + e + f + g + N = ?$

Sum (i), (ii), and (iii):

$(a + d + f + g) + (b + e + d + g) + (c + e + f + g) = 450$;

$a + b + c + 2(d + f+ e) + 3g = 450$.

Since given that $d + e + f = 150$ (iiii), then:

$a + b + c + 2*150+ 3g = 450.$;
$a + b + c = 150 - 3g$

Thus:

$total = (a + b + c) + (d + e + f) + g + N = (150 - 3g) + 150 + g + N = 300 -2g + N=?$

(1)

This means that a = b, which is not sufficient to get the value of total = 300 -2g + N.

(2)

This means that $N = 2g$. Thus, $total = 300 - 2g + N = 300 -2g + 2g = 300$. Sufficient.

Answer: B
