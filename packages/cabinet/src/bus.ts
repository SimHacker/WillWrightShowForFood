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

export interface Cpu {
	power?: boolean;
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
