# Apple II FujiNet bridge

[Apple2 emulator stack](apple2-emulator-stack.md) · [Thomas Cherryhomes ideas §23](../characters/thomas-cherryhomes/ideas.md)

---

## The hook

Three-phase plan: how Apple II emulation connects to FujiNet (TNFS, lobby, N:) across hardware, native emulator, and browser — **without betting on AppleWin WASM.**

**Decision:** AppleWin+SPoverSLIP+FujiNet-PC for FujiNet-native dev/CI. **apple2js** for browser hackability. WASM FujiNet = sidecar (server FujiNet-PC + WebSocket shim).

## Three tracks

| Track | Stack | Use when |
|-------|-------|----------|
| Hardware | Real Apple II + FujiNet ESP32 | Shows, real wire, Thomas demo |
| Native | AppleWin linux + SPoverSLIP + FujiNet-PC | CI, local test, show without hardware |
| Browser | apple2js + sidecar FujiNet | Bots, character bridge organelles |

Guest: Thomas Cherryhomes — discuss P1–P8 before IA pitch.

## Show hooks

- **Real wire segment:** Hardware track on stream with FujiNet lobby.
- **Browser bridge demo:** apple2js + sidecar pattern.

↑ [process index](README.md) · Girder: `apple2-fujinet-bridge.yml`
