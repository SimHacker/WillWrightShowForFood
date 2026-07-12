# NFS, NeWS, X11 — standards war and send-code-not-commands

Discussion topics for David Rosenthal — NFS success as X11 consolidation driver; NeWS naming;
NFS 2.0 PostScript-in-kernel; browser/GPU as next telescoping step.

---

## Was X11 standardization a reaction to NFS success?

**Hypothesis:** Sun's **NFS** (1985) made diskless workstations + heterogeneous clients real. A
network-transparent **window protocol** that every vendor could ship beat a Sun-only programmable
desktop (NeWS). Industry aligned on X11 as the lingua franca of networked displays — politics as much
as merit.

**Was renaming SunDew → NeWS painting a target?** Aligning the name with **NFS** / **NeWS** network branding — made it legible as Sun's stack story and maybe made it easier to shoot down as vendor lock-in.

**Ask David + James:** how much was technical vs NFS ecosystem timing vs Sun internal politics?

---



## NFS 2.0 — PostScript in the kernel

Sun explored **NFS 2.0** ideas: **PostScript interpreter in the kernel**; downloading PostScript as
an API to the filesystem — Warnock's **linguistic motherboard** vision extended to distributed computing.

**Browser partial adoption:** JavaScript/HTML/CSS/XML/JSON instead of
PostScript/PostScript/PostScript/PostScript/PostScript — same *shape* (executable content arrives over the wire), different (number of) languages.

**Linux echo:** packet filtering / **eBPF** — scripting in kernel for policy; also **io_uring**.
User asked: *was NFS 2.0 right all along?* Discuss rediscovered, tried, rejected, adapted.

---



## WebGL / WebGPU shaders

Are **GPU shaders in the browser** the next telescoping step of **send code not commands**?


| Era     | What moves over the wire                    |
| ------- | ------------------------------------------- |
| X11     | Requests + property atoms                   |
| NeWS    | PostScript programs                         |
| Web 1.0 | HTML + images                               |
| Web now | WASM, JS bundles, **WGSL/SPIR-V shaders**   |
| MOOLLM  | Skills as inheritable prototypes; yaml jazz |


**Ask David:** does GPU code-as-payload complete the arc NeWS started?

---



## Related

- `[window-systems-lineage.md](window-systems-lineage.md)`
- `[../james-gosling/window-systems-lineage.md](../james-gosling/window-systems-lineage.md)`
- `[../../process/trails/send-code-not-commands.md](../../process/trails/send-code-not-commands.md)`

↑ [00-START-HERE](00-START-HERE.md)