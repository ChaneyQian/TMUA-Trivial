---
database: MAT
qid: 90010310500
id: Spec2-Q5
paper: MAT Specimen 2
year: 2009
number: Q5
section: Long Question
audience: All
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/2005/05-Q4.md
status: 已入库
---
## 题目
**For ALL APPLICANTS.**

An $n \times n$ square array contains $0$s and $1$s. Such a square is given below with $n = 3$.
$$
\begin{array}{|c|c|c|}
\hline
0 & 0 & 1 \\
\hline
1 & 0 & 0 \\
\hline
1 & 1 & 0 \\
\hline
\end{array}
$$

Two types of operation $C$ and $R$ may be performed on such an array.

- The first operation $C$ takes the first and second columns (on the left) and replaces them with a single column by comparing the two elements in each row as follows: if the two elements are the same then $C$ replaces them with a $1$, and if they differ $C$ replaces them with a $0$.
- The second operation $R$ takes the first and second rows (from the top) and replaces them with a single row by comparing the two elements in each column as follows: if the two elements are the same then $R$ replaces them with a $1$, and if they differ $R$ replaces them with a $0$.

By way of example, the effects of performing $R$ then $C$ on the square above are given below.
$$
\begin{array}{|c|c|c|}
\hline
0 & 0 & 1 \\
\hline
1 & 0 & 0 \\
\hline
1 & 1 & 0 \\
\hline
\end{array}
\ \xrightarrow{\ R\ }\
\begin{array}{|c|c|c|}
\hline
0 & 1 & 0 \\
\hline
1 & 1 & 0 \\
\hline
\end{array}
\ \xrightarrow{\ C\ }\
\begin{array}{|c|c|}
\hline
0 & 0 \\
\hline
1 & 0 \\
\hline
\end{array}
$$

**(a)** If $R$ then $C$ are performed on a $2 \times 2$ array then only a single number ($0$ or $1$) remains.

**(i)** Write down in the grids on the next page the eight $2 \times 2$ arrays which, when $R$ then $C$ are performed, produce a $1$.

**(ii)** By grouping your answers accordingly, show that if $\begin{array}{|c|c|}\hline a & b \\ \hline c & d \\ \hline\end{array}$ is amongst your answers to part (i) then so is $\begin{array}{|c|c|}\hline a & c \\ \hline b & d \\ \hline\end{array}$.

Explain why this means that doing $R$ then $C$ on a $2 \times 2$ array produces the same answer as doing $C$ first then $R$.

**(b)** Consider now an $n \times n$ square array containing $0$s and $1$s, and the effects of performing $R$ then $C$, or $C$ then $R$, on the square.

**(i)** Explain why the effect on the right $n - 2$ columns is the same whether the order is $R$ then $C$ or $C$ then $R$. [This then also applies to the bottom $n - 2$ rows.]

**(ii)** Deduce that performing $R$ then $C$ on an $n \times n$ square produces the same result as performing $C$ then $R$.

## 备注

### 我的备注

### AI备注
本题与 `MAT/2005/05-Q4.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

差异：与 2005 原卷同题，小问结构一致。

## 答案
（无）

## 解析
**(a)(i)** $C$ produces $1$ from a $1 \times 2$ grid if both entries are equal. So a $2 \times 2$ grid produces a $1$, after $R$ then $C$, if the entries of each column agree (the top row below) or if the entries of each column disagree (the bottom row). So the eight $2 \times 2$ grids which produce a $1$ (after $R$, then $C$) are
$$
\begin{array}{|c|c|}\hline 0 & 0 \\ \hline 0 & 0 \\ \hline\end{array}
\quad
\begin{array}{|c|c|}\hline 0 & 1 \\ \hline 0 & 1 \\ \hline\end{array}
\quad
\begin{array}{|c|c|}\hline 1 & 0 \\ \hline 1 & 0 \\ \hline\end{array}
\quad
\begin{array}{|c|c|}\hline 1 & 1 \\ \hline 1 & 1 \\ \hline\end{array}
$$
$$
\begin{array}{|c|c|}\hline 0 & 0 \\ \hline 1 & 1 \\ \hline\end{array}
\quad
\begin{array}{|c|c|}\hline 0 & 1 \\ \hline 1 & 0 \\ \hline\end{array}
\quad
\begin{array}{|c|c|}\hline 1 & 0 \\ \hline 0 & 1 \\ \hline\end{array}
\quad
\begin{array}{|c|c|}\hline 1 & 1 \\ \hline 0 & 0 \\ \hline\end{array}
$$

**(a)(ii)** The first, fourth, sixth and seventh grids are symmetric in the top-left-to-bottom-right diagonal, and the second/fifth and third/eighth are reflections of one another about this diagonal. Alternatively, we can say that the grids listed above are those that contain an even number of $1$s, in which case their reflections in the leading diagonal will also have an even number of $1$s.

The effect of doing $R$ then $C$ on $\begin{array}{|c|c|}\hline a & b \\ \hline c & d \\ \hline\end{array}$ is the same as doing $C$ then $R$ on $\begin{array}{|c|c|}\hline a & c \\ \hline b & d \\ \hline\end{array}$. This means that if the first effect is a $1$ then so will the second be. Similarly if the first effect is a $0$, and so it is not amongst the above eight grids, then neither will its reflection be; hence doing $C$ then $R$ on the reflection will also produce a $0$.

**(b)(i)** If we consider the right $n - 2$ columns of the $n \times n$ grid then $C$ has no effect on them whatsoever, whether done first or second. The effect of $R$ is to compare the top two rows, but this is the same effect whether done first or second.

**(b)(ii)** From the previous part the effect on the bottom $n - 2$ rows, and right $n - 2$ columns, is the same irrespective of order. From part (a) of the question the effects on the top-left $2 \times 2$ entries are also the same, and so the order in which $R$ and $C$ are performed does not matter.
