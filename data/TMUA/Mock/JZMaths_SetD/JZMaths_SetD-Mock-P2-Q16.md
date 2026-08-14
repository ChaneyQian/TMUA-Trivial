---
database: TMUA
qid: 20132101208216
id: JZMaths_SetD-Mock-P2-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 8
topics: [Logic and Proof]
subtopics: [Logic]
tags: [Logic-Deduction]
status: 已入库
---

## 题目
You are an assistant at JZ Maths, tasked with helping to set a TMUA-style multiple-choice question.

The question contains five statements, labelled (1), (2), (3), (4), (5), and the student must determine exactly which statements are true. You, as the question setter, know that exactly two of the five statements are true, but this information will not be given to the student.

Each answer option is a possible set of true statements. For example, the option $\{1, 2, 5\}$ means that statements (1), (2), (5) only are true, while the option $\{\}$ means that none of the statements are true.

Under Policy 1 of JZ Maths, the question must be made **as difficult as possible**: even a competent student who can correctly check every statement must determine the truth value of all five statements in order to guarantee identifying the correct option. In particular, checking any four statements must not be sufficient to determine the correct option.

Under Policy 2 of JZ Maths, the question must contain **as few answer options** as possible, so that it **appears easier** than it really is.

How many answer options should you set in order to comply with both policies? Failure to comply will result in your immediate dismissal.

**Disclaimer.** Unrelated to this question, please be aware that no such policies officially exist at JZ Maths of course! There may be a good reason for this, as you will learn later.

$$ \mathbf{A} \quad 4 $$
$$ \mathbf{B} \quad 5 $$
$$ \mathbf{C} \quad 6 $$
$$ \mathbf{D} \quad 7 $$
$$ \mathbf{E} \quad 8 $$
$$ \mathbf{F} \quad 9 $$
$$ \mathbf{G} \quad 10 $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Suppose, without loss of generality, that the two true statements are (1) and (2), so the correct option is $\{1, 2\}$.

If the student checks statements (2), (3), (4), (5) but not (1), there must still be another possible option which agrees on those four statements. The only such option is $\{2\}$.

Similarly, omitting the check of statement (2) requires the option $\{1\}$. Omitting statement (3) requires $\{1, 2, 3\}$, and likewise statements (4) and (5) require $\{1, 2, 4\}$ and $\{1, 2, 5\}$.

Thus the options must include

$$ \{1, 2\}, \quad \{2\}, \quad \{1\}, \quad \{1, 2, 3\}, \quad \{1, 2, 4\}, \quad \{1, 2, 5\}. $$

These six options are all distinct, and they ensure that checking any four statements is insufficient. Therefore, you should set 6 answer options.

**Remark 1:** The question has now passed quality control: minimal appearance, maximal inconvenience.

**Remark 2:** As it turns out, minimising the options may not be such a good idea after all. See the next Paper 2!
