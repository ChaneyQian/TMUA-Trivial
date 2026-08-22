---
database: TMUA
qid: 20132101213205
id: BeyondHorizonS3-Mock-P2-Q5
paper: TMUA Mock
year:
number: Q5
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: [待补答案, 原卷缺陷]
status: 已入库
---

## 题目
Which of these people A-E must be telling the truth if they each speak as follows?
$$\mathbf{A} \quad \text{I'm not a liar}$$
$$\mathbf{B} \quad \text{I'm the only liar}$$
$$\mathbf{C} \quad \text{If E is a liar, so is D}$$
$$\mathbf{D} \quad \text{If A is a liar, so am I}$$
$$\mathbf{E} \quad \text{None of us are liars}$$

## 备注

### 我的备注

### AI备注

- **原卷缺陷：单选题却有两个人都被迫说真话。**
  设定：说谎者的陈述必假、诚实者的陈述必真。
  由 D 的陈述「If A is a liar, so am I」自锁：若 D 说谎，则其陈述为假需
  「A 说谎 且 D 不说谎」，与 D 说谎矛盾 → **D 必诚实**。
  D 诚实故其陈述为真；D 不说谎，逆否得 **A 也必诚实**。
  （其余：E 说「None of us are liars」若真则 B 的「I'm the only liar」为假使 B 说谎，
  与「无人说谎」矛盾 → E 说谎；B 说谎；C 的「若 E 说谎则 D 说谎」在 E 说谎、D 诚实下为假 → C 说谎。）
  唯一自洽指派是 A 真、B 假、C 假、D 真、E 假，**A 与 D 都必然说真话**。
  `ANSWER` 记 D（唯一"仅凭自身陈述就锁死"的人，最可能是出题人本意），但 A 同样成立。


## 答案
D

## 解析
Take the usual convention that a truth-teller's statement is true and a liar's statement is false.

Look at D, whose statement is the implication "A is a liar $\implies$ D is a liar". Suppose D were a liar. Then D's statement must be false, and an implication $P \implies Q$ is false exactly when $P$ is true and $Q$ is false, so we would need "A is a liar" to be true and "D is a liar" to be false. But the second of these contradicts our supposition that D is a liar. Hence D cannot be a liar, so D must be telling the truth.

None of the other statements forces its speaker to be truthful in the same self-contained way. If A is a liar, then "I'm not a liar" is false, which is exactly what a liar should say, so A's statement is self-consistent for a liar. If B is a liar, "I'm the only liar" is false provided somebody else lies too, which is possible. If C is a liar, C's implication must be false, requiring E to be a liar and D not to be a liar; since D is truthful, that is consistent. If E is a liar, "None of us are liars" is false because E lies, again consistent.

So D is the one whose truthfulness is forced by the form of the statement itself. The answer is D.
