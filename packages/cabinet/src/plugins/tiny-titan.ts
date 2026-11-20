import type { Device, Iot, IotReply } from "../bus.js";
import { decode, type KorzDevice } from "../korz/iop.js";

const WMASK = 0o777777;

/**
 * The far side of Wiseman's wire, behind a transport-agnostic seam.
 *
 * The PDP-7 polls LSF in a wait loop (WAITLK services the display and
 * keyboard while blocked) — the 1969 polling loop IS the await, so this
 * interface needs no callbacks: an in-process host answers immediately,
 * and a remote host (WebSocket, fetch, anything) sits behind a buffering
 * adapter whose ready() reflects what has actually arrived. Same
 * TitanPort, three deployments: in-browser beside the emulator,
 * in-process on node, or a real server streaming frames.
 *
 * Session vocabulary (TITAN-LINK-PROTOCOL.md): control 4 = start /
 * request headers, 6 = handshake, NAK on checksum failure. The NAK
 * instruction `LLB6 10` (702354) reaches the device as control 0 with
 * AC pre-cleared — the 010 lives in the clear-AC bit, a hardware wink.
 */
export interface TitanPort {
	/** A 6-bit control byte arrives from the PDP-7 (LLB6 / LKE!LLB6). */
	control(code: number): void;
	/** An 18-bit word arrives from the PDP-7 (LLB18). */
	send(word: number): void;
	/** Next 18-bit word for the PDP-7 (LRB18); undefined = none ready. */
	recv(): number | undefined;
	/** A word is waiting — LSF's view, without consuming. */
	ready(): boolean;
	/** LKD — every LTPX exit path disconnects. */
	disconnect(): void;
}

/** Loopback: words come back in sent order; controls are recorded. */
export class EchoPort implements TitanPort {
	queue: number[] = [];
	controls: number[] = [];
	disconnected = false;
	control(code: number): void {
		this.controls.push(code);
	}
	send(word: number): void {
		this.queue.push(word);
	}
	recv(): number | undefined {
		return this.queue.shift();
	}
	ready(): boolean {
		return this.queue.length > 0;
	}
	disconnect(): void {
		this.disconnected = true;
	}
	capture(): EchoPortState {
		return { kind: "echo", queue: this.queue.slice(), controls: this.controls.slice(), disconnected: this.disconnected };
	}
	restore(s: EchoPortState): void {
		this.queue = s.queue.slice();
		this.controls = s.controls.slice();
		this.disconnected = s.disconnected;
	}
}

/**
 * A blocklet-speaking Titan host: the session state machine from the
 * /LTPIX listing (pages 21-24), pure TypeScript, no transport. It
 * serves the 4-word redundantly-checked headers (word 2 is word 1
 * complemented; the PDP requires (w1^w2)+(w3^w4) to be all-ones),
 * decides direction per blocklet, accumulates the same running 18-bit
 * checksum RW does, and answers with it so SAD CKS matches. A header
 * whose count field is zero says "nothing more" — the polite goodbye.
 *
 * This first host listens: each blocklet's count invites the PDP-7 to
 * *write* count words (the first blocklet opens with the 4 stream-heading
 * words PXID, DSBEG, DSEND, SAVINS, then data). What arrives is the PDP's own ring file,
 * recorded per blocklet. Serving files back (direction bit 0o200000)
 * is the same machine with the queue running the other way.
 */
export class BlockletHost implements TitanPort {
	/** Count field per blocklet to request; a trailing 0 is implied. */
	counts: number[];
	controls: number[] = [];
	/** Every RW word received, per blocklet. */
	blocklets: number[][] = [];
	disconnected = false;

	private out: number[] = [];
	private expect = 0;
	private cks = 0;
	private blocklet = 0;

	constructor(counts: number[]) {
		this.counts = counts;
	}

	/** All received words in order — the recorded transfer. */
	get received(): number[] {
		return this.blocklets.flat();
	}

	control(code: number): void {
		this.controls.push(code);
		if (code !== 4) return; // 6 = handshake, 0 = NAK; headers only on 4
		const count = (this.counts[this.blocklet] ?? 0) & 0o17777;
		// Direction bit 0o200000 clear = the PDP writes to Titan.
		// A blocklet carries exactly `count` RW words: the end-of-transfer
		// test's ISZ BSZ pre-increments the complemented count.
		this.out.push(count, count ^ WMASK, 0, 0);
		this.expect = count;
		this.cks = 0;
		if (this.expect > 0) this.blocklets.push([]);
	}

