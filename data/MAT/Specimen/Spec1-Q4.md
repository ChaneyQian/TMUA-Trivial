---
database: MAT
qid: 90010300400
id: Spec1-Q4
paper: MAT Specimen 1
year: 2009
number: Q4
section: Long Question
audience: Maths
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: [重复题]
duplicate_of: MAT/2004/04-Q4.md
status: 已入库
---
## 题目
For **APPLICANTS IN** $\left\{\begin{array}{l}\textbf{MATHEMATICS} \\ \textbf{MATHEMATICS \& STATISTICS} \\ \textbf{MATHEMATICS \& PHILOSOPHY}\end{array}\right\}$ **ONLY**.

A triangle $ABC$ has sides $BC$, $CA$ and $AB$ of lengths $a$, $b$ and $c$ respectively, and the angles at $A$, $B$ and $C$ are $\alpha$, $\beta$ and $\gamma$ where $0 \leqslant \alpha, \beta, \gamma \leqslant \dfrac{1}{2}\pi$.

**(i)** Show that the area of $ABC$ equals $\dfrac{1}{2} bc \sin\alpha$.

Deduce the sine rule
$$
\frac{a}{\sin\alpha} = \frac{b}{\sin\beta} = \frac{c}{\sin\gamma}.
$$

**(ii)** The points $P$, $Q$ and $R$ are respectively the feet of the perpendiculars from $A$ to $BC$, $B$ to $CA$, and $C$ to $AB$ as shown.

![[Image/Spec1-Q4-fig1.png]]
![[Image/Spec1-Q4-fig2.png]]
Prove that
$$
\text{Area of } PQR = \left(1 - \cos^{2}\alpha - \cos^{2}\beta - \cos^{2}\gamma\right) \times (\text{Area of } ABC).
$$

**(iii)** For what triangles $ABC$, with angles $\alpha$, $\beta$, $\gamma$ as above, does the equation
$$
\cos^{2}\alpha + \cos^{2}\beta + \cos^{2}\gamma = 1
$$
hold?

## 备注

### 我的备注

### AI备注
本题与 `MAT/2004/04-Q4.md` 是同一道题——牛津样卷是从 1996–2006 历年真题里挑题拼成的。已打 `重复题` 标签、排除出组卷池，避免随机组卷时同题出现两次。本条保留的价值在于**解析是原卷官方版**（Dr. Richard Earl），而孪生题的解析是自撰的。

差异：与 2004 原卷同题；本卷在题干中额外限定 $0 \leqslant \alpha, \beta, \gamma \leqslant \tfrac{1}{2}\pi$，2004 原卷无此限定。小问标号 (a)(b) → (i)(ii)(iii)。

## 答案
（无）

## 解析
![[Image/Spec1-Q4-sol1.png]]
![[Image/Spec1-Q4-sol2.png]]
**(i)** Taking $AB$ as the base, which is of length $c$, and $CR$ as the height, which is of length
$$
AC \sin(\angle CAR) = b \sin\alpha,
$$
we see the triangle has area
$$
\frac{1}{2} \times \text{base} \times \text{height} = \frac{1}{2} cb \sin\alpha.
$$
By similar considerations, the area is also given by
$$
\text{Area}(ABC) = \frac{1}{2} bc \sin\alpha = \frac{1}{2} ac \sin\beta = \frac{1}{2} ab \sin\gamma.
$$
Dividing these equations by $abc/2$, and then inverting, we obtain the sine rule
$$
\frac{a}{\sin\alpha} = \frac{b}{\sin\beta} = \frac{c}{\sin\gamma}.
$$

**(ii)** From the first part of the question we see that
$$
\text{Area}(AQR) = \frac{1}{2} AQ \cdot AR \sin\alpha = \frac{AQ}{c} \times \frac{AR}{b} \times \text{Area}(ABC) = \cos^{2}\alpha \times \text{Area}(ABC)
$$
since $BAQ$ and $RAC$ are right-angled triangles. Similarly
$$
\text{Area}(BPR) = \cos^{2}\beta \times \text{Area}(ABC); \qquad \text{Area}(CQP) = \cos^{2}\gamma \times \text{Area}(ABC).
$$
Hence
$$
\text{Area}(PQR) = \text{Area}(ABC) - \text{Area}(AQR) - \text{Area}(BPR) - \text{Area}(CQP) = \left(1 - \cos^{2}\alpha - \cos^{2}\beta - \cos^{2}\gamma\right) \times \text{Area}(ABC).
$$

**(iii)** If
$$
\cos^{2}\alpha + \cos^{2}\beta + \cos^{2}\gamma = 1
$$
in a triangle then the area of $PQR$ is zero. This can only happen when two of $P$, $Q$ and $R$ coincide at what will be the right-angle of the triangle — so the equality holds only if the triangle $ABC$ is right-angled.
