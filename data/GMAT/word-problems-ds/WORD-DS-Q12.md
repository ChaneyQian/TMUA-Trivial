---
database: GMAT
qid: 90020741200
id: WORD-DS-Q12
paper: GMAT Word Problems DS Diagnostic
year: 0
number: Q12
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
In a survey of an Olympic team members, $\frac{1}{6}$th of them said they do not watch movies during their free time, of those, $\frac{3}{4}$th said they also do not play video games during their free time. Is the number of the Olympic team members who do not play video games equal to 90 ?

(1) 210 members of the Olympic team said that they watch movies and play video games during their free time
(2) 15 members of the Olympic team said that they play video games but do not watch movies during their free time

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
A

## 解析
**Official Solution:**

This is what we know from the stem:

![Olympic team survey matrix](Image/word-ds-q12-stem.png)

The question asks whether YELLOW box is 90.

(1)

Fill the matrix with the information provided in this statement:

![Survey matrix after statement 1](Image/word-ds-q12-statement-1.png)

So, the question asks whether $x - (210 + \frac{x}{24})$ is 90. Solving $x - (210 + \frac{x}{24})=90$ gives $x = \frac{7200}{23}$, which is not possible because $x$ represents the number of people and must be an integer. Therefore, the number of the Olympic team members who do not play video games cannot equal to 90. Sufficient.

(2)

Fill the matrix with the information provided in this statement:

![Survey matrix after statement 2](Image/word-ds-q12-statement-2.png)

From this statement we get that $\frac{x}{24} = 15$, which gives $x$ as 360. So, we get

![Completed survey matrix](Image/word-ds-q12-statement-2-result.png)

As you can see there is no way to tell whether the yellow box is 90 or not. Not sufficient.

Answer: A
