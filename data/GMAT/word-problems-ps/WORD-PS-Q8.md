---
database: GMAT
qid: 90020730800
id: WORD-PS-Q8
paper: GMAT Word Problems PS Diagnostic
year: 0
number: Q8
section: Problem Solving
band: MEDIUM
level: LEVEL 4
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Athos, Porthos, Aramis and D'Artagnan are dividing $n$ gold coins they received from the queen. Athos gets 25% of all the coins, then Porthos gets 25% of the remaining coins, then Aramis gets 25% of the remaining coins, then D'Artagnan gets 25% of the remaining coins. Still, there are some coins left, which they divide equally among four of them. If $n$ is the least number of coins the queen could have given them, then how many coins did D'Artagnan get ?

$$
\mathbf{A} \quad 81
$$

$$
\mathbf{B} \quad 189
$$

$$
\mathbf{C} \quad 324
$$

$$
\mathbf{D} \quad 405
$$

$$
\mathbf{E} \quad 1024
$$

## 备注

### 我的备注

### AI备注

## 答案
B

## 解析
**Official Solution:**

After each distribution, $\frac{3}{4}$th of the coins remain to be distributed to the next person. For instance:

Athos receives $\frac{1}{4}n$ coins, leaving $\frac{3}{4}n$ coins for distribution.

Then, Aramis receives $\frac{1}{4}$th of that remaining amount, leaving $\frac{3}{4}(\frac{3}{4}n)=(\frac{3}{4})^2n$ coins to distribute.

Next, Porthos receives $\frac{1}{4}$th of the remaining amount, leaving $\frac{3}{4}((\frac{3}{4})^2n)=(\frac{3}{4})^3n$ coins to distribute.

Subsequently, D'Artagnan receives $\frac{1}{4}$th of the remaining amount, which is $\frac{1}{4}(\frac{3}{4})^3n$ coins, leaving $\frac{3}{4}((\frac{3}{4})^3n)=(\frac{3}{4})^4n$ coins to distribute.

In the final distribution, D'Artagnan also receives $\frac{1}{4}$th of the remaining amount, an additional $\frac{1}{4}(\frac{3}{4})^4n$ coins, making his total receipt $\frac{1}{4}(\frac{3}{4})^3n + \frac{1}{4}(\frac{3}{4})^4n=(\frac{3^3}{4^4} + \frac{3^4}{4^5})n=\frac{189}{1,024}n$.

Given that $\frac{189}{1,024}n$ must be an integer, the minimum value of $n$ is 1,024. Therefore, the least number of coins D'Artagnan could have received is 189.

Answer: B
