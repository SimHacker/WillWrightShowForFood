import type { Device, Iot, IotReply } from "../bus.js";

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
 * *write* count+1 words (4 stream-heading words first — PXID, DSBEG,
 * DSEND, SAVINS — then data). What arrives is the PDP's own ring file,
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
}

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
 */
export class TinyTitan implements Device {
	readonly name = "tiny-titan";
	readonly iots = [0o22, 0o23];

	port: TitanPort | undefined;
	/** Last operation complete. In-process ports complete instantly. */
	flag = false;
	enabled = false;

	constructor(opts: TinyTitanOpts = {}) {
		this.port = opts.port;
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

	reset(): void {
		this.flag = false;
		this.enabled = false;
	}
}
