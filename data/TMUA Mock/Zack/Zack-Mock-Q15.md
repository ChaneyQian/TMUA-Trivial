---
database: TMUA
qid: 20132101204015
id: Zack-Mock-Q15
paper: TMUA Mock
year:
number: Q15
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Given
$$ f(x) = \frac{x\sqrt{x} - 2\sqrt{x}}{\sqrt{2} - \sqrt{x}}, $$
find $f'(2)$.

$$
\mathbf{A} \quad 0
$$

$$
\mathbf{B} \quad \frac{1}{\sqrt{2}}
$$

$$
\mathbf{C} \quad \frac{1}{2}
$$

$$
\mathbf{D} \quad -\frac{3}{2}
$$

$$
\mathbf{E} \quad \frac{3}{2}
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
Do not differentiate this as it stands — factor first. Writing $x-2 = \left(\sqrt{x}-\sqrt2\right)\left(\sqrt{x}+\sqrt2\right)$,

$$ f(x) = \frac{\sqrt{x}\,(x-2)}{\sqrt2-\sqrt{x}} = \frac{\sqrt{x}\left(\sqrt{x}-\sqrt2\right)\left(\sqrt{x}+\sqrt2\right)}{\sqrt2-\sqrt{x}} = -\sqrt{x}\left(\sqrt{x}+\sqrt2\right) $$

so for $x \neq 2$,

$$ f(x) = -x-\sqrt{2x} $$

The singularity at $x=2$ is removable, and differentiating the simplified form gives

$$ f'(x) = -1-\frac{1}{\sqrt{2x}} \implies f'(2) = -1-\frac12 = -\frac32 $$

The answer is D.
