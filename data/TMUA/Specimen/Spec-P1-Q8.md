---
database: TMUA
qid: 20132101100108
id: Spec-P1-Q8
paper: TMUA P1
year:
number: Q8
section: Applications
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
Given that $a^x b^{2x} c^{3x} = 2$, where $a$, $b$, and $c$ are positive real numbers, then $x =$

$$
\mathbf{A} \quad \log_{10}\left(\frac{2}{a+2b+3c}\right)
$$

$$
\mathbf{B} \quad \frac{\log_{10}2}{\log_{10}(a+2b+3c)}
$$

$$
\mathbf{C} \quad \frac{2}{\log_{10}(a+2b+3c)}
$$

$$
\mathbf{D} \quad \frac{2}{a+2b+3c}
$$

$$
\mathbf{E} \quad \log_{10}\left(\frac{2}{ab^2c^3}\right)
$$

$$
\mathbf{F} \quad \frac{\log_{10}2}{\log_{10}(ab^2c^3)}
$$

$$
\mathbf{G} \quad \frac{2}{\log_{10}(ab^2c^3)}
$$

$$
\mathbf{H} \quad \frac{2}{ab^2c^3}
$$

## 备注

### 我的备注

### AI备注


## 答案
F

## 解析
The options all involve logarithm to base 10, so we start by taking logarithms of the given equation. This gives

$$
\log_ {1 0} (a ^ {x} b ^ {2 x} c ^ {3 x} = \log_ {1 0} 2
$$

so

$$
\log_ {1 0} (a ^ {x}) + \log_ {1 0} (b ^ {2 x}) + \log_ {1 0} (c ^ {3 x}) = \log_ {1 0} 2.
$$

We now use the index rule for logarithms to give

$$
x \log_ {1 0} a + 2 x \log_ {1 0} b + 3 x \log_ {1 0} c = \log_ {1 0} 2
$$

which factorises to

$$
x (\log_ {1 0} a + 2 \log_ {1 0} b + 3 \log_ {1 0} c) = \log_ {1 0} 2
$$

and hence

$$
x = \frac {\log_ {1 0} 2}{\log_ {1 0} a + 2 \log_ {1 0} b + 3 \log_ {1 0} c}.
$$

This, though, is not one of the offered options; we now have to apply the logarithm rules in reverse to give

$$
x = \frac {\log_ {1 0} 2}{\log_ {1 0} a + \log_ {1 0} (b ^ {2}) + \log_ {1 0} (c ^ {3})}
$$

which simplifies further to

$$
x = \frac {\log_ {1 0} 2}{\log_ {1 0} (a b ^ {2} c ^ {3})}
$$

and so the answer is F.
