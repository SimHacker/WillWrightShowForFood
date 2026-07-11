# The fork() essay question — an answer key, 39 years late

In 1987 Don posted an exam question to the net (possibly unix-wizards). In 1991 Tom found it in his restored CMU account, in a directory called `random code`, and mailed it back
([the correspondence](sources/early-correspondence-1991-1992.md)). Nobody ever graded it.
This room now takes the exam.

## The question

```c
/*
 * Date: Sun, 1 Feb 87 22:36:07 EST
 * From: Don Hopkins <don@brillig.umd.edu>
 * Subject: Essay question
 *
 * Without using anything but the calculator hanging off your belt,
 * your VI quick reference card, and the LCD alarm chronograph
 * mechanical pencil in your plastic pocket reinforce-omatic, describe
 * in minute detail the output of this program. Expound in depth on
 * the cultural and historical traditions behind every race condition
 * involved, including insightful commentary on the personality quirks
 * and religious practices of the parties responsible for each kernel
 * bug you refer to in your explanation. Make sure to mention every
 * operating system release in which your comments apply. Be concise
 * and to the point. You may not blame it on the compiler. For extra
 * credit, replace the fork() with vfork().
 *
 *	-Don
 */

#include <stdio.h>

main()
{
 printf("%d\n", foo() + (foo()<<1) + (foo()<<2) + (foo()<<3));
}

foo()
{
 return(fork() ? 1 : 0);
}
```



## The answer

**The program prints the integers 0 through 15, one per line, each exactly once, in an order
chosen by the scheduler's mood.** It is a four-bit binary counter implemented in processes: a
fork bomb with a college education, and every kind of nondeterminism 1987 Unix had to offer,
stacked four high.

### Why 0 through 15

Each call to `foo()` forks. In the parent, `fork()` returns the child's PID (nonzero), so the
ternary yields **1**. In the child it returns 0, so **0**. Both processes then continue
evaluating the *rest* of the expression from the same snapshot — the child inherits the partial
sums already computed, because `fork()` copies the whole works, stack and registers included.

So each of the four `foo()` calls is a fork point at which every live process splits in two:
one that scored a 1 at that syntactic position, one that scored a 0. Four fork points, starting
from one process:

1 → 2 → 4 → 8 → **16 processes**, one per four-bit combination.

The shifts hand each position its weight — `foo()` is the 1s bit, `foo()<<1` the 2s, `foo()<<2`
the 4s, `foo()<<3` the 8s — so the sixteen processes hold the sixteen sums 0 through 15, and
each does exactly one `printf` at the end. Sixteen lines, a permutation of 0–15. The original
process is the one that answered "parent" all four times: it prints 15. The great-great-grandchild
that answered "child" all four times prints 0.

### "You may not blame it on the compiler"

This clause is doing enormous work, because the natural wrong answer is about the compiler. The
order in which the four `foo()` calls are evaluated between `+` operators is **unspecified** in
K&R C (and in every ANSI/ISO C since). PCC on a VAX did one thing, other compilers did another.

The trap: it doesn't matter. Addition commutes, and each call's weight is welded to its
syntactic position by the shift, not to its evaluation order. Whichever call goes first, the
multiset of printed values is {0, 1, 2, ..., 15}. The clause forbids the excuse precisely
because the excuse is irrelevant — the exam wants you to *prove* it's irrelevant.

### The race conditions and their cultural traditions

- **The scheduler race.** Which of the sixteen processes reaches `printf` first is up to the
scheduler. The output order is a fingerprint of the machine's load average at that instant —
seventeen students running this on the same VAX-11/780 the night the assignment is due get
seventeen different orderings, which is the point.
- **The stdio buffering trap (honorably dodged).** All four forks happen *during argument
evaluation*, before `printf` is ever called, so no process forks with output sitting in a
stdio buffer. That's why you get exactly 16 lines even when redirected to a file. Move the
forks after a buffered, unflushed `printf` and fully-buffered stdout would duplicate the
buffer into every child at exit — the classic "why did my program print 32 lines into the
file but 16 to the terminal" ambush. This program walks past that trap on purpose; mentioning
it is worth points, since it is the race condition's cultural tradition par excellence.
- **The prompt race.** `main` never calls `wait()`. The parent can exit before its descendants;
orphans are reparented to init (PID 1), which quietly reaps them. Meanwhile the shell, seeing
the original process exit, prints its prompt — usually somewhere in the middle of the other
fifteen lines of output. Generations of students have "fixed" this bug by hitting return.
- **The failure mode nobody grades.** `return(fork() ? 1 : 0)` treats **-1 as 1**. When the
process table fills (a real concern on a shared 1987 VAX with per-user process limits),
`fork()` fails with EAGAIN, returns -1, and the "parent" scores its bit with no child ever
created. The output degrades gracefully into fewer than sixteen lines with phantom high bits —
values duplicated, values missing — and the program reports no error at all, in the finest
Unix tradition of treating an error return as just another number. The personality quirk
responsible: the C convention that anything nonzero is true, ordained before error checking
was fashionable.



