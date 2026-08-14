---
database: TMUA
qid: 20132101209212
id: JZMaths_SetE-Mock-P2-Q12
paper: TMUA Mock
year:
number: Q12
section: Multiple Choice
difficulty: 7
topics: [Logic and Proof]
subtopics: [Logic]
tags: [Logic-Deduction, Logic-Sufficiency, Logic-Equivalence]
status: 已入库
---

## 题目
Let $f$ be a function. Each of the following is a statement about all real numbers $a$ (for instance, the first reads: for every $a$, if $f(x) > 0$ for all $x > a$, then $f(a) < 0$). **Exactly one** of them is true. Which one is it?
$$ \mathbf{A} \quad f(x) > 0 \text{ for all } x > a \text{ only if } f(a) < 0 $$
$$ \mathbf{B} \quad f(a) < 0 \text{ and } f(x) > 0 \text{ for all } x > a \text{ cannot both hold} $$
$$ \mathbf{C} \quad f(x) > 0 \text{ for all } x > a \text{ is necessary for } f(a) < 0 $$
$$ \mathbf{D} \quad \text{if } f(a) \ge 0 \text{ then } f(x) \le 0 \text{ for some } x > a $$
$$ \mathbf{E} \quad f(x) > 0 \text{ for all } x > a \text{ implies } f(a) \ge 0 $$
$$ \mathbf{F} \quad f(a) \ge 0 \text{ if and only if } f(x) \le 0 \text{ for some } x > a $$
$$ \mathbf{G} \quad f(a) < 0 \text{ is sufficient for there to exist } x > a \text{ with } f(x) \le 0 $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Write $P$ for "$f(x) > 0$ for all $x > a$" and $Q$ for "$f(a) < 0$". The statements become:

A. $P \Rightarrow Q$

B. $Q \Rightarrow \neg P$

C. $Q \Rightarrow P$

D. $\neg Q \Rightarrow \neg P$, the contrapositive of $P \Rightarrow Q$

E. $P \Rightarrow \neg Q$, the contrapositive of $Q \Rightarrow \neg P$

F. $\neg Q \Leftrightarrow \neg P$, which is equivalent to $P \Leftrightarrow Q$

G. $Q \Rightarrow \neg P$

Therefore, $P \Rightarrow Q$ appears twice, in A and D, while $Q \Rightarrow \neg P$ appears three times, in B, E and G.

Statement F implies $P \Rightarrow Q$, so F cannot be the only true statement.

This leaves only C, which is $Q \Rightarrow P$, given exactly one is true, must be C.
