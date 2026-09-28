---
title: UNIX v0
synonyms:
  - unix
  - pdp-7 unix
  - unixv0
  - rb09
definition: "Thompson and Ritchie's 1969 PDP-7 UNIX, booting on the emulator from an emulated RB09 disk: log in as ken and type ls."
---

The Bell Labs PDP-7 that UNIX was written on had a Burroughs fixed-head disk, the RB09. ~The emulator~ now has one too, ported from Open SIMH, and it boots the pdp7-unix project's rebuilt system from the paper-tape bootstrap to `login:` in about 60 milliseconds. Files written to the disk survive a reboot.

The same ~PDP-7~ ran UNIX again in 2019 at the Living Computer Museum, on serial number 129. That machine had a Type 340 and a light pen, like PIXIE's. It had no RB09, so Jeff Kaylin built a disk emulator for it, the JK09, and Josh Dersch wrote it a new driver. Serial 129 is now at the Interim Computer Museum. The page below says who to ask for its disk image.

```transclude
path: packages/cabinet/UNIX-V0.md
```
