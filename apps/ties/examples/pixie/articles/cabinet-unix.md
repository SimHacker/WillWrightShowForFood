---
title: UNIX v0 on the cabinet
synonyms:
  - cabinet-unix
definition: "PDP-7 UNIX, 1969, booting from an emulated RB09 disk in this page. Log in as ken, password ken."
---

Thompson and Ritchie's first UNIX, as the pdp7-unix project rebuilt it from the listings, booted the way the Bell Labs machine booted it: a paper-tape bootstrap reads the system off track 180 of an RB09 fixed-head disk. See ~UNIX v0~ for how the disk was emulated.

**Log in.** Click the teletype paper so it has the keyboard, type `ken`, Return, and `ken` again for the password. The prompt is `@`. Try `ls`, `ls system`, `date`, `cat sys.rc`. Type in lower case: this keyboard is SIMH's `set tti unix`, the one the restoration used. The KSR-33 is half duplex, so it prints your password too. ^C sends ALT MODE, UNIX v0's interrupt.

**The disk.** Files you write stay on the platter when you pull 🔄 and reboot, until you reload the page.

**Demo** reboots and logs in as ken to look around.
