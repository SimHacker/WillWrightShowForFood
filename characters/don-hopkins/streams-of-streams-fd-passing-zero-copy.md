# Streams of Streams — Passing Handles, and Zero-Copy Across Processes

*A firsthand design-space map by Don. The OS-plumbing behind the "streams of streams / a file
description through a file descriptor" idea — and how you'd gang modular CA layers with no copies.*
[Portrayal standards](../../schemas/portrayal-standards.yml)

## The one idea

Don't move the **data** — move a **reference to a kernel object** (a capability), and let two
processes (and the GPU) point at the *same* thing. A file descriptor, a Mach port right, a Windows
handle, a Binder ref, a dma-buf fd — all the same move: **pass the handle, share the object, copy
nothing.** An fd is itself just a small integer naming a kernel-side **open file *description*** (the
struct with the offset and flags), which in turn points at an inode / pipe / socket / device. So
"passing a file description through a file descriptor" is **indirection through indirection** — and
because the transport (a Unix-domain socket) is itself an fd through which you can send other fds
(pipes, sockets, epoll/io_uring fds…), you get the genuinely recursive **streams of streams**.

## Two different "out of band"s (worth not conflating)

- **Ancillary / control data** — the handle rides *beside* the byte stream in a control message
  (`SCM_RIGHTS`, Mach port descriptors). This is the fd/capability-passing sense.
- **TCP urgent data** (`MSG_OOB`, `SO_OOBINLINE`, `SIGURG`) — a tiny priority side-channel *within* a
  stream. Historically neat, mostly a footgun now; different thing entirely.

## Unix / POSIX / Linux

- **`SCM_RIGHTS` over `AF_UNIX`** (`sendmsg`/`recvmsg` ancillary data) — the canonical fd pass.
  Origin: **4.2/4.3BSD** Unix-domain sockets. Receiver gets a *new* fd to the *same* open file
  description (shared offset). fds can be files, pipes, sockets, devices — even other unix sockets.
- **`memfd_create` + `F_SEAL`** (Linux) — anonymous shared memory *as an fd*, sealable so the
  receiver can trust size/contents. The backbone of **Wayland** buffer sharing and lots of
  browser/graphics IPC.
- **`splice` / `vmsplice` / `tee`** (Linux, Larry McVoy's idea, Linus's impl) — move data between fds
  by **moving page references through a pipe**, not copying bytes. Streams of streams, literally.
- **`dma-buf`** (Linux) — the big one for devices: export a buffer (GPU/camera/codec/display) to an
  **fd**, pass it via `SCM_RIGHTS`, importer maps the *same* physical/device memory. Zero-copy across
  drivers **and** processes. Android's **gralloc/ION → dma-buf**; **`AHardwareBuffer`** is the
  cross-process GPU-buffer handle on top.
- **`process_vm_readv/writev`, `io_uring`** (registered/fixed buffers + fd passing), **udmabuf**,
  **P2PDMA** (peer-to-peer PCIe: GPU↔NIC↔GPU without bouncing through CPU RAM), **GPUDirect RDMA**.
- **Networking zero-copy cousins:** `sendfile`, `MSG_ZEROCOPY`, RDMA/InfiniBand, DPDK, AF_XDP.

## Mach / macOS / iOS (the capability-native one)

- **Mach ports** — a port is a kernel-protected message queue; you hold **port rights** (send,
  receive, send-once). You can **send rights inside messages** (`MACH_MSG_TYPE_MOVE/COPY_SEND`) —
  that's passing a capability process-to-process. This is what people mean by "Mach pipes."
- **Out-of-line memory** in a Mach message — the kernel maps the pages **copy-on-write** into the
  receiver: effectively **zero-copy** for big transfers (no physical copy until someone writes).
- **`fileport`** (`fileport_makeport` / `fileport_makefd`) — wrap a **BSD fd into a Mach port** and
  back, so you can send an fd through Mach messaging. This is the "pass handles between processes on
  the Mac" glue.
- **XPC** — the modern high-level layer over Mach: pass fds (`xpc_fd`), shared memory
  (`xpc_shmem`), and connection **endpoints** between services; **launchd** is the broker.
- **IOSurface** — *the* zero-copy GPU citizen: a kernel-managed, page-aligned image buffer shareable
  **across processes and between CPU & GPU**. Pass an `IOSurfaceRef` (via Mach/XPC), and everyone maps
  the **same physical memory**. Under the hood of **WindowServer** compositing, **VideoToolbox** /
  `CVPixelBuffer`, and **Metal** (`MTLTexture` from an IOSurface). This is exactly "externalized GPU
  resource references between processes for zero-copy direct memory transfer."

## Windows

- **`DuplicateHandle`** — duplicate a kernel **handle** into another process (needs a handle to the
  target process). Handles are Windows' capability tokens.
- **File mappings** (`CreateFileMapping`/`MapViewOfFile`) for named/anonymous shared memory;
  `WriteProcessMemory` for direct cross-process writes.
- **DXGI/D3D shared handles** — `IDXGIResource1::CreateSharedHandle` gives an **NT handle** to a GPU
  texture/surface that other processes/devices/APIs can open. **Vulkan/CUDA external memory &
  semaphores** on Windows import exactly these NT handles.

