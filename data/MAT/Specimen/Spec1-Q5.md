---
database: MAT
qid: 90010300500
id: Spec1-Q5
paper: MAT Specimen 1
year: 2009
number: Q5
section: Long Question
audience: All
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/1997/97-Q5.md
status: 已入库
---
## 题目
**For ALL APPLICANTS.**

Songs of the Martian classical period had just two notes (let us call them $x$ and $y$) and were constructed according to rigorous rules:

I. the sequence consisting of no notes was deemed to be a song (perhaps the most pleasant);

II. a sequence starting with $x$, followed by two repetitions of an existing song and ending with $y$ was also a song;

III. the sequence of notes obtained by interchanging $x$s and $y$s in a song was also a song.

All songs were constructed using those rules.

**(i)** Write down four songs of length six (that is, songs with exactly six notes).

**(ii)** Show that if there are $k$ songs of length $m$ then there are $2k$ songs of length $2m + 2$.

Deduce that for each natural number $n$ there are $2^{n}$ songs of length $2^{n+1} - 2$.

Songs of the Martian later period were constructed using also the rule:

IV. if a song ended in $y$ then the sequence of notes obtained by omitting that $y$ was also a song.

**(iii)** What lengths do songs of the later period have? That is, for which natural numbers $n$ is there a song with exactly $n$ notes? Justify your answer.

## 备注

### 我的备注

### AI备注
本题与 `MAT/1997/97-Q5.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

差异：1997 原卷小问标号为 (a)–(c)，本卷为 (i)–(iii)，内容一致。

## 答案
（无）

## 解析
**(i)** The only way to create longer songs, from previous ones, is by Rule II. $xy$ is a song of length two (as it can be made from Rule II as $x$–no notes–no notes–$y$) and by Rule III $yx$ is also a song. With these two songs and using Rule II again, we can produce two songs
$$
xxyxyy \quad \text{and} \quad xyxyxy
$$
of length six, and applying Rule III we also see that
$$
yyxyxx \quad \text{and} \quad yxyxyx
$$
are songs.

**(ii)** As was noted in (i), longer songs may only be produced from shorter ones using Rule II. Given any song $s$ of length $m$ then the song $xssy$ is also a song. By this means, $k$ songs of length $m$ create $k$ new songs of length $2m + 2$. The only way to produce further songs of length $2m + 2$ is to swap the $x$s and $y$s in the newly made songs by Rule III. So $y\tilde{s}\tilde{s}x$ will also be a song of length $2m + 2$, where $\tilde{s}$ denotes the song $s$ with all $x$s and $y$s swapped. As the new batch of songs end in an $x$ and the previous batch ended in a $y$, then the second batch of length $2m + 2$ songs contains none of the first batch. In total, then, we have $2k$ new songs of length $2m + 2$.

Each time, this process of generating new songs produces twice as many songs of the next allowable length as for the previous allowed length. As there is one song of the "noughth" allowed length there will be $2^{n}$ of the $n$th allowed length for $n \geqslant 0$. What is the $n$th allowed length? These allowed lengths follow the rule
$$
\begin{aligned}
\text{length}_{0} &= 0 \\
\text{length}_{1} &= 2 \times 0 + 2 = 2 \\
\text{length}_{2} &= 2 \times 2 + 2 = 2^{2} + 2 \\
\text{length}_{3} &= 2 \times \left(2^{2} + 2\right) + 2 = 2^{3} + 2^{2} + 2 \\
&\ \ \vdots \\
\text{length}_{n} &= 2^{n} + 2^{n-1} + \cdots + 2.
\end{aligned}
$$
This $\text{length}_{n}$ is a geometric sum with $n$ terms, common ratio $2$, and first term $2$, and so we have
$$
\text{length}_{n} = \frac{2\left(2^{n} - 1\right)}{2 - 1} = 2^{n+1} - 2.
$$
[For those with knowledge of mathematical induction then part (ii) could be attempted using this, for full marks, but no presumption about such knowledge has been made.]

**(iii)** For any positive whole number $n$, it is possible to produce a song of greater length using Rules I, II, III, because we can find a $k$ such that $2^{k+1} - 2 \geqslant n$. Set $N = 2^{k+1} - 2$. If this longer (length $N$) song ends in a $y$ we may reduce its length using Rule IV to make another song one note shorter. On the other hand, if the song of length $N$ ends in an $x$ we can swap all the $x$s and $y$s by Rule III to produce a song, also of length $N$, which now ends in a $y$. Removing the final $y$ by Rule IV we again have produced a song of length $N - 1$.

Repeating this process, one note at a time, we eventually produce a song of length $n$, and so songs of all possible lengths exist in the Martian later period.
