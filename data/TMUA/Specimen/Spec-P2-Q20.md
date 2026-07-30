---
database: TMUA
qid: 90010222000
id: Spec-P2-Q20
paper: TMUA P2
year:
number: Q20
section: Reasoning
difficulty: 0
topics: []
subtopics: []
tags:
  - specimen
status: 已入库
---

## 题目
Five logicians each make a statement, as follows:

	**Mr P:** Of these five statements, an odd number are true.
	**Ms Q:** Both statements made by women are true.
	**Mr R:** My first name is Robert and Mr P's statement is true.
	**Ms S:** Exactly one statement made by a man is true.
	**Mr T:** Neither statement made by a woman is true.

How many of the five statements can be simultaneously true?

$$
\mathbf{A} \quad \text{none}
$$

$$
\mathbf{B} \quad \text{1 only}
$$

$$
\mathbf{C} \quad \text{2 only}
$$

$$
\mathbf{D} \quad \text{3 only}
$$

$$
\mathbf{E} \quad \text{4 only}
$$

$$
\mathbf{F} \quad \text{none or 1 only}
$$

$$
\mathbf{G} \quad \text{1 or 2 only}
$$

$$
\mathbf{H} \quad \text{2 or 3 only}
$$

## 备注

### 我的备注

### AI备注


## 答案
D

## 解析
For ease of explanation, we say ‘Mr X is true/false’ as a shorthand for ‘Mr X’s statement is true/false’.

Of these statements, Ms Q and Mr T give the most explicit information, so we start with them. They cannot both be true, as they contradict each other, though they could both be false. So we look at these three possibilities in turn.

• Ms Q true, Mr T false.

Since Ms Q is true, Ms S is also true, which means that either Mr P or Mr R is true (as Mr T is false).

If Mr R is true, then Mr P is also true, contradicting Ms S. So Mr R must be false.

Since Ms S is true, Mr P must be true; this does not pose a problem with Mr R being false, as it could be that Mr R’s first name is not Robert. We must, though, check whether Mr P’s statement being true is consistent with the remaining statements.

We have Mr P, Ms Q and Ms S true and the other two false, giving three true statements. Thus Mr P’s statement is, indeed, true, and this is a possible set of truth values for the statements.

• Ms Q false, Mr T true.

Since Mr T is true, Ms S is false, and so either Mr P, Mr R or both must be true (as Mr T is already true).

If Mr P is true, there are two true statements from Mr P, Ms Q, Ms S and Mr T, which is an even number, so Mr R must also be true. This is consistent, as Mr R says that Mr P’s statement is true, which it is.

If Mr R is true, then Mr P must also be true, and this is feasible as we have just seen.

So in this case, we have Mr T, Mr P and Mr R all true, with the other two false, giving three true statements.

Both Ms Q and Mr T false.

Then exactly one statement made by a woman must be true, hence Ms S must be true. This requires exactly one of Mr P and Mr R to be true (as Mr T is false). If Mr R is true, then Mr P would also be true, which is not possible.

If, on the other hand, Mr P is true and Mr R is false (say his first name is not Robert, as before), then we would have only Mr P and Ms S being true, and that is an even number of true statements. So this is not possible (as Mr P says there are an odd number of true statements).

Hence we must have one of the first two possibilities, and there are exactly three true statements; the answer is option D.

Commentary: You might find this question easier to work out using a little table with ticks and crosses, for example something like:

$$
\begin{array}{c c c c c} M r P & M s Q & M r R & M s S & M r T \\ \hline \checkmark & \times & & & \checkmark \end{array}
$$

where Mr R and Ms S are not yet determined.