	send(word: number): void {
		if (this.expect === 0) return;
		this.blocklets[this.blocklet]?.push(word);
		this.cks = (this.cks + word) & WMASK;
		this.expect -= 1;
		if (this.expect === 0) {
			this.out.push(this.cks); // RW's SAD CKS reads this next
			this.blocklet += 1;
		}
	}

	recv(): number | undefined {
		return this.out.shift();
	}

	ready(): boolean {
		return this.out.length > 0;
	}

	disconnect(): void {
		this.disconnected = true;
	}

	capture(): BlockletState {
		return {
			kind: "blocklet",
			counts: this.counts.slice(),
			controls: this.controls.slice(),
			blocklets: this.blocklets.map((b) => b.slice()),
			disconnected: this.disconnected,
			out: this.out.slice(),
			expect: this.expect,
			cks: this.cks,
			blocklet: this.blocklet,
		};
	}

	restore(s: BlockletState): void {
		if (s.counts.length !== this.counts.length || s.counts.some((n, i) => n !== this.counts[i])) {
			throw new Error("blocklet counts differ");
		}
		this.controls = s.controls.slice();
		this.blocklets = s.blocklets.map((b) => b.slice());
		this.disconnected = s.disconnected;
		this.out = s.out.slice();
		this.expect = s.expect;
		this.cks = s.cks;
		this.blocklet = s.blocklet;
	}
}

export type EchoPortState = { kind: "echo"; queue: number[]; controls: number[]; disconnected: boolean };

export type BlockletState = {
	kind: "blocklet";
	counts: number[];
	controls: number[];
	blocklets: number[][];
	disconnected: boolean;
	out: number[];
	expect: number;
	cks: number;
	blocklet: number;
};

export type TinyTitanPortState = { kind: "none" } | EchoPortState | BlockletState;

/** A paused link. The queued words and the running checksum are what the next LRB18 reads. */
export type TinyTitanState = {
	flag: boolean;
	enabled: boolean;
	port: TinyTitanPortState;
};

export type TinyTitanOpts = {
	/** No port = the rung-1 stub: LSF always skips, nothing wedges. */
	port?: TitanPort;
};

/**
 * tiny-titan — the Titan link as a cabinet device, claiming 0o22-0o23.
 *
 * IOTs from the SYMELEC listing (no DEC manual documents them; the
 * hardware was Wiseman's custom Cambridge interface). Pulses below are
 * what the device sees after the CPU strips bit 0o10 (clear AC):
 *
 *   702201 LSF        dev 22 pulse 01  skip on link flag
 *   702222 LCF        dev 22 pulse 22  clear link flag
 *   702252 LRB18      dev 22 pulse 42  read word (AC pre-cleared)
 *   702276 LRB18!LLAM dev 22 pulse 66  read word (AC pre-cleared)
 *   702264 LLB18!LLAM dev 22 pulse 64  write word from AC
 *   702301 LSA        dev 23 pulse 01  status skip (exit path)
 *   702322 LKD        dev 23 pulse 22  disconnect (exit path)
 *   702344 LLB6       dev 23 pulse 44  send 6-bit control from AC
 *   702354 LLB6 10    dev 23 pulse 44  NAK: AC cleared, control 0
 *   702364 LKE!LLB6   dev 23 pulse 64  enable link + send control
 *
 * The link ran with interrupts off — WAITLK polls LSF while servicing
 * the display and keyboard by hand — so this device raises no IRQ.
 * Robust-first: with no port attached, LSF and LSA always skip, so a
 * TITAN command against an empty socket cannot wedge the machine.
 *
 * Placement: the link registers are the bus side; `TitanPort` is the seam to the far end,
 * already transport-agnostic. For a run that must replay, a remote port has to stamp each arriving
 * word with the cycle it became ready, not just buffer it. DESIGN.md, "Placement: what can run where".
 */
export class TinyTitan implements Device, KorzDevice {
	readonly name = "tiny-titan";
	readonly iots = [0o22, 0o23];

