---
database: GMAT
qid: 90020731100
id: WORD-PS-Q11
paper: GMAT Word Problems PS Diagnostic
year: 0
number: Q11
section: Problem Solving
band: HARD
level: LEVEL 6
solution_source: 官方
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
Hungry chipmunk notices that, along a straight path, there are walnuts placed at intervals of 1 meter. The chipmunk wants to gather all the walnuts in his burrow, which is exactly where the middle walnut is. The chipmunk starts gathering the walnuts from the leftmost walnut and carries only one walnut at a time. If after completing the task, the chipmunk covered a distance of 300 meters and collected odd number of walnuts, then how many walnuts did the chipmunk collect ?

$$
\mathbf{A} \quad 11
$$

$$
\mathbf{B} \quad 13
$$

$$
\mathbf{C} \quad 15
$$

$$
\mathbf{D} \quad 23
$$

$$
\mathbf{E} \quad 25
$$

## 备注

### 我的备注

### AI备注

## 答案
E

## 解析
**Official Solution:**

Check the image below:

There are $n$ walnuts to the left of the burrow, $n$ walnuts to the right of the burrow, and 1 walnut exactly in the middle, at the burrow. Hence, the total number of walnuts is $n + n + 1=2n + 1$.

The chipmunk starts where the leftmost walnut is, so the first leg of the travel covers $n$ meters. After that, the chipmunk reaches the burrow. To collect the remaining $n-1$ walnuts, placed to the left of the burrow, the chipmunk should travel $n-1$ meters twice: to the walnut and back to the burrow; $n-2$ meters twice, to the walnut and back to the burrow; and so on until the first walnut to the left, where it travels 1 meter to the walnut and 1 meter back to the burrow. Thus, the chipmunk covers a total of:

$$2*1 + 2*2 + 2*3 + ... + 2(n-2) + 2(n-1)=2(1+2+3+...+(n-2)+(n-1))$$ meters.

The sum within the parentheses represents the sum of consecutive integers from 1 to $n-1$, which equals to $\frac{first + last}{2} * (number \ of \ terms)$. Hence, we get:

$$2(1+2+3+...+(n-2)+(n-1))= 2(\frac{1 + (n-1)}{2}*(n-1))=n(n-1)$$

Don't forget the $n$ meters the chipmunk covered to collect the first walnut to get the total distance covered to collect all walnuts to the left:

$$n(n-1) + n = n^2$$ meters.

Similarly, we can calculate the distance the chipmunk will cover to collect walnuts placed to the right of the burrow, with an expectation that the chipmunk has have to cover $n$ meters twice, not once: to the rightmost walnut and back, making the distance covered to collect walnuts placed to the right equal to $n^2 + n$ meters.

Thus, we have that $n^2 + (n^2 + n) = 300$, which gives $2n^2 +n- 300=0$. Solving gives $n=12$. Therefore, the number of walnuts is $2n+1=25$.

Answer: E
