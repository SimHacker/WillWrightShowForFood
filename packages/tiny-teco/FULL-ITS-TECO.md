# Full ITS TECO — runbook

Nobody has rewritten ITS TECO in JavaScript. The source is
[`reference/its/TECO.MID`](reference/its/TECO.MID) (MIDAS, `_TECO_; TECO 1213`).
The environment is ITS. A complete port is a project, not a weekend.

This file is the scope and the three honest paths. The growing engine
stays [`src/`](src/). The MIDAS stays a reference.

## What "full" means

ITS TECO is not a 30-opcode editor. Version 1213 is **23,450 lines** of
MIDAS. TECORD 1132 (5 August 1981) is a **5,253-line** command list.
About **247 `FS` flags**. A 128-slot command dispatch (`DTB`). `^R`
real-time mode — that *is* EMACS. File I/O on ITS names and Twenex
JSYS. Display, SUPDUP, journals, purify, EJ dumped environments.

The 318-byte Minsky mail uses a handful of those. "Full" is being able
to boot TECO, load EMACS macros, and edit. That is the whole thing.

## What we just parked

| File | What | Why it is here |
|------|------|----------------|
| [`reference/its/TECO.MID`](reference/its/TECO.MID) | 692,642 bytes, MIDAS | The source. ITS name `TECO 1213`. |
| [`reference/its/TECORD.1132`](reference/its/TECORD.1132) | command list, 1981-08-05 | The spec. Same year as the UTM mail. |
| [`reference/its/teco.error`](reference/its/teco.error) | `CMD`, `SFL`, `IQN`, … | Error codes the engine should throw. |
| [`reference/its/SOURCES.yml`](reference/its/SOURCES.yml) | pin + license note | `PDP-10/its` `0f7d6799`. |

Header of `TECO.MID`: communal co-operation, send changes to MIT to
merge. Do not relicense. Do not edit the MIDAS to "make it TypeScript."

1213 is **1985** (GZ edit of 1210). The mail is **11 March 1981**.
TECORD 1132 is the closer spec for that year. A 1981 object file still
wants ToTS / `AI:TECO;` — same method as the UTM ask.

## Line-share of TECO.MID (1213)

| Lines | % | What |
|------:|--:|------|
| 4300 | 18% | bootstrap, ACs, ITS/Twenex conditionals, variables |
| 3410 | 15% | `^R` mode (dispatch, redisplay, echo, args) |
| 7826 | 33% | core commands, gap buffer, Q-regs, search, `F` / `FS` |
| 3374 | 14% | file I/O (ITS names + Twenex) |
| 3660 | 16% | display, terminals, interrupts |
| 880 | 4% | `DTB` and initial strings |

A "command interpreter" is the middle third. A "full ITS TECO" is all
six rows.

## Three paths

### A — Grow `@wwsff/tiny-teco` (this package)

Independent implementation. `CommandTable` + `UnimplementedCommandError`.
Oracle: the same `.teco` on real ITS (path B) and here.

Do **not** translate MIDAS line by line. Read TECORD, write a command,
add a test that fails on SIMH if we diverge.

| Layer | What | Honest size | Need for the UTM mail |
|------:|------|-------------|------------------------|
| 0 | subset already here (`I J C D S <> ; "E Q U :I X L A M HT HK = ^^`) | done | yes |
| 1 | finish the mail: `nR` search-replace loops, exact `M^]Q`, iteration edge cases, `0` as halt | days | yes |
| 2 | rest of the single-letter command language (`K T L W N O G` …), args, `"N "L "C "G`, `F=` `FB` | 4–8 weeks | no |
| 3 | files as a virtual ITS (`ER EW EI EY EG`, FN1 FN2) | 2–4 weeks | no |
| 4 | `FS` flags: stub the 247, implement the ones macros read | 4–8 weeks to stub+the used set; months to be real | no |
| 5 | `^R` mode | 6–12 months | no |
| 6 | display / terminals / mode line | 3–6 months | no |
| 7 | EJ / purify / dumped EMACS | 2–4 months after 5 | no |

**Layer 0–2, one person who already knows TECO: a couple of months.**
That is a TECO you can program, not EMACS.

**Layers 0–7: one and a half to three years.** That is "full ITS TECO
in TypeScript." Same order as writing a small Emacs.

