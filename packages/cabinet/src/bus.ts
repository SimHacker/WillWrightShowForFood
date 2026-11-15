/** What a CPU puts on the I/O bus. Devices do not see the ISA. */
export type Iot = {
	device: number;
	pulse: number;
	ac: number;
};

export type IotReply = {
	ac: number;
	skip?: boolean;
};

export type SwitchBinding = {
	readonly name: string;
	read(): boolean | number;
	write(value: boolean | number): void;
	readonly on: boolean | number;
	readonly off: boolean | number;
};

export interface Device {
	readonly name: string;
	/** Device-select codes this box claims. Unclaimed IOTs no-op. */
	readonly iots: readonly number[];
	iot(req: Iot): IotReply;
	tick?(cycles: number): void;
	/**
	 * Cycles until this unit next does something anyone can see: raises a flag, changes `irq`,
	 * writes core, or produces output. The backplane may then make one `tick(n)` for up to that
	 * many cycles instead of n `tick(1)`s, so the two must agree. Infinity: nothing happens until an
	 * IOT, a reset, or something outside the machine touches the unit; the backplane brings it up
	 * to date before each of those. Absent, a unit with `tick` is ticked every cycle. Its power may
	 * then change only through `Cabinet.setPower`.
	 */
	nextEvent?(): number;
	/** True while this device requests an interrupt (its flag is up). */
	irq?(): boolean;
	/** Clear flags. Invoked by CAF and by Cabinet.reset(). */
	reset?(): void;
	/**
	 * The unit's power switch (ARCHITECTURE-AND-LINEAGE.md, "CPUs are devices"). Absent means
	 * always on, which is every device built before the switch existed. Off, the backplane skips
	 * its tick, ignores its irq and routes its IOTs to `offIot` instead of `iot`.
	 */
	power?: boolean;
	/**
	 * What an unpowered unit still answers: whatever is wired to the switch rather than behind it.
	 * Absent means an IOT to a unit that is off no-ops, as if it were unplugged.
	 */
	offIot?(req: Iot): IotReply;
	bindSwitches?(bindings: readonly SwitchBinding[]): void;
}

export type Step = {
	iot?: Iot;
	skip?: boolean;
	halt?: boolean;
};

/** What a CPU sees of the backplane it is plugged into. */
export type Backplane = {
	readonly devices: readonly Device[];
	resetDevices(): void;
	/** Bring the unit on this IOT code up to the current cycle; a CPU that dispatches its own IOTs calls it before each. */
	sync(code: number): void;
};

export interface Cpu {
	power?: boolean;
	/** Called once by the backplane, so a CPU that dispatches IOTs itself can see the devices. */
	attach?(box: Backplane): void;
	readonly wordBits: number;
	readonly coreWords: number;
	pc: number;
	ac: number;
	/** ORed device interrupt requests. Cabinet sets it; the ISA owns what it does. */
	irqLine: boolean;
	reset(): void;
	/** ISA owns PC width. Cabinet never increments pc itself. */
	skip(): void;
	step(): Step;
	read(addr: number): number;
	write(addr: number, word: number): void;
	deposit(addr: number, words: readonly number[]): void;
}
