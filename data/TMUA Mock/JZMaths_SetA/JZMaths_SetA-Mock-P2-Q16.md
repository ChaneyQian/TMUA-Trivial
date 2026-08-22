---
database: TMUA
qid: 20132101205216
id: JZMaths_SetA-Mock-P2-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 7.5
topics: [Logic and Proof]
subtopics: [Logic]
tags: [Logic-Deduction, Logic-Negation]
status: 已入库
---

## 题目
A safe has three levers, $A$, $B$ and $C$, each of which can be positioned either left or right at any particular time. The state of the safe (open or closed) depends only on the positions of these three levers. It is known that:

**If** lever $A$ is right and (lever $B$ is left or lever $C$ is right), **then** the safe is open.

Which one of the following statements **must** be true?

$$ \mathbf{A} \quad \text{If the safe is open, then lever } A \text{ is right and either lever } B \text{ is left or lever } C \text{ is right.} $$
$$ \mathbf{B} \quad \text{If the safe is closed, then lever } A \text{ is left, and either lever } B \text{ is right or lever } C \text{ is left.} $$
$$ \mathbf{C} \quad \text{If the safe is closed, then lever } A \text{ is left, lever } B \text{ is right and lever } C \text{ is left.} $$
$$ \mathbf{D} \quad \text{If the safe is closed, then either lever } A \text{ is left, or both lever } B \text{ is right and lever } C \text{ is left.} $$
$$ \mathbf{E} \quad \text{If lever } A \text{ is left, or both lever } B \text{ is right and lever } C \text{ is left, then the safe is closed.} $$
$$ \mathbf{F} \quad \text{If the safe is open, then either lever } A \text{ is left, or both lever } B \text{ is right and lever } C \text{ is left.} $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Let $P$ be the statement that lever $A$ is right and (lever $B$ is left or lever $C$ is right), and let $Q$ be the statement that the safe is open. The given information is exactly $P \Rightarrow Q$.

Its contrapositive is $\neg Q \Rightarrow \neg P$. Now

$$ \neg P \equiv \text{lever } A \text{ is left, or both lever } B \text{ is right and lever } C \text{ is left}. $$

Thus, if the safe is closed, either lever $A$ is left, or both lever $B$ is right and lever $C$ is left. This is option D.

The other options either assert the converse or inverse, or give a condition stronger than $\neg P$, so they need not follow from the information given.
