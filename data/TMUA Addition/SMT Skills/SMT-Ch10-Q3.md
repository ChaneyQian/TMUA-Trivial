---
database: TMUA
qid: 90020280300
id: SMT-Ch10-Q3
paper: SMT Skills Ch10
year:
number: Q3
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
Five empty jars are labelled A to E. £2 is placed into one jar at random, £5 into another, £10 into a third, £20 into a fourth and £50 into the remaining jar. Clues to the amounts in some of the jars are written on signs that are attached to the jars. The signs read as follows:
Jar A: ‘Precisely one of the signs is not telling the truth and that jar contains £2.’
Jar B: ‘Jar C contains £10.’
Jar C: ‘This jar does not contain £50.’
Jar D: ‘Jar E contains £20.’
Jar E: ‘Jar A contains £5.’
Given that the statement on jar A is true, which jar contains £50?

$$\mathbf{A} \quad \text{Jar A}$$

$$\mathbf{B} \quad \text{Jar B}$$

$$\mathbf{C} \quad \text{Jar C}$$

$$\mathbf{D} \quad \text{Jar D}$$

$$\mathbf{E} \quad \text{Jar E}$$

## 备注

### 我的备注

### AI备注
- 来源：《STEP, MAT, TMUA: Skills for Success in University Admissions Tests for Mathematics》第 10 章 Logic and proof 章末 TMUA style 第 3 题；解析为书后官方 worked solution。
- 原书本题不列选项（答案即罐子字母 A–E）；下方 `Jar A`…`Jar E` 五项是入库时补的，非原书文字。

## 答案
E

## 解析
The sign on jar A says two things at once: exactly one of the five signs is false, and the jar carrying that false sign holds £2. Since A's sign is given to be true, the single false
sign is one of B, C, D, E, and that jar holds £2. Take the four cases in turn.

*B false.* Then B holds £2. C, D, E are then all true, so from D the jar E holds £20, and from E the jar A holds £5. That leaves £10 and £50 for C and D. But C's sign is true, so C does
not hold £50, and B's sign is false, so C does not hold £10 either. Contradiction.

*C false.* Then C holds £2. But C's sign reads 'this jar does not contain £50', and its being false means C holds £50. Contradiction.

*E false.* Then E holds £2. But D's sign is then true, so E holds £20. Contradiction.

*D false.* Then D holds £2. B's sign is true, so C holds £10, which is consistent with C's own true sign. E's sign is true, so A holds £5. D's sign is false, so E does not hold £20, and
the two amounts left for B and E are £20 and £50. Hence E holds £50 and B holds £20.

| Jar | A | B | C | D | E |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Amount | £5 | £20 | £10 | £2 | £50 |
| Sign | true | true | true | **false** | true |

Exactly one sign is false and that jar holds £2, so A's sign is satisfied and the arrangement is consistent. Running over all $120$ arrangements of the five amounts confirms that this is the only one.

The correct answer is (E).
