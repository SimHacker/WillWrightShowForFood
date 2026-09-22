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
}

export type Step = {
	iot?: Iot;
	skip?: boolean;
	halt?: boolean;
};

export interface Cpu {
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