Stop at the layer you can test. The extension point is already
`table.register`. The fail is already `UnimplementedCommandError(code, pc)`.

### B — Compile nothing. Boot ITS.

[`PDP-10/its`](https://github.com/PDP-10/its) + SIMH (or KLH10). Real
`TECO`, real `TECO 1213`, real EMACS. A weekend to follow their
README if you have already built ITS once; a few days the first time.

This is the **honest full TECO**. It is not in the browser. It is the
oracle for path A.

```
# after their build
:tECO
```

Feed [`minsky-utm.teco`](../../characters/marvin-minsky/sources/teco-utm/minsky-utm.teco)
once the subset claims it runs. If ITS TECO and `@wwsff/tiny-teco` disagree
on the 1,870-step halt, the TypeScript is wrong.

### C — ITS on a JS PDP-10

[SAILDART j5](https://www.saildart.org/j5/) did this for **WAITS**.
That was a multi-year reconstruction (CPU, devices, filesystem, then
the OS). ITS is a different OS with a different I/O world.

[paulnank/pdp10-js](https://github.com/paulnank/pdp10-js) is a KI10
and TOPS-10. Not ITS.

This path is: finish or fork a JS KA10/KL10 that can run the ITS
reconstruction, then type `:tECO`. **A project measured in years**,
same sentence as before. Do not start it to run a 318-byte mail.

## Wrong path

Compile [TECOC](https://github.com/blakemcbride/TECOC) or TECO-64 to
WASM. That is the DEC / TECO-C lineage. `M^]Q`, `nA` as
ASCII-of-character, and `^^` as byte `0x1E` will not mean what the
mail means. Tempting. Wrong dialect.

## The method: work backwards from the software you want to run

Same rule here as in [`packages/cabinet`](../cabinet/DESIGN.md)'s PDP-7,
discovered twice in one week, so write it down once:

**The artifact is the spec. The manual is the appendix.** Inventory the
target first — grep the corpus for every command / opcode / IOT it actually
uses — then implement exactly that set. Lazy opcode implementation, instance
first, generated on demand just in time.

- TinyTeco implements the commands **Minsky's 1981 mail** uses; TECORD's
  hundreds of others wait until a corpus line needs them.
- The cabinet's PDP-7 implements what **SYMELEC** issues: the OPR ops it
  uses ~280 times, the ~11 EAE words present, ten IOT devices, only the
  display words in its display file. Measured from the listing's octal, not
  chosen from F-75.

Two guardrails make lazy safe instead of sloppy:

1. **Unknowns fail loudly** — throw the TECORD code, log the unheard-of
   display word — *except* where the real machine defined silence
   (undefined PDP-7 IOTs no-op in hardware; so they no-op here). Gaps
   announce themselves at runtime instead of corrupting silently.
2. **The corpus is the regression suite.** Every growth step re-runs the
   artifact that defined the scope. If the Minsky mail or the SYMELEC boot
   stops working, the new opcode is wrong, whatever the manual says.

Corollary: porting effort scales with the *program you love*, not with the
*machine it ran on*. That is why TinyTeco is a weekend and full ITS TECO is
years — and why a PDP-7 that runs PIXIE is a weekend while SIMH is a career.

## How to grow path A without drowning

1. Keep TECORD 1132 open. One command = one test = one
   `table.register`.
2. Throw the **TECORD / `teco.error` code** (`CMD`, `SFL`, `IQN`),
   not a sentence.
3. After each command, run the Minsky mail. It must keep working.
4. When a command needs ITS (filenames, `FS TTY`, `^R` redisplay),
   stub the flag and write the stub in the test. Do not fake success.
5. Quarterly: boot path B and diff a corpus. The corpus starts as
   `minsky-utm.teco` plus tiny TECORD examples.

Suggested next ten (after the mail is green on both engines):

`R` (back), `K`, `nT`, `nL` / `:L`, `W`, `O` / `F;`, `"N "L "C`,
`F=`, `FB`, `FQ`, `[` `]` Q-reg PDL.

Then stop and ask whether anyone needs `^R`.

## What we will not do from this runbook

- Translate 23k lines of MIDAS into TypeScript.
- Vendor TECOC.
- Claim the subset is ITS TECO.

↑ [`README.md`](README.md) · [`GLANCE.yml`](GLANCE.yml) · [UTM room](../../characters/marvin-minsky/sources/teco-utm/teco-in-javascript.md)
