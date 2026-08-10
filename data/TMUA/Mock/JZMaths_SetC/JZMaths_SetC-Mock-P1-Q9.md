---
database: TMUA
qid: 20132101207109
id: JZMaths_SetC-Mock-P1-Q9
paper: TMUA Mock
year:
number: Q9
section: Multiple Choice
difficulty: 6.5
topics: [Probability, Sequences and Series]
subtopics: [Elementary Probability, AP GP]
tags: [Sequences and Series, Ratio and Proportion]
status: 已入库
---

## 题目
Three players $A$, $B$ and $C$ take turns throwing a fair six-sided die in the order $A$, $B$, $C$, $A$, $B$, $C$, $\dots$ until one of them wins. The win conditions on a player's own throw are:

$$ A \text{ wins if } A \text{ throws a } 6, $$
$$ B \text{ wins if } B \text{ throws a } 5 \text{ or a } 6, $$
$$ C \text{ wins if } C \text{ throws a } 4, 5 \text{ or } 6. $$

If a player throws and does not win, play passes to the next player. What is the probability that $B$ is the first to win?

$$ \mathbf{A} \quad \frac{3}{13} $$
$$ \mathbf{B} \quad \frac{5}{18} $$
$$ \mathbf{C} \quad \frac{5}{13} $$
$$ \mathbf{D} \quad \frac{6}{13} $$
$$ \mathbf{E} \quad \frac{1}{3} $$
$$ \mathbf{F} \quad \frac{5}{9} $$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Consider one full round (the three throws by $A$, then $B$, then $C$).

The probability that $B$ wins on the first round is the probability that $A$ fails, then $B$ succeeds:

$$ P(B \text{ wins in round } 1) = \frac{5}{6} \cdot \frac{2}{6} = \frac{5}{18}. $$

The probability that no one wins in a round is

$$ P(\text{no winner in a round}) = \frac{5}{6} \cdot \frac{4}{6} \cdot \frac{3}{6} = \frac{60}{216} = \frac{5}{18}. $$

If no one wins in a round, the situation resets identically. So

$$ P(B \text{ wins}) = P(B \text{ win in round } 1) + P(B \text{ win in round } 2) + P(B \text{ win in round } 3) + \cdots, $$

therefore

$$ P(B \text{ wins}) = \frac{5}{18} + \left(\frac{5}{18}\right)^1 \cdot \frac{5}{18} + \left(\frac{5}{18}\right)^2 \cdot \frac{5}{18} + \cdots $$

This is a geometric series with first term $\frac{5}{18}$ and common ratio $\frac{5}{18}$:

$$ P(B \text{ wins}) = \frac{\frac{5}{18}}{1 - \frac{5}{18}} = \frac{\frac{5}{18}}{\frac{13}{18}} = \frac{5}{13}. $$
