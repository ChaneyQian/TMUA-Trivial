---
database: MAT
qid: 90010310700
id: Spec2-Q7
paper: MAT Specimen 2
year: 2009
number: Q7
section: Long Question
audience: CS
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/1998/98-Q5.md
status: 已入库
---
## 题目
**For APPLICANTS IN COMPUTER SCIENCE ONLY.**

Suppose you have an unlimited supply of black and white pebbles. There are four ways in which you can put two of them in a row: $BB$, $BW$, $WB$ and $WW$.

**(i)** Write down the eight different ways in which you can put three pebbles in a row.

**(ii)** In how many different ways can you put $N$ pebbles in a row?

Suppose now that you are not allowed to put black pebbles next to each other. There are now only three ways of putting two pebbles in a row, because $BB$ is forbidden.

**(iii)** Write down the five different ways that are still allowed for three pebbles.

Now let $r_{N}$ be the number of possible arrangements for $N$ pebbles in a row, still under the restriction that black pebbles may not be next to each other, so $r_{2} = 3$ and $r_{3} = 5$.

**(iv)** Show that for $N \geqslant 4$ we have $r_{N} = r_{N-1} + r_{N-2}$. [Hint: consider separately the case where the last pebble is white, and the case where it is black.]

Finally, suppose that we impose the further restriction that the first pebble and the last pebble cannot both be black. Let $w_{N}$ be the number of such arrangements for $N$ pebbles; for example, $w_{3} = 4$, since the configuration $BWB$ is now forbidden.

**(v)** For $N \geqslant 5$, write down a formula for $w_{N}$ in terms of the numbers $r_{i}$, and explain why it is correct.

## 备注

### 我的备注

### AI备注
本题与 `MAT/1998/98-Q5.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

差异：1998 原卷把本卷的 (i)(ii) 合并为一小问 (a)，小问标号为 (a)–(d)；本卷拆成 (i)–(v)。

## 答案
（无）

## 解析
**(i)** The eight ways three $B$s or $W$s can be put in a row are:
$$
BBB,\ BBW,\ BWB,\ BWW,\ WBB,\ WBW,\ WWB,\ WWW.
$$

**(ii)** More generally there are $2^{N}$ ways of placing $N$ pebbles in a row, as at each place in the row a pebble can be independently $B$ or $W$.

**(iii)** In the list of eight rows of length three above, the five rows without $B$s side-by-side are
$$
BWB,\ BWW,\ WBW,\ WWB,\ WWW.
$$

**(iv)** Consider the $r_{N}$ possible rows of $B$ and $W$ of length $N$ which don't contain adjacent $B$s. These $r_{N}$ rows can either end in $B$ or $W$ (and clearly not both).

- If such a row ends in a $W$ then the previous $N - 1$ characters make up a row of length $N - 1$ which can't have adjacent $B$s.
- If such a row ends in a $B$ then the previous character has to be $W$. But then the previous $N - 2$ characters are a row of $B$s and $W$s without adjacent $B$s.

What we've shown is that each of the $r_{N}$ rows of length $N$, without adjacent $B$s, can be written as precisely one of the following
$$
(\text{a row of length } N - 1 \text{ without adjacent } B\text{s})\,W, \qquad (\text{a row of length } N - 2 \text{ without adjacent } B\text{s})\,WB.
$$
There are $r_{N-1}$ rows of the former type and $r_{N-2}$ of the latter. Hence
$$
r_{N} = r_{N-1} + r_{N-2}.
$$

**(v)** We now require that the first and last pebble cannot both be black.

- If such a row of length $N$ begins in a $W$ then the only restriction on the next $N - 1$ characters is that they have no adjacent $B$s.
- If such a row of length $N$ begins in a $B$ then it must be followed by a $W$, and the last character must also be a $W$, because of the new restriction. The intervening $N - 3$ characters make up a row without adjacent $B$s.

What this shows is that the $w_{N}$ rows of length $N$ each come in precisely one of the following forms:
$$
W\,(\text{row of length } N - 1 \text{ without adjacent } B\text{s}), \qquad BW\,(\text{row of length } N - 3 \text{ without adjacent } B\text{s})\,W.
$$
There are $r_{N-1}$ of the first type and $r_{N-3}$ of the second form. Hence
$$
w_{N} = r_{N-1} + r_{N-3}.
$$
