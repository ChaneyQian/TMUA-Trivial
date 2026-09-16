---
database: TMUA
qid: 20132101212216
id: BeyondHorizonS2-Mock-P2-Q16
paper: TMUA Mock
year:
number: Q16
section: Multiple Choice
difficulty: 0
topics: [Logic and Proof, Function, Polynomial]
subtopics: [Logic, Algebraic Numbers, Polynomials]
tags: [Quantifiers, Minimal-Polynomial, 原卷缺陷, 待补答案]
status: 已入库
---

## 题目
The function $f(x)$ is defined as follows:
$$f(z) = a_0 + a_1 x + a_n x^n, \quad a_i \in Z$$
Which of the following is true?
$$\mathbf{A} \quad \text{There exists some odd } n \text{ such that there exists some } a_0, a_1, \ldots, a_n \text{ such that } f(\sqrt{2} + \sqrt{3}) = 0$$
$$\mathbf{B} \quad \text{If } f(\sqrt{2} + \sqrt{3}) = 0 \text{, then } f(\sqrt{2} - \sqrt{3}) = 0$$
$$\mathbf{C} \quad \text{For every even } n \text{, there exists some } a_0, a_1, \ldots, a_n \text{ such that } f(\sqrt{2} + \sqrt{3}) = 0$$
$$\mathbf{D} \quad \text{For every odd } n \text{, there exists some } a_0, a_1, \ldots, a_n \text{ such that } f(\sqrt{2} + \sqrt{5}) = 0$$

## 备注

### 我的备注

### AI备注
- **原卷缺陷：按题目显然的意图读，A 与 B 同时为真。**
  原卷把函数写成 $f(z)=a_0+a_1x+a_nx^n$——函数名 $z$/$x$ 不一致、中间项省略号漏印；
  但四个选项自己都写着 "$a_0, a_1, \ldots, a_n$"，所以意图明显是**一般的整系数多项式**。
  在这个读法下，A「存在奇数 $n$ 使 $f(\sqrt2+\sqrt3)=0$」**为真**：取 $n=5$、
  $f(x)=x\,(x^4-10x^2+1)=x^5-10x^3+x$，$\sqrt2+\sqrt3$ 是 $x^4-10x^2+1$ 的根，故 $f(\sqrt2+\sqrt3)=0$。
  出题人多半误以为「最小多项式是 4 次 ⟹ 只有偶次多项式能以它为根」，把 A 当成了假命题。
  解析里「A 在三项字面读法下为假」的论证是对的，但那个读法没人会采用，救不了这题。
  B 在两种读法下都真，`ANSWER` 记 B 是出题人意图项，**不是唯一正确答案**。
  按「多种合理读法各自命中真实选项 / 多个正确答案 ⟹ 坏题」口径，2026-09-11 第三轮复核补标。
- **键对拍（2026-09-11，键源 tmua.fyi）**：键给 **D**（「对每个奇数 $n$ 都存在整系数 $f$ 使 $f(\sqrt2+\sqrt5)=0$」）。**键错得比想象更离谱。**
  $n=1$：整系数一次式不可能以无理数为根；$n=3$：$\sqrt2+\sqrt5$ 的最小多项式 $x^4-14x^2+9$ 是 4 次，不整除任何三次式。
  除非允许零多项式——那样 A、C、D 全部平凡为真。无论哪种读法键都不自洽。`ANSWER` 改记 D（意图项），A、B 同真的缺陷仍在。

## 答案
D

## 解析
Let $\theta = \sqrt{2} + \sqrt{3}$. Then $\theta^2 = 5 + 2\sqrt{6}$, so $(\theta^2 - 5)^2 = 24$ and $\theta$ is a root of the integer polynomial
$$p(x) = x^4 - 10x^2 + 1,$$
which is irreducible over the rationals and is therefore the minimal polynomial of $\theta$. Its four roots are $\pm\sqrt{2} \pm \sqrt{3}$, and in particular $\sqrt{2} - \sqrt{3}$ is one of them. Now if any polynomial $f$ with integer coefficients satisfies $f(\theta) = 0$, then $p$ divides $f$ over the rationals, so every root of $p$ is also a root of $f$; in particular $f(\sqrt{2} - \sqrt{3}) = 0$. This makes B true, and the argument works whether the printed definition is read literally as a three-term expression or as an abbreviation for a general integer polynomial. Option D fails already at $n = 1$, since no linear polynomial with integer coefficients can have the irrational root $\sqrt{2} + \sqrt{5}$, and option C fails at $n = 2$, since the minimal polynomial of $\theta$ has degree $4$ and no non-zero quadratic can vanish at $\theta$. Option A fails under the printed three-term reading, because for odd $n$ the power $\theta^n$ lies in the span of $\sqrt{2}$ and $\sqrt{3}$, for instance $\theta^3 = 11\sqrt{2} + 9\sqrt{3}$ and $\theta^5 = 109\sqrt{2} + 89\sqrt{3}$, so an equation $a_0 + a_1\theta + a_n\theta^n = 0$ forces $a_0 = 0$ together with $a_1 + 11a_n = 0$ and $a_1 + 9a_n = 0$, whose only solution is the trivial one. The answer is B.
