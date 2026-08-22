---
database: TMUA
qid: 20132101213214
id: BeyondHorizonS3-Mock-P2-Q14
paper: TMUA Mock
year:
number: Q14
section: Multiple Choice
difficulty: 0
topics: []
subtopics: []
tags: []
status: 已入库
---

## 题目
There are 100 people in a queue waiting to enter a hall. The hall has exactly 100 seats numbered from 1 to 100. The first person in the queue enters the hall, chooses any seat and sits there. The $n$-th person in the queue, where $n$ can be $2, \ldots, 100$, enters the hall after the $(n-1)$-th person is seated. He sits in seat number $n$ if he finds it vacant; otherwise he takes any unoccupied seat. Find the total number of ways in which 100 seats can be filled up, provided the 100-th person occupies seat number 100.
$$\mathbf{A} \quad 100$$
$$\mathbf{B} \quad 100^{100}$$
$$\mathbf{C} \quad 2^{98}$$
$$\mathbf{D} \quad 2^{99}$$
$$\mathbf{E} \quad 2^{100}$$

## 备注

### 我的备注

### AI备注


## 答案
C

## 解析
Let $g(N)$ be the number of valid seatings when there are $N$ people and $N$ seats and the last person must end up in seat $N$. Compute small cases.

For $N = 2$: if person 1 takes seat 1 then person 2 takes seat 2, which works; if person 1 takes seat 2 then person 2 cannot, so $g(2) = 1$.

For $N = 3$: person 1 taking seat 1 leaves everyone in their own seat, one way. Person 1 taking seat 2 forces person 2 to choose from the vacant seats $\{1,3\}$, and only choosing seat 1 leaves seat 3 free for person 3, one way. Person 1 taking seat 3 fails immediately. So $g(3) = 2$.

For $N = 4$ the same case analysis gives $1 + 2 + 1 + 0 = 4$ ways. The pattern $1, 2, 4, \ldots$ suggests
$$g(N) = 2^{N-2},$$
which is what the recursive structure delivers: whenever a displaced person enters, the vacant seats always consist of seat 1 together with a block of higher-numbered seats, and the person either "closes the cycle" by taking seat 1 or passes the displacement on to a later person, a binary choice at each of the $N-2$ intermediate stages.

With $N = 100$ this gives $2^{98}$. The answer is C.
