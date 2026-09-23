---
database: TMUA
qid: 90020280500
id: SMT-Ch10-Q5
paper: SMT Skills Ch10
year:
number: Q5
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
style: TMUA
solution_source: 书后解答
status: 已入库
---

## 题目
Consider the following statement about integers $p, q$ and $r$.
$$ \frac{p}{q} = r \quad (*) $$
The condition ‘$q$ and $r$ are factors of $p$’ is

$$\mathbf{A} \quad \text{necessary but not sufficient for (*).}$$

$$\mathbf{B} \quad \text{sufficient but not necessary for (*).}$$

$$\mathbf{C} \quad \text{necessary and sufficient for (*).}$$

$$\mathbf{D} \quad \text{not necessary and not sufficient for (*).}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 10 章 Logic and proof 章末 TMUA style 第 5 题；解析为书后官方 worked solution。

## 答案
A

## 解析
Convention: '$d$ is a factor of $p$' means that $p = dk$ for some integer $k$, the standard definition. Note also that the statement $(*)$ silently requires $q \ne 0$, since $\frac{p}{q}$ has to be defined.

**The condition is necessary.** If $\frac{p}{q} = r$ then $p = qr$. Reading that as $p = q \times r$ shows $q$ is a factor of $p$, and reading it as $p = r \times q$ shows $r$ is a factor of $p$. So whenever $(*)$ holds, so does the condition.

**The condition is not sufficient.** Take $p = 12$, $q = 2$, $r = 3$. Both $2$ and $3$ are factors of $12$, so the condition holds, but

$$\frac{p}{q} = \frac{12}{2} = 6 \neq 3 = r,$$

so $(*)$ fails. The condition says nothing about the two factors being *complementary*, and any $p$ with more than two divisors supplies counter-examples of this kind.

The correct answer is (A).

The wording admits a second reading, in which '$q$ and $r$ are factors of $p$' is taken to mean that $p$ factorises *as* $q \times r$. The answer is the same under that reading: it is
still necessary, because $(*)$ gives $p = qr$; and it is still not sufficient, because $p = 0$, $q = 0$, $r = 5$ satisfies $p = qr$ while $\frac{p}{q}$ is undefined.

> ⚠️ **与书末 Answers 附录不一致** —— 附录 p35 给 B（充分不必要），本解得 A（必要不充分），且附录的两半都不成立。
> 充分性反例：$p = 12$、$q = 2$、$r = 3$，$2$ 与 $3$ 都是 $12$ 的因数，但 $\frac{12}{2} = 6 \neq 3$，故条件不充分。
> 必要性：由 $\frac{p}{q} = r$ 得 $p = qr$，于是 $q \mid p$ 且 $r \mid p$，无例外。在 $-12 \le p, q, r \le 12$ 上穷举（$q \neq 0$）：必要性反例 $0$ 个，充分性反例 $1420$ 个。
> 附录恰好把 “必要” 与 “充分” 说反了，这正是本章 Necessary and sufficient 一节警告的那种混淆。
