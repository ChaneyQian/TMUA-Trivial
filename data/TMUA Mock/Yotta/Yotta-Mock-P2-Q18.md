---
database: TMUA
qid: 20132101203218
id: Yotta-Mock-P2-Q18
paper: TMUA Mock
year:
number: Q18
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
All 720 permutations of the word "NUMBER" are generated, and arranged in alphabetical order. In what position is the word "NUMBER"

$$
\mathbf{A} \quad \text{383rd}
$$

$$
\mathbf{B} \quad \text{385th}
$$

$$
\mathbf{C} \quad \text{468th}
$$

$$
\mathbf{D} \quad \text{469th}
$$

$$
\mathbf{E} \quad \text{487th}
$$

$$
\mathbf{F} \quad \text{490th}
$$

$$
\mathbf{G} \quad \text{618th}
$$

$$
\mathbf{H} \quad \text{622nd}
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
In alphabetical order the six letters are $B, E, M, N, R, U$. Count the words that come strictly before NUMBER.

Any word beginning with $B$, $E$ or $M$ precedes it: that is $3 \times 5! = 360$ words.

Among words starting with $N$, the remaining letters are $\{B, E, M, R, U\}$, and the second letter of our word is $U$ — the last of those alphabetically. So all four choices $B, E, M, R$ for the second letter come first: $4 \times 4! = 96$ words.

Among words starting with NU, the remaining letters are $\{B, E, M, R\}$ and our third letter is $M$, preceded by $B$ and $E$: $2 \times 3! = 12$ words.

After NUM the remaining letters are $\{B, E, R\}$ and our word continues $B$, $E$, $R$ — the alphabetical order — so nothing further precedes it.

That gives $360 + 96 + 12 = 468$ words before NUMBER, which is therefore the $469$th.

The answer is D.
