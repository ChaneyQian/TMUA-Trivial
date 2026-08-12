---
database: GMAT
qid: 90020741400
id: WORD-DS-Q14
paper: GMAT Word Problems DS Diagnostic
year: 0
number: Q14
section: Data Sufficiency
band: VERY HARD
level: LEVEL 8
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Odyssey runs from the Trojan Horse, which does not move, to the gates of Troy and back to the Trojan Horse by the same path. Was his average speed less than 20 kilometres per hour for the entire journey ?

(1) Odyssey's average speed from the Trojan Horse to the gates of Troy was greater than 40 kilometres per hour.
(2) Odyssey's average speed from the gates of Troy to the Trojan Horse was less than 10 kilometres per hour.

$$
\mathbf{A} \quad \text{Statement (1) ALONE is sufficient but statement (2) ALONE is not sufficient.}
$$

$$
\mathbf{B} \quad \text{Statement (2) ALONE is sufficient but statement (1) ALONE is not sufficient.}
$$

$$
\mathbf{C} \quad \text{BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient.}
$$

$$
\mathbf{D} \quad \text{EACH statement ALONE is sufficient.}
$$

$$
\mathbf{E} \quad \text{Statements (1) and (2) TOGETHER are not sufficient.}
$$

## 备注

### 我的备注

### AI备注

## 答案
B

## 解析
**Official Solution:**

Say the distance between the gates and the horse is $d$ kilometres, the time Odyssey needs to reach the gates is $t_1$ hours and the time Odyssey needs to reach the horse back is $t_2$ hours.

$Average \ speed=\frac{total  \ distance}{total \ time}=\frac{2d}{t_1+t_2}$. Here notice that since both $t_1$ and $t_2$ are positive, then $\frac{2d}{t_1+t_2} < \frac{2d}{t_1}$ and $\frac{2d}{t_1+t_2} < \frac{2d}{t_2}$. This means that the average speed for the round trip ($\frac{2d}{t_1+t_2}$) must be less than twice the speed during each half ($2*\frac{d}{t_1}$ and $2*\frac{d}{t_2}$).

(1)

Test extreme cases:

If Odyssey's average speed back to the horse were also high, say close to the speed of light, then the average speed for the round trip would obviously be more that 20 kilometres per hour.

If Odyssey's average speed back to the horse were very small, say close to 0 kilometres per hour, (in this case $t_2$ would be infinitely big) and his speed to the gates were say 50 kilometres per hour, then the average speed for the round trip would be close to 0, so less that 20 kilometres per hour.

Not sufficient.

(2)

The above means that $\frac{d}{t_2} < 10$

Multiply by 2: $2*\frac{d}{t_2} < 20$.

As discussed, we know that the average speed for the round trip ($\frac{2d}{t_1+t_2}$) must be less than twice the speed during each half ($2*\frac{d}{t_1}$ and $2*\frac{d}{t_2}$). So, $\frac{2d}{t_1+t_2} < 2*\frac{d}{t_2} < 20$. Sufficient.

Answer: B
