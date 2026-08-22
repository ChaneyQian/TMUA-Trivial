---
database: TMUA
qid: 20132101211215
id: BeyondHorizonS1-Mock-P2-Q15
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
When 15 is appended to a list of integers, the mean is increased by 2. When 1 is appended to the enlarged list, the mean of the enlarged list is decreased by 1. How many integers were in the original list?
$$\mathbf{A} \quad 4$$
$$\mathbf{B} \quad 5$$
$$\mathbf{C} \quad 6$$
$$\mathbf{D} \quad 7$$
$$\mathbf{E} \quad 8$$

## 备注

### 我的备注

### AI备注


## 答案
A

## 解析
Let the original list have $n$ integers with sum $S$ and mean $m=S/n$, so $S=mn$. Appending $15$ gives $\frac{S+15}{n+1}=m+2$, which after clearing denominators and cancelling $mn$ becomes $15=m+2n+2$, that is $m=13-2n$. Appending $1$ to the enlarged list gives $\frac{S+16}{n+2}=m+1$, since the new mean is one less than $m+2$; clearing denominators and cancelling $mn$ this time gives $16=2m+n+2$, that is $2m+n=14$. Substituting $m=13-2n$ yields $26-3n=14$, so $n=4$ and $m=5$; checking, the sums $20$, $35$ and $36$ over $4$, $5$ and $6$ entries give means $5$, $7$ and $6$ exactly as required. The answer is A.