## The cross-API standard (this is where it converges)

**Vulkan/OpenGL external objects** (`VK_KHR_external_memory` / `_semaphore`, GL `EXT_external_objects`):
**export** device memory or a sync primitive to an **OS handle** — an **fd/dma-buf on Linux**, an **NT
handle on Windows**, a **Mach port / IOSurface on Apple** — and **import** it in another API, device,
or process. **CUDA external memory interop** uses the same handles. So "share this GPU texture with
that process, zero copy" now has a portable recipe: *pick your OS's handle type, export, pass it with
your OS's handle-passing mechanism, import.*

## Android (worth calling out)

- **Binder** — capability/handle IPC: pass object references **and fds** through parcels; the
  **context manager** (servicemanager) is the broker. The mobile embodiment of "pass the handle."
- **ashmem** (shared memory), **ION/gralloc → dma-buf**, **AHardwareBuffer**, **BufferQueue** /
  **SurfaceFlinger** — the display pipeline passes **buffer handles**, never pixels.

## The research lineage (the "why", and where to dig)

- **Object-capability & capability OSes:** Mach ports, **Multics**, **KeyKOS → EROS → seL4**,
  **Capsicum** (FreeBSD capability mode — pass rights, drop ambient authority), **Amoeba** (Tanenbaum,
  distributed capabilities), **Chorus**, **Spring** (Sun; birthplace of **doors**), Solaris **doors**
  (fast RPC that can pass descriptors), **QNX** message passing, **Barrelfish** (multikernel).
  Passing an fd *is* passing a capability — and capabilities dodge the **confused-deputy** problem
  that passing *names/paths* invites.
- **Zero-copy buffering classics:** **fbufs** (Druschel & Peterson — page-remapped network buffers),
  **IO-Lite** (Pai, Druschel, Zwaenepoel — one immutable buffer, shared by reference across every
  subsystem: filesystem, network, app), **container shipping** (Pasquale), **emulated copy / Genie**.
- **Single-address-space OS** (**Opal**, **Mungi**) — if everyone shares one address space, "passing a
  reference" is just… passing a pointer. The limit case of this whole idea.

## The design-space axes (how to reason about any one of these)

1. **Token:** fd · Mach port right · NT handle · Binder ref · dma-buf fd · raw pointer (SAS).
2. **What it names:** open file description · memory region · GPU surface · IPC endpoint · another
   process.
3. **Copy semantics:** copy · **copy-on-write** · **true shared mapping** · **move** (splice steals
   pages).
4. **Mediator:** kernel (`SCM_RIGHTS`, Mach) · broker/nameserver (launchd, Binder ctx mgr, D-Bus).
5. **Namespace:** handles are **process-local integers** → the kernel must **translate** them on
   transfer (rewrite into the receiver's table). Global vs local naming is the crux.
6. **Lifetime/GC:** kernel-object refcounts · send-once rights · seals.
7. **Security:** confinement, least authority, confused-deputy avoidance — the reason to pass a
   *capability* instead of a *name*.

## Why this belongs in the CAM6 story

Ganging **CAM-6 cards as connected layers** — the output plane of one rule feeding the input of the
next — is precisely a **stream of streams**. A modern, modular CAM6 wants the same shape: each
rule/neighborhood layer is a stage that writes a buffer the next stage reads. If that buffer is an
**IOSurface / dma-buf / shared GPU texture**, the layers compose with **zero copies** — the pipeline
passes **handles**, not pixels, exactly like the compositor and video stack already do. The
[TypeScript dataflow / visual programming](cam6-cellular-automata-machine.md) rebuild is a graph of
such stages; this doc is the OS substrate that makes the edges free.

## Quick reference links

fd passing (`SCM_RIGHTS`) · [dma-buf](https://docs.kernel.org/driver-api/dma-buf.html) ·
[memfd_create](https://man7.org/linux/man-pages/man2/memfd_create.2.html) ·
[splice](https://man7.org/linux/man-pages/man2/splice.2.html) ·
[Mach ports overview](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/Mach/Mach.html) ·
[IOSurface](https://developer.apple.com/documentation/iosurface) ·
[XPC](https://developer.apple.com/documentation/xpc) ·
[DuplicateHandle](https://learn.microsoft.com/en-us/windows/win32/api/handleapi/nf-handleapi-duplicatehandle) ·
[DXGI shared handles](https://learn.microsoft.com/en-us/windows/win32/api/dxgi1_2/nf-dxgi1_2-idxgiresource1-createsharedhandle) ·
[VK_KHR_external_memory](https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_external_memory.html) ·
[Capsicum](https://www.cl.cam.ac.uk/research/security/capsicum/) ·
[IO-Lite (OSDI '99)](https://www.usenix.org/legacy/events/osdi99/full_papers/pai/pai.pdf) ·
[seL4](https://sel4.systems/)

*Status: firsthand design map — accurate to the best of Don's knowledge; treat exact API signatures as
pointers to verify against current man pages / SDK docs.*
