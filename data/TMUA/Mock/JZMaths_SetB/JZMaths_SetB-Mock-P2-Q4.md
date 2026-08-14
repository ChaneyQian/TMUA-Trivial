---
database: TMUA
qid: 20132101206204
id: JZMaths_SetB-Mock-P2-Q4
paper: TMUA Mock
year:
number: Q4
section: Multiple Choice
difficulty: 6
topics: [Trigonometry]
subtopics: [Trigonometric Identities, Trigonometry]
tags: [General-Trigonometry]
status: 已入库
---

## 题目
Find the exact value of
$$ \tan 1^\circ \tan 2^\circ \tan 3^\circ \cdots \tan 89^\circ . $$

You may find the identity $\sin(x) = \cos(90^\circ - x)$ useful.

**Remark:** This is a well-known question in mathematical circles, but it is still valuable for students to encounter.

$$ \mathbf{A} \quad 1 $$
$$ \mathbf{B} \quad 0 $$
$$ \mathbf{C} \quad \sqrt{3} $$
$$ \mathbf{D} \quad 89 $$
$$ \mathbf{E} \quad \frac{1}{2} $$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
There has to be some cancellations! Notice that:
$$ \tan k^\circ \cdot \tan(90 - k)^\circ = \frac{\sin k^\circ}{\cos k^\circ} \cdot \frac{\sin(90 - k)^\circ}{\cos(90 - k)^\circ} = \frac{\sin k^\circ}{\cos k^\circ} \cdot \frac{\cos k^\circ}{\sin k^\circ} = 1 $$

The factors pair up as $(1^\circ, 89^\circ), (2^\circ, 88^\circ), \dots, (44^\circ, 46^\circ)$, each pair giving $1$, and the middle factor is $\tan 45^\circ = 1$. The whole product is therefore $1$.

$\tan k^\circ \cdot \tan(90 - k)^\circ = 1$ is true in general, $k \neq 90 + 180n$.
