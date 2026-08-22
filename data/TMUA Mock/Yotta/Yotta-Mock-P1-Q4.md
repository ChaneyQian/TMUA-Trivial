---
database: TMUA
qid: 20132101203104
id: Yotta-Mock-P1-Q4
paper: TMUA Mock
year:
number: Q4
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Non-zero integers $a, b$ and $c$ satisfy
$$ abc + bc + ab + ac + a + b + c = 104 $$
What is $a^2 + b^2 + c^2 + 2(a + b + c) + 1$?

$$
\mathbf{A} \quad 35
$$

$$
\mathbf{B} \quad 54
$$

$$
\mathbf{C} \quad 56
$$

$$
\mathbf{D} \quad 81
$$

$$
\mathbf{E} \quad 104
$$

$$
\mathbf{F} \quad 105
$$

## 备注

### 我的备注

### AI备注

- **原卷题目本身不适定：所给条件并不能唯一确定这个值。**
  题面只要求 $a,b,c$ 为**非零整数**，因此 $A=a+1,\;B=b+1,\;C=c+1$ 只需满足
  $ABC=105$ 且三者都不等于 $1$。除了 $\{|A|,|B|,|C|\}=\{3,5,7\}$ 给出的 $81$ 之外，
  例如 $(A,B,C)=(-1,3,-35)$ 即 $(a,b,c)=(-2,2,-36)$ 也满足原式
  （$(-1)(3)(-35)-1=104$），此时所求式为 $1233$。
  穷举全部合法分解，可能取值有 $81,\;273,\;465,\;1233,\;11025$ 共五个。
  选项里只有 $81$ 出现，所以作为选择题答案唯一、不影响作答；但"Find/What is"
  的措辞严格讲不成立。若拿去改编成填空题，必须补上"$a,b,c$ 为正整数"之类的条件。


## 答案
D

## 解析
Adding $1$ to both sides makes the left-hand side factorise:

$$ abc + ab + ac + bc + a + b + c + 1 = (a+1)(b+1)(c+1) = 105 $$

Write $A = a+1$, $B = b+1$, $C = c+1$, so $ABC = 105 = 3 \times 5 \times 7$. The quantity asked for is

$$ a^{2} + b^{2} + c^{2} + 2(a+b+c) + 1 = (a+1)^{2} + (b+1)^{2} + (c+1)^{2} - 2 = A^{2} + B^{2} + C^{2} - 2 $$

Taking $\{|A|, |B|, |C|\} = \{3, 5, 7\}$ gives $9 + 25 + 49 - 2 = 81$.

The answer is D.
