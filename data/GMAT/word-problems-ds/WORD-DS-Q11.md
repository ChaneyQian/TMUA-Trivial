---
database: GMAT
qid: 90020741100
id: WORD-DS-Q11
paper: GMAT Word Problems DS Diagnostic
year: 0
number: Q11
section: Data Sufficiency
band: HARD
level: LEVEL 6
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
A poll conducted on the Wembley Stadium revealed that $\frac{1}{6}$ of Messi fans are also fans of Mbappe, $\frac{2}{5}$ of Mbappe fans are also fans of De Bruyne, and $\frac{3}{4}$ of De Bruyne fans are also fans of Ronaldo. What is the probability that a random Messi fan on the stadium, is also a fan of Ronaldo ?

(1) There is not a single Mbappe fan who is also not a fan of Messi.
(2) For every Messi fan, who is also a fan of Mbappe, there are 5 Messi fans, who are also fans of De Bruyne.

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
E

## 解析
**Official Solution:**

The question may seem convoluted at first, and it’s tempting to assign variables. However, simple reasoning and logic work better for this question. We are essentially asked to find the fraction of Messi fans who are also Ronaldo fans.

We’re told:

• $\frac{1}{6}$ of Messi fans are also fans of Mbappe

• $\frac{2}{5}$ of Mbappe fans are also fans of De Bruyne

• $\frac{3}{4}$ of De Bruyne fans are also fans of Ronaldo

Notice that Messi fans and Ronaldo fans are not directly linked. We know that $\frac{3}{4}$ of De Bruyne fans are also fans of Ronaldo; however, we know nothing about those Ronaldo fans who are not fans of De Bruyne, and more importantly, we know nothing about how Ronaldo fans and Messi fans overlap.

(1)

This implies that the Mbappe fans group is entirely inside the Messi fan group. Still, it is not sufficient, because we cannot establish the link between Messi fans and Ronaldo fans.

(2)

This implies that the overlap between Messi and De Bruyne fans is 5 times the overlap between Messi and Mbappe fans. Still, it is not sufficient, since we cannot establish the link between Messi fans and Ronaldo fans.

(1) + (2) Let's assume there are 30 Messi fans. From (1), we get that there are 5 Mbappe fans, all of whom are Messi fans. From (2), we get that there are 25 Messi fans who are also De Bruyne fans. Since $\frac{2}{5}$ of Mbappe fans are also fans of De Bruyne, the 5 and 25 groups have an overlap of 2 fans inside the Messi group. So, we have:

![Fan-group overlap diagram](Image/word-ds-q11.png)

However, we still do not know how large the De Bruyne fan group outside the Messi group is, how large the Ronaldo fan group outside the De Bruyne group is, and most importantly, how Messi fans and Ronaldo fans overlap. Not sufficient.

Answer: E
