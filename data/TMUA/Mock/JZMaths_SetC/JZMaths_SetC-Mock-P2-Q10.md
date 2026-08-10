---
database: TMUA
qid: 20132101207210
id: JZMaths_SetC-Mock-P2-Q10
paper: TMUA Mock
year:
number: Q10
section: Multiple Choice
difficulty: 7
topics: [Logic and Proof]
subtopics: [Logic]
tags: [Logic Deduction]
status: 已入库
---

## 题目
In a TMUA-style question, students are asked to determine which, if any, of the five statements $1, 2, 3, 4, 5$ are true. They must then identify the correct option from the list provided in the question.

Assume that a **competent student** can always correctly determine the truth value of any statement they choose to check.

A teacher is designing such a question and wants to choose the option set that **maximises the smallest number of checks** a lucky student might need to determine the correct option. Equivalently, the teacher wants to maximise the fewest checks after which it is **possible** for the student to know the correct option.

Which of the following four candidate option sets best achieves the teacher's aim?

**Option Set I**

A: only statement 1 is true
B: only statements $1, 2, 3$ are true
C: only statements $1, 2, 4$ are true
D: only statements $1, 4, 5$ are true
E: only statements $1, 5$ are true

**Option Set II**

A: only statement 1 is true
B: only statement 2 is true
C: only statement 3 is true
D: only statement 4 is true
E: only statement 5 is true

**Option Set III**

A: only statements $1, 2$ are true
B: only statements $2, 3$ are true
C: only statements $3, 4$ are true
D: only statements $4, 5$ are true
E: no statements are true

**Option Set IV**

A: only statements $1, 2$ are true
B: only statements $2, 3$ are true
C: only statements $3, 4$ are true
D: only statements $4, 5$ are true
E: only statements $1, 5$ are true

$$ \mathbf{A} \quad \text{Option Set I} $$
$$ \mathbf{B} \quad \text{Option Set II} $$
$$ \mathbf{C} \quad \text{Option Set III} $$
$$ \mathbf{D} \quad \text{Option Set IV} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
For each option set, we look for the smallest number of statement checks that could identify an option in the luckiest case.

If one statement check can uniquely identify an option, then the smallest possible number of checks for that option set is 1.

For **Option Set I**, statement 3 is true only in option B. So if a student checks statement 3 and finds it true, they immediately know the answer is B. Therefore the lucky minimum is 1.

For **Option Set II**, each option says exactly one different statement is true. So if the student checks the true statement, they immediately know the answer. Therefore the lucky minimum is 1.

For **Option Set III**, statement 1 is true only in option A, and statement 5 is true only in option D. So one lucky check is enough. Therefore the lucky minimum is 1.

For **Option Set IV**, each statement appears in exactly two options. For example, statement 1 is true in A and E, statement 2 is true in A and B, and so on. Therefore no single statement check can ever identify the correct option. Therefore the minimum number of checks is greater than 1, and this is our best choice!

It can be shown that the lucky minimum for Option Set IV is 2, though this detail is not required to deduce the answer to the question.

Thus the teacher should choose **Option Set IV**, since it maximises the smallest number of checks a lucky student might need.

**Remark:** Even setting TMUA choices can be a logical puzzle!
