---
database: GMAT
qid: 90020741500
id: WORD-DS-Q15
paper: GMAT Word Problems DS Diagnostic
year: 0
number: Q15
section: Data Sufficiency
band: VERY HARD
level: LEVEL 8
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Two cyclists start moving simultaneously from opposite ends of a straight track towards each other back and forth. Cyclists' speeds are constant, but one is faster than the other. First time, the cyclists meet each other at a distance of $x$ meters from the nearest end of the track. Second time, on the way back, they meet $y$ meters from the other end of the track. What is the length of the track?

(1) $x = 720$ meters
(2) $y = 400$ meters

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
C

## 解析
**Official Solution:**

Check the image below:

![Cyclists' first and second meetings](Image/word-ds-q15.png)

By the time of their first meeting, the total distance the two cyclists have covered equals to the the length of the track (check top image: A and B together covered 1 full length of the track).

By the time of their second meeting, the total distance the two cyclists have covered equals to three times the length of the track (check the lower image: A and B together covered 3 full lengths of the track).

Since the speeds are constant, the second meeting (after covering 3 full lengths of the track) occurs after a total time that is thrice the time for the first meeting (after covering 1 full length of the track). So, if by the time of their first meeting, cyclist A covered $x$ meters, then by the time of their second meeting, cyclist A covered $3x$ meters (3 times the distance in 3 times the time).

Now, check the lower image again, the total distance A covered ($3x$ meters), is $y$ meters more than the length of the track, so the length of the track is $3x-y$ meters.

So, to get the length we only need to know the values of $x$ and $y$, while speeds are irrelevant.

(1)

Not sufficient.

(2)

Not sufficient.

(1)+(2) The length of the track is $3x-y=3*720-400=1760$ meters. Sufficient.

Answer: C
