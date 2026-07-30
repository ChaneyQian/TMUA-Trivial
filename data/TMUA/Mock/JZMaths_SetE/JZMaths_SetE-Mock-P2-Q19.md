---
database: TMUA
qid: 20132101209219
id: JZMaths_SetE-Mock-P2-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 8.5
topics: []
subtopics: []
tags: [Logic Deduction]
status: 已入库
---

## 题目
In a previous JZ Maths mock paper, candidates were introduced to the following two question-setting policies.

**Policy 1.** A multiple-choice question involving five statements must be made as difficult as possible: a student must determine the truth value of all five statements in order to guarantee identifying the correct option. In particular, checking any four statements must not be sufficient.

**Policy 2.** Subject to Policy 1, the question must contain as few answer options as possible, so that it appears easier than it really is.

The disclaimer accompanying that question claimed that no such policies officially existed.

Alan Turing, a student sitting the next JZ Maths mock paper, has secretly learnt that JZ Maths does, in fact, follow both policies religiously. JZ Maths is, of course, completely unaware of this serious breach of question-setting security!

Alan is presented with a question containing five statements, labelled (1), (2), (3), (4), (5). He does not know how many of the statements are true. The answer options are shown below, with each option specifying exactly which statements are true.

Without bothering to check the truth of any statement, Alan is able to identify the correct option.

Which option does he choose?
$$ \mathbf{A} \quad \text{Statements (1), (3), (5) only.} $$
$$ \mathbf{B} \quad \text{Statements (3), (5) only.} $$
$$ \mathbf{C} \quad \text{Statements (1), (2), (3), (5) only.} $$
$$ \mathbf{D} \quad \text{Statements (1), (5) only.} $$
$$ \mathbf{E} \quad \text{Statements (1), (3), (4), (5) only.} $$
$$ \mathbf{F} \quad \text{Statements (1), (3) only.} $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
By Policy 1, checking all statements except for statement $i$ must not be enough to deduce the correct option. Once four statements have been checked, there are only two possible truth patterns left, according to whether statement $i$ is true or false. Therefore, both possibilities must appear among the options.

The two options left must agree on all statements except statement $i$, as this is the only way that, after checking all statements except statement $i$, we are still unable to distinguish between the last two options.

Since this logic holds for every statement $i$, we can use it to check whether an option could be the correct option.

For example, suppose the correct option were $\{3, 5\}$.

Checking all but statement (1) should leave $\{3, 5\}$ and $\{1, 3, 5\}$ undetermined. Both are there, so this is consistent.

Checking all but statement (2) should leave $\{3, 5\}$ and $\{2, 3, 5\}$ undetermined. However, $\{2, 3, 5\}$ is not one of the options, so this is not consistent. Therefore, $\{3, 5\}$ is not the correct option.

Now, let us check whether $\{1, 3, 5\}$ is the correct option.

Checking all but statement (1) should leave $\{1, 3, 5\}$ and $\{3, 5\}$ undetermined. Both are there, so this is consistent.

Checking all but statement (2) should leave $\{1, 3, 5\}$ and $\{1, 2, 3, 5\}$ undetermined. Both are there, so this is consistent.

Checking all but statement (3) should leave $\{1, 3, 5\}$ and $\{1, 5\}$ undetermined. Both are there, so this is consistent.

Checking all but statement (4) should leave $\{1, 3, 5\}$ and $\{1, 3, 4, 5\}$ undetermined. Both are there, so this is consistent.

Checking all but statement (5) should leave $\{1, 3, 5\}$ and $\{1, 3\}$ undetermined. Both are there, so this is consistent.

This is consistent in all cases. Therefore, $\{1, 3, 5\}$ is the correct option, and Alan deftly selects the first option without checking any of the five statements, thereby defeating the purpose of both policies using only his knowledge of the policies themselves. The policies were designed to maximise the difficulty of the question, but ironically made the five statements completely irrelevant!

**Remark:** Policy 2 is actually redundant in this question. Whatever the correct truth pattern is, Policy 1 requires the correct option together with five further options, obtained by changing the truth value of exactly one of the five statements. These six options are always sufficient, regardless of how many of the statements are true, which is a fact that Alan, of course, had already deduced.

Therefore, Policy 1 requires at least six options, and six options are enough. Since Alan can see that the question contains exactly six options, Policy 2 gives him no additional information in this case.
