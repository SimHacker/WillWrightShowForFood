# pdp7-unix's sop.s

`sop.s`, verbatim from [DoctorWkt/pdp7-unix](https://github.com/DoctorWkt/pdp7-unix) commit
`555eb30`, `src/sys/sop.s`: the opcode names PDP-7 UNIX was assembled with. Its first line,
`"** 01-s1.pdf page 62`, is the page of the 1970 listing it was scanned from. The pdp7-unix
README: "The code in the original scans are (c) Micro Focus who own the rights to the Unix source
code. Everything that didn't come from the scanned files is GPLv3."

It is here because `as7` programs are assembled after it: Mitch Bradley's Forth is
`sop.s kernel.s end.s` ([../pdp7forth](../pdp7forth)).
