---
database: TMUA
qid: 20132101205206
id: JZMaths_SetA-Mock-P2-Q6
paper: TMUA Mock
year:
number: Q6
section: Multiple Choice
difficulty: 6.5
topics: []
subtopics: []
tags: [Logic Deduction]
status: 已入库
---

## 题目
Of the 200 books in a school library: 140 are hardback and 60 are paperback. 70 are illustrated and 130 are not illustrated. 170 are written in English and 30 are not written in English.

What is the smallest number of books that could be hardback, not illustrated, and written in English?

$$ \mathbf{A} \quad 10 $$
$$ \mathbf{B} \quad 20 $$
$$ \mathbf{C} \quad 30 $$
$$ \mathbf{D} \quad 40 $$
$$ \mathbf{E} \quad 50 $$
$$ \mathbf{F} \quad 60 $$
$$ \mathbf{G} \quad 70 $$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Let $H$ be the set of hardback books, $N$ be the set of not illustrated books, and $E$ be the set of books written in English.

We want the smallest possible value of
$$ |H \cap N \cap E|. $$

Instead, consider the books that do not belong to this group. A book is not in $H \cap N \cap E$ if it is paperback, illustrated, or not written in English.

There are 60 paperback books, 70 illustrated books, and 30 books not written in English. Therefore, the maximum possible number of books outside the group is
$$ 60 + 70 + 30 = 160. $$

Note that this maximum is only attainable if these three groups of books have no overlaps; for example, there must be no book which is both paperback and illustrated.

So the minimum possible number of books inside the group is

$$ 200 - 160 = 40. $$

Once more, this is possible, for example, if the paperback books, illustrated books, and non-English books are all separate groups.

Therefore the smallest possible number of books that are hardback, not illustrated, and written in English is $40$.

**Alternative set algebra method:**

We want the smallest possible value of

$$ |H \cap N \cap E|. $$

The complement is

$$ (H \cap N \cap E)^c = H^c \cup N^c \cup E^c. $$

Now

$$ |H^c| = 60, \qquad |N^c| = 70, \qquad |E^c| = 30. $$

So by the union bound,

$$ |H^c \cup N^c \cup E^c| \le 60 + 70 + 30 = 160. $$

Since $|\Omega| = 200$,

$$ 200 - |H \cap N \cap E| \le 160. $$

Therefore

$$ |H \cap N \cap E| \ge 40. $$

So the smallest possible number for $|H \cap N \cap E|$ is $40$.
