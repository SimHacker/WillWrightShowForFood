/**
 * Unix compress(1) decoding: the .Z format that bar used for compressed volumes.
 *
 * Header: 0x1f 0x9d, then one byte whose low five bits are the maximum code width (9 to 16) and
 * whose top bit is block mode (code 256 clears the table). Codes are packed least significant bit
 * first, starting at 9 bits and growing by one each time the table fills a width.
 *
 * The quirk every reimplementation trips on: compress writes codes in groups of eight, so a group
 * of n-bit codes is exactly n bytes. When the width changes, or a clear code arrives, the rest of
 * the current group is padding and has to be skipped. Groups are counted from the start of the
 * data (after the three header bytes) and again from each change.
 */

export const Z_MAGIC = [0x1f, 0x9d] as const;

export function isCompressed(data: Uint8Array): boolean {
	return data.length >= 3 && data[0] === Z_MAGIC[0] && data[1] === Z_MAGIC[1];
}

export function uncompress(data: Uint8Array): Uint8Array {
	if (!isCompressed(data)) throw new Error("not compress(1) data: no 1f 9d magic");
	const flags = data[2] as number;
	const maxBits = flags & 0x1f;
	const blockMode = (flags & 0x80) !== 0;
	if (maxBits < 9 || maxBits > 16) throw new Error(`compress: unsupported maximum code width ${maxBits}`);
	const maxMaxCode = 1 << maxBits;

	const prefix = new Uint16Array(maxMaxCode);
	const suffix = new Uint8Array(maxMaxCode);
	for (let i = 0; i < 256; i++) suffix[i] = i;

	const body = data.subarray(3);
	const totalBits = body.length * 8;
	const out: number[] = [];
	const stack = new Uint8Array(maxMaxCode);

	let nBits = 9;
	let maxCode = (1 << nBits) - 1;
	let freeEnt = blockMode ? 257 : 256;
	let bitPos = 0;
	let groupStart = 0;
	let oldCode = -1;
	let finChar = 0;

	// Skip to the end of the current group of eight codes, measured from groupStart.
	const skipGroup = (): void => {
		const groupBits = nBits * 8;
		const used = bitPos - groupStart;
		const rem = used % groupBits;
		if (rem !== 0) bitPos += groupBits - rem;
		groupStart = bitPos;
	};

	for (;;) {
		if (freeEnt > maxCode && nBits < maxBits) {
			skipGroup();
			nBits += 1;
			maxCode = nBits === maxBits ? maxMaxCode : (1 << nBits) - 1;
		}
		if (bitPos + nBits > totalBits) break;

		const byte = bitPos >> 3;
		const word = (body[byte] ?? 0) | ((body[byte + 1] ?? 0) << 8) | ((body[byte + 2] ?? 0) << 16);
		let code = (word >>> (bitPos & 7)) & ((1 << nBits) - 1);
		bitPos += nBits;

		if (oldCode === -1) {
			if (code >= 256) throw new Error(`compress: first code ${code} is not a literal`);
			finChar = oldCode = code;
			out.push(code);
			continue;
		}

		if (code === 256 && blockMode) {
			skipGroup();
			nBits = 9;
			maxCode = (1 << nBits) - 1;
			freeEnt = 256;
			continue;
		}

		const inCode = code;
		let sp = 0;
		if (code >= freeEnt) {
			if (code > freeEnt) throw new Error(`compress: corrupt input, code ${code} beyond table end ${freeEnt}`);
			stack[sp++] = finChar;
			code = oldCode;
		}
		while (code >= 256) {
			stack[sp++] = suffix[code] as number;
			code = prefix[code] as number;
		}
		finChar = suffix[code] as number;
		stack[sp++] = finChar;
		while (sp > 0) out.push(stack[--sp] as number);

		if (freeEnt < maxMaxCode) {
			prefix[freeEnt] = oldCode;
			suffix[freeEnt] = finChar;
			freeEnt += 1;
		}
		oldCode = inCode;
	}
	return Uint8Array.from(out);
}