	port: TitanPort | undefined;
	/** Last operation complete. In-process ports complete instantly. */
	flag = false;
	enabled = false;

	constructor(opts: TinyTitanOpts = {}) {
		this.port = opts.port;
	}

	capture(): TinyTitanState {
		return { flag: this.flag, enabled: this.enabled, port: this.portState() };
	}

	restore(s: TinyTitanState): void {
		this.restorePort(s.port);
		this.flag = s.flag;
		this.enabled = s.enabled;
	}

	private portState(): TinyTitanPortState {
		if (!this.port) return { kind: "none" };
		if (this.port instanceof EchoPort) return this.port.capture();
		if (this.port instanceof BlockletHost) return this.port.capture();
		throw new Error("no snapshot for this titan port");
	}

	private restorePort(s: TinyTitanPortState): void {
		if (s.kind === "none") {
			if (this.port) throw new Error("tiny-titan port differs");
			return;
		}
		if (s.kind === "echo") {
			if (!(this.port instanceof EchoPort)) throw new Error("tiny-titan port differs");
			this.port.restore(s);
			return;
		}
		if (!(this.port instanceof BlockletHost)) throw new Error("tiny-titan port differs");
		this.port.restore(s);
	}

	private linkReady(): boolean {
		if (!this.port) return true; // stub: never leave a flag hanging
		return this.flag || this.port.ready();
	}

	iot(req: Iot): IotReply {
		let ac = req.ac;
		let skip = false;
		if (req.device === 0o22) {
			if (req.pulse === 0o01) skip = this.linkReady(); // LSF
			if (req.pulse === 0o22) this.flag = false; // LCF
			if (req.pulse === 0o42 || req.pulse === 0o66) {
				// LRB18 (!LLAM) — the CPU cleared AC via bit 0o10
				ac |= this.port?.recv() ?? 0;
				this.flag = true;
			}
			if (req.pulse === 0o64) {
				// LLB18!LLAM
				this.port?.send(ac & WMASK);
				this.flag = true;
			}
		} else {
			if (req.pulse === 0o01) skip = this.linkReady(); // LSA
			if (req.pulse === 0o22) {
				// LKD
				this.port?.disconnect();
				this.enabled = false;
				this.flag = false;
			}
			if (req.pulse === 0o44 || req.pulse === 0o64) {
				// LLB6 (LKE!LLB6 also enables)
				if (req.pulse === 0o64) this.enabled = true;
				this.port?.control(ac & 0o77);
				this.flag = true;
			}
		}
		return { ac, skip };
	}

	/** The link decodes exact pulse codes, not timed gates: every other pulse on 22 and 23 does nothing. */
	korzSlots() {
		return [
			decode(0o22, "tiny titan 22: other pulses do nothing", () => {}),
			decode(0o22, "tiny titan LSF: skip when the link is ready", (c) => { if (this.linkReady()) c.skip = 1; }, 0o01),
			decode(0o22, "tiny titan LCF: clear the flag", () => { this.flag = false; }, 0o22),
			decode(0o22, "tiny titan LRB18: a word from the link into AC", (c) => {
				c.ac |= this.port?.recv() ?? 0;
				this.flag = true;
			}, [0o42, 0o66]),
			decode(0o22, "tiny titan LLB18: AC to the link", (c) => {
				this.port?.send(c.ac & WMASK);
				this.flag = true;
			}, 0o64),
			decode(0o23, "tiny titan 23: other pulses do nothing", () => {}),
			decode(0o23, "tiny titan LSA: skip when the link is ready", (c) => { if (this.linkReady()) c.skip = 1; }, 0o01),
			decode(0o23, "tiny titan LKD: disconnect", () => {
				this.port?.disconnect();
				this.enabled = false;
				this.flag = false;
			}, 0o22),
			decode(0o23, "tiny titan LLB6: AC<12:17> to the link as control", (c) => {
				this.port?.control(c.ac & 0o77);
				this.flag = true;
			}, 0o44),
			decode(0o23, "tiny titan LKE LLB6: enable, then control", (c) => {
				this.enabled = true;
				this.port?.control(c.ac & 0o77);
				this.flag = true;
			}, 0o64),
		];
	}

	reset(): void {
		this.flag = false;
		this.enabled = false;
	}
}
