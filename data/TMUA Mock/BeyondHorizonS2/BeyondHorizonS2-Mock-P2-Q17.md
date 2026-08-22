---
database: TMUA
qid: 20132101212217
id: BeyondHorizonS2-Mock-P2-Q17
paper: TMUA Mock
year:
number: Q17
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: [待补答案, 原卷缺陷]
status: 已入库
---

## 题目
Using 4 fours and just $+, -, *, /$ operations, in how many ways can the number 16 be generated?
E.g. 12 can be generated like this: $12 = 4 * (4 - 4/4)$
E.g. 8 can be generated like this: $8 = 4 + 4 - 4 + 4$
Note: the order of operations does matter, so $12 = 4 * (4 - 4/4)$ and $12 = (4 - 4/4) * 4$ are counted as 2 distinct generations.
$$\mathbf{A} \quad 4$$
$$\mathbf{B} \quad 5$$
$$\mathbf{C} \quad 8$$
$$\mathbf{D} \quad 10$$
$$\mathbf{E} \quad 13$$
$$\mathbf{F} \quad 19$$
$$\mathbf{G} \quad 25$$
TODO(待校对): 穷举计算得到的答案是 20，不在任何选项中；F（19）只是数值上最接近。疑为原卷答案键有误或计数口径未说清，需统筹者裁定。

## 备注

### 我的备注

### AI备注

- **原卷缺陷：按题目自定的计数口径穷举出的值不在选项内。**
  按题面规定（$4*(4-4/4)$ 与 $(4-4/4)*4$ 记为两种）穷举得 **20** 种，
  而选项集合是 $\{4,5,8,10,13,19,25\}$，无 20。
  另试三种口径均不命中：全括号表达式 36、模交换律 18、模交换+结合律 16。
  `ANSWER` 记 F（19，数值最近），**不是正确答案**。解析里已列出全部 20 个表达式便于对拍。


## 答案
F

## 解析
There are five ways to bracket four operands and four choices for each of the three operators, giving $5 \times 4^3 = 320$ candidate expressions. Discarding those that divide by zero and evaluating the remainder exactly as fractions, $36$ of the fully bracketed expressions equal $16$. Collapsing each of those to the string one would actually write down under ordinary precedence rules, which is the convention the question fixes when it counts $4 * (4 - 4/4)$ and $(4 - 4/4) * 4$ as two generations, leaves $20$ distinct generations, namely $4+4+4+4$, $4*4+4-4$, $4*4-4+4$, $4+4*4-4$, $4-4+4*4$, $4*4-(4-4)$, $4-(4-4*4)$, $(4+4-4)*4$, $(4-4+4)*4$, $(4-(4-4))*4$, $4*(4+4-4)$, $4*(4-4+4)$, $4*(4-(4-4))$, $4*4*4/4$, $4*4/4*4$, $4/4*4*4$, $4*4/(4/4)$, $4/(4/4)*4$, $4/(4/4/4)$ and $4/(4/(4*4))$. The count $20$ matches none of the seven printed options; the nearest is F at $19$, so F is recorded only provisionally and this item is flagged as defective.