### Personality quirks, religious practices, OS releases

The traditions demanded by the question: this program behaves as described on Version 7,
4.1BSD, 4.2BSD, 4.3BSD, and System V, which is precisely the miracle — the sixteen-process
counter is portable across the great schism. The BSD congregation (Berkeley, csh, `vfork`,
job control) and the System V congregation (AT&T, sh, sanctity of the process table) agreed on
almost nothing in 1987, but `fork()` semantics were scripture to both. The race conditions are
ecumenical.

The pocket-protector liturgy in the preamble ("calculator hanging off your belt... plastic
pocket reinforce-omatic") is the correct dress code for the exam, and `brillig.umd.edu` places
the examiner at the University of Maryland, whose machines were named from Jabberwocky —
mimsy, brillig, tove, gyre, gimble — a religious practice in its own right.

### Extra credit: vfork()

Replace `fork()` with `vfork()` and the program stops being a puzzle and becomes a crime scene.

`vfork()` (born 3.0BSD, canonized 4.2BSD) doesn't copy the address space: the child **borrows
the parent's memory and stack**, and the parent is suspended until the child calls `exec` or
`_exit`. The manual's commandment is explicit: the child must not *return from the function
that called vfork*.

Here, `vfork()` is called inside `foo()`, and the child's very next act is to **return from**
`foo()` — popping a stack frame it shares with its suspended parent. When the parent resumes,
its stack has been used, dirtied, and handed back like a borrowed car with the seat adjusted
and the tank empty. It returns through a frame that no longer means what it meant, into
undefined behavior: garbage sums, doubled returns, or a core dump, varying by BSD release and
phase of moon. And since each child *also* continues evaluating and vforking, the wreckage
compounds four levels deep.

The concise answer to the extra credit, in the idiom of the era: **you lose.** The personality
quirk responsible is Berkeley's — `vfork` was a performance hack to spare the VAX the cost of
copying an address space just to throw it away on `exec`, a bug that 4.2BSD's own manual page
apologized for and promised to remove. The apology outlived the VAX.

Picture the `fork()` version as a **Rube Goldberg machine**: four fork points, sixteen
processes, each line of output a marble that dropped through the right gate at the right time.
Absurd, over-engineered, and yet it *works* — every marble lands in its numbered cup, 0 through
15, even if the cups fill in random order. Replace `fork()` with `vfork()` and you have not
improved the machine. You have thrown a **monkey wrench** into it. Worse: a **brick in the
dryer**. The child runs on the parent's stack — shared memory tumbling at full spin — and every
`return from foo()` is another thump against the drum. Frame pointers smear. Return addresses
skid. The parent wakes to a stack that has been through a cycle with something heavy and wrong
inside it. Smoke. Banging. Undefined behavior. The kind of failure you can hear from the laundry
room.

That is why the extra credit is a trap dressed as a bonus. The exam question is a puzzle; the
`vfork` variant is a **practical joke with a safety interlock removed**.

### Addendum: the Linux dispensation (a religion founded after the exam)

Linux did not exist when this question was posted. Linus Torvalds was seventeen, and the
denominations available were listed above. Does the new church change the answer? **The
output does not change** — sixteen lines, 0 through 15, order by scheduler's mood — which is
itself the theological point: `fork()` semantics survived a second schism intact. But nearly
every *mechanism* under the answer was rebuilt, each rebuild with a name attached, and the
question explicitly demands names.

- **Linus Torvalds** made `fork()` **copy-on-write from the start**, which quietly demolished
  `vfork`'s entire reason to exist — so through Linux 2.0 he simply **aliased `vfork` to
  `fork`**. Which means the extra credit inverts: on Linux 2.0, replace `fork()` with
  `vfork()` and the program *works perfectly*. **You accidentally win.** Then Linux 2.2
  (1999) restored the authentic footgun via `CLONE_VFORK | CLONE_VM`, and you lose again —
  faithfully, portably, in the finest tradition. Grading note: a student who answers "you
  lose" is correct on every system except the one where they'd have gotten away with it.
- Underneath, `fork()` isn't even a first-class syscall anymore: it's a flag configuration of
  **`clone()`**, Linus's generalization where fork, vfork, and threads are all the same verb
  with different sharing masks. The 1987 program is now a degenerate case of a threading API.
- **Roland McGrath** — and here the exam pauses to note he is an old friend of the examiner —
  began writing the **GNU C Library in 1988, one year after this question was posted**, as a
  teenager. Every `printf` in the sixteen processes of the Linux answer flows through stdio
  he architected; glibc's `fork()` wrapper (lock juggling, `pthread_atfork`, resetting the
  child's stdio state) is the reason the buffering trap behaves *predictably* enough to be
  exam material. He also co-wrote the **GNU Hurd**, where `fork()` is not a kernel service at
  all but a **user-space liturgy** — the C library hand-copies the process out of Mach ports
  like a monk transcribing a manuscript — and he long maintained **strace**, which is how a
  modern student checks their answer: `strace -f ./a.out` shows all sixteen souls being born.
  And **GNU make**, for building the thing. The examiner regrets that only one exam question
  can be dedicated to him at a time.
- **Xavier Leroy** built LinuxThreads on `clone()`; **Ulrich Drepper** and **Ingo Molnar**
  replaced it with NPTL. Irrelevant to this single-threaded program, except doctrinally:
  POSIX decrees `fork()` duplicates *only the calling thread* — a rule whose interactions
  with locks held by the threads that *didn't* survive is the modern era's contribution to
  the race-condition tradition. This program walks past that trap too, by predating threads.
- **Which of the sixteen prints first** is now decided by **Ingo Molnar's CFS** (after the
  O(1) scheduler, after the **Con Kolivas** scheduler wars — a genuine schism, complete with
  a martyr who left kernel development; the personality quirks the question demands are
  amply documented in the LKML archives). There was even a tunable,
  `sched_child_runs_first`, that let you *choose the sermon's ordering* — child-first or
  parent-first — turning the exam's central nondeterminism into a sysctl.
