---
database: TMUA
qid: 20132101203119
id: Yotta-Mock-P1-Q19
paper: TMUA Mock
year:
number: Q19
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Consider $f(x) = \ln(\sqrt{x^2 - 2x + 1})$. Which of the following statements is true about $f(x)$?

$$
\mathbf{A} \quad \text{It is defined for all real } x \text{.}
$$

$$
\mathbf{B} \quad \text{Defined for all real } x < 0 \text{ but not all real } x > 0 \text{.}
$$

$$
\mathbf{C} \quad \text{Defined for all real } x > 0 \text{ but not all real } x < 0 \text{.}
$$

$$
\mathbf{D} \quad \text{Undefined for } x = e \text{.}
$$

$$
\mathbf{E} \quad 8 < f^{-1}(2) < 9 \text{.}
$$

$$
\mathbf{F} \quad f(x) = 100 \text{ has no solutions.}
$$

## 备注

### 我的备注

### AI备注

- **选项 E 也站得住，本题严格说不止一个真命题。**
  $f(x)=\ln|x-1|$，解 $f(x)=2$ 得 $|x-1|=e^{2}\approx 7.389$，即 $x=1\pm e^{2}$，
  其中 $1+e^{2}\approx 8.389$ **确实落在 $(8,9)$ 内**。
  判 E 为假只能依赖"$f$ 不是单射、$f^{-1}$ 并非函数，所以 $f^{-1}(2)$ 这个记号
  本身无定义"这一层。相较之下 B 是无歧义为真的，所以标准答案取 B。
  作答时若选了 E，理由是对的、只是没往记号是否良定义上想。


## 答案
B

## 解析
Since $x^{2} - 2x + 1 = (x-1)^{2}$, the square root is $|x-1|$ and

$$ f(x) = \ln|x-1| $$

This needs $|x-1| > 0$, so $f$ is defined for every real $x$ except $x = 1$.

Now test the options. It is not defined for all real $x$, so A fails, and it *is* defined at $x = e$, so D fails. Every $x < 0$ satisfies $x \neq 1$, so $f$ is defined on the whole of $x < 0$; but $x = 1$ lies in $x > 0$, so it is not defined on the whole of $x > 0$. That is exactly statement B, and it rules out C. Finally $f(x) = 100$ has the solutions $x = 1 \pm e^{100}$, so F fails.

The answer is B.
