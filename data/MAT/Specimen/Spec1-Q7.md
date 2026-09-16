---
database: MAT
qid: 90010300700
id: Spec1-Q7
paper: MAT Specimen 1
year: 2009
number: Q7
section: Long Question
audience: CS
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/2004/04-Q5.md
status: 已入库
---
## 题目
**For APPLICANTS IN COMPUTER SCIENCE ONLY.**

The game of Oxflip is for one player and involves circular counters, which are white on one side and black on the other, placed in a grid. During a game, the counters are flipped over (changing between black and white side uppermost) following certain rules. Given a particular size of grid and a set starting pattern of whites and blacks, the aim of the game is to reach a certain target pattern. Each "move" of the game is to flip over either a whole row or a whole column of counters (so one whole row or column has all its blacks swapped to whites and vice versa). For example, in a game played in a three-by-three square grid, if you are given the starting and target patterns

$$
\text{Start:}\quad
\begin{array}{ccc}
\circ & \bullet & \circ \\
\bullet & \circ & \bullet \\
\circ & \bullet & \circ
\end{array}
\qquad\qquad
\text{Target:}\quad
\begin{array}{ccc}
\bullet & \bullet & \bullet \\
\bullet & \bullet & \bullet \\
\bullet & \bullet & \bullet
\end{array}
$$

a sequence of three moves to achieve the target is:

$$
\begin{array}{ccc}
\circ & \bullet & \circ \\
\bullet & \circ & \bullet \\
\circ & \bullet & \circ
\end{array}
\ \xrightarrow{\ \text{flip first row}\ }\
\begin{array}{ccc}
\bullet & \circ & \bullet \\
\bullet & \circ & \bullet \\
\circ & \bullet & \circ
\end{array}
\ \xrightarrow{\ \text{flip middle column}\ }\
\begin{array}{ccc}
\bullet & \bullet & \bullet \\
\bullet & \bullet & \bullet \\
\circ & \circ & \circ
\end{array}
\ \xrightarrow{\ \text{flip third row}\ }\
\begin{array}{ccc}
\bullet & \bullet & \bullet \\
\bullet & \bullet & \bullet \\
\bullet & \bullet & \bullet
\end{array}
$$

There are many other sequences of moves which also have the same result.

**(i)** Consider the two-by-two version of the game with starting pattern
$$
\begin{array}{cc}
\circ & \bullet \\
\bullet & \circ
\end{array}
$$
Draw, in the blank patterns below, the eight different target patterns (including the starting pattern) that it is possible to obtain.

What are the possible numbers of white counters that may be present in these target patterns?

**(ii)** In the four-by-four version of the game, starting with pattern
$$
\begin{array}{cccc}
\bullet & \circ & \bullet & \circ \\
\circ & \bullet & \circ & \bullet \\
\bullet & \circ & \bullet & \circ \\
\circ & \bullet & \circ & \bullet
\end{array}
$$
explain why it is impossible to reach a pattern with only one white counter. [Hint: don't try to write out every possible combination of moves.]

**(iii)** In the five-by-five game, explain why any sequence of moves which begins
$$
\begin{array}{ccccc}
\circ & \bullet & \circ & \bullet & \circ \\
\bullet & \circ & \bullet & \circ & \bullet \\
\circ & \bullet & \circ & \bullet & \circ \\
\bullet & \circ & \bullet & \circ & \bullet \\
\circ & \bullet & \circ & \bullet & \circ
\end{array}
$$
and ends with an all-white pattern, must involve an odd number of moves. What is the least number of moves needed? Give reasons for your answer.

## 备注

### 我的备注

### AI备注
本题与 `MAT/2004/04-Q5.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

差异：2004 原卷小问标号为 (a)–(c)，本卷为 (i)–(iii)；原卷用位图排版棋盘，本卷用 $\circ/\bullet$ 阵列转写。

## 答案
（无）

## 解析
**(i)** The possible patterns are
$$
\begin{array}{cc}\circ & \bullet \\ \circ & \bullet\end{array}
\quad
\begin{array}{cc}\bullet & \circ \\ \bullet & \circ\end{array}
\quad
\begin{array}{cc}\circ & \circ \\ \bullet & \bullet\end{array}
\quad
\begin{array}{cc}\bullet & \bullet \\ \circ & \circ\end{array}
$$
$$
\begin{array}{cc}\bullet & \bullet \\ \bullet & \bullet\end{array}
\quad
\begin{array}{cc}\circ & \circ \\ \circ & \circ\end{array}
\quad
\begin{array}{cc}\circ & \bullet \\ \bullet & \circ\end{array}
\quad
\begin{array}{cc}\bullet & \circ \\ \circ & \bullet\end{array}
$$
The possible numbers of white counters are $0$, $2$, $4$.

**(ii)** Note that we started with an even number of whites. Each allowed move flips a row or column. If the number of whites in the flipped row/column is $i$ then it becomes $4 - i$. In particular, if there was an odd (respectively even) number of whites before there will be an odd (respectively even) number afterwards. As the remaining counters are unchanged then each flip preserves the parity (oddness or evenness) of the total number of whites. As we started out with an even number of whites, there will always remain an even number of whites — in particular, there can never be just one white.

(An alternative proof is to note that any two-by-two subsquare is affected by each move either not at all or in the same ways as moves in the two-by-two game, and must start with a pattern identical or complementary to that of the previous part. So if it were possible to reach a four-by-four square with only one white then it would be possible to reach a two-by-two square with only one white, and the previous part demonstrates that this is not possible.)

**(iii)** In the five-by-five case, the number of whites in each row or column changes from $i$ to $5 - i$ under each flip. Arguing as in the previous part, the total number of whites changes from odd to even, or vice versa, with every move. Since there is an even number of whites to start with and an odd number to end up with (an all-white grid with $25$ whites), there must be an odd number of moves.

It is fairly easy to see how to change the starting pattern to all white with five moves (flip rows $1$, $3$ and $5$ and then columns $2$ and $4$). Can it be done with fewer moves? We already know that the number of moves must be odd so it suffices to show that $3$ moves is not sufficient. The easiest way to see this is to note that one cannot touch all the black counters in three moves — at most three black counters lie in a row or column and there are thirteen counters that need turning in all.