- **The failure mode got an upgrade.** `EAGAIN` on a full process table is now `RLIMIT_NPROC`
  (`ulimit -u`), and the `-1`-counted-as-1 bug in `return(fork() ? 1 : 0)` is preserved,
  bit-for-bit, forty years on. But Linux adds **memory overcommit**: the fork *succeeds*
  optimistically, and if the promises can't be kept, the **OOM killer** (tended over the
  years by **Rik van Riel** and **Andrea Arcangeli**, among others) selects a victim after
  the fact. The Unix tradition of treating an error as just another number has matured into
  treating it as a deferred assassination.
- And the fork bomb this program politely declines to be is now capped by the **cgroups pids
  controller** — on any systemd machine (**Lennart Poettering**, completing the set of names
  guaranteed to start an argument), `TasksMax` decides whether all sixteen processes are even
  permitted to exist. Set it below 16 and the four-bit counter loses bits by administrative
  decree: the first program whose output is truncated by an init system.

So: same sixteen lines, same permutation of 0 through 15, and Linus's own encyclical — **"we
do not break userspace"** — is the reason a 1987 exam question still compiles and runs
correctly on a 2026 kernel. The answer is unchanged; everyone who kept it unchanged deserved
to be named.

### Be concise and to the point

Sixteen processes, sixteen lines, 0 through 15, order unspecified, no compiler was harmed, and
with `vfork` you lose — except on Linux 2.0, where vfork was secretly fork and you won by
accident, until 2.2 restored the losing.

---

*Grade: submitted 39 years past the deadline. Late penalty waived in memoriam — Tom kept the
question safe in* `random code` *for four years and mailed it back like a love letter; the least
the room can do is finally answer it.*

### Why this problem is fun

A good exam question is a **toy with teeth**. This one looks like a one-liner — `fork()` in a
return, four times, done — and then refuses to stay small. It drags in scheduler politics,
stdio buffering folklore, orphan reaping, EAGAIN on a full process table, unspecified evaluation
order that turns out not to matter, and a vfork footgun that turns the whole apparatus into a
brick in the dryer. Every layer is load-bearing; peel one and the next is waiting.

That is the pleasure of it. Unix systems programming at its best is not "learn the syscall
table." It is **watch a ten-line program collide with the real machine** and discover that the
collision is coherent — that sixteen processes really do hold a four-bit counter, that the
compiler excuse is a red herring, that portability across the BSD/System V schism is itself a
miracle worth naming. The question Don posted in 1987 is still a party trick and still a
sermon. Tom mailing it back four years later from `random code` is the other half of the joke:
some homework is too good to grade on time. You keep it, you forward it, you let the next person
try the extra credit and find the brick.