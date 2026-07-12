# XBugTool — Bug #1059974 (input focus trap)

**Date:** 20 May 1991  
**Author:** Don Hopkins (Sun Microsystems)  
**Filed against:** X11/NeWS **server** (not xbugtool — it refuses bugs against itself)

---

## Synopsis

> I have no mouse motion and my input focus is stuck in xbugtool!!!

**Keywords:** I have no mouth and I must scream [Harlan Ellison]  
**Severity / Priority:** 1 / 1

---

## What happened

- TNT and XView apps received **clicks only, no mouse motion**.
- **Input focus trapped in xbugtool** — clicking cmdtool returned focus to xbugtool on release.
- Not using click-to-type.
- Could not drag windows.
- Triggered by filing a bug **against xbugtool itself** after scrolling-list frenzy crashed elmer bug server.
- **X11 input queue lock** — minutes frozen; xbugtool eventually core dumped.

---

## Related

| Item | Link |
|------|------|
| Don's xbugtool rant | [unix-haters/x-windows/xbugtool.html](http://www.art.net/~hopkins/Don/unix-haters/x-windows/xbugtool.html) |
| OLWM server grab RFE | Bug #1059370 — root menu grabs server, queues client output |
| X-Windows Disaster ch. | [medium.com/@donhopkins/the-x-windows-disaster-128d398ebd47](https://donhopkins.medium.com/the-x-windows-disaster-128d398ebd47) |
| unnatural-selection | [`../../david-rosenthal/05-deskset-weiser-vickie-context.md`](../../david-rosenthal/05-deskset-weiser-vickie-context.md) |
| ICCCM treaty | [`../../david-rosenthal/03-icccm-the-xwindows-treaty.md`](../../david-rosenthal/03-icccm-the-xwindows-treaty.md) |

↑ [don-hopkins sources](README.md) if present
