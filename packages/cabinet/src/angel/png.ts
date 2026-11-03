/**
 * PNG in and out for screen angel templates and captures: 8-bit grey, grey+alpha, RGB, RGBA or
 * palette, not interlaced. Inflate and deflate come from the platform's CompressionStream, so
 * the same code runs in Node and in the browser.
 */

/** An RGBA picture, rows top to bottom; the same layout as canvas ImageData. */
export interface Picture {
	width: number;
	height: number;
	data: Uint8Array | Uint8ClampedArray;
}

const SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
	const out = new Response(new Response(bytes as unknown as ArrayBuffer).body!.pipeThrough(stream));
	return new Uint8Array(await out.arrayBuffer());
}

const be32 = (b: Uint8Array, i: number) => ((b[i]! << 24) | (b[i + 1]! << 16) | (b[i + 2]! << 8) | b[i + 3]!) >>> 0;

export async function decodePng(png: Uint8Array): Promise<Picture> {
	if (!SIGNATURE.every((v, i) => png[i] === v)) throw new Error("not a PNG");
	let width = 0;
	let height = 0;
	let depth = 0;
	let colour = 0;
	let palette: Uint8Array | null = null;
	let alphas: Uint8Array | null = null;
	const idat: Uint8Array[] = [];
	for (let i = 8; i < png.length; ) {
		const len = be32(png, i);
		const type = String.fromCharCode(...png.subarray(i + 4, i + 8));
		const data = png.subarray(i + 8, i + 8 + len);
		if (type === "IHDR") {
			width = be32(data, 0);
			height = be32(data, 4);
			depth = data[8]!;
			colour = data[9]!;
			if (data[12]) throw new Error("interlaced PNG");
		} else if (type === "PLTE") palette = data;
		else if (type === "tRNS") alphas = data;
		else if (type === "IDAT") idat.push(data);
		else if (type === "IEND") break;
		i += 12 + len;
	}
	if (depth !== 8) throw new Error(`PNG depth ${depth}; only 8 bits per channel`);
	const channels = ({ 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 } as Record<number, number>)[colour];
	if (!channels) throw new Error(`PNG colour type ${colour}`);
	const joined = new Uint8Array(idat.reduce((n, d) => n + d.length, 0));
	idat.reduce((at, d) => (joined.set(d, at), at + d.length), 0);
	const raw = await pipe(joined, new DecompressionStream("deflate"));
	const stride = width * channels;
	const rows = new Uint8Array(stride * height);
	for (let y = 0; y < height; y++) {
		const filter = raw[y * (stride + 1)]!;
		const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
		const out = rows.subarray(y * stride, (y + 1) * stride);
		const up = y ? rows.subarray((y - 1) * stride, y * stride) : null;
		for (let x = 0; x < stride; x++) {
			const a = x >= channels ? out[x - channels]! : 0;
			const b = up ? up[x]! : 0;
			const c = up && x >= channels ? up[x - channels]! : 0;
			let v = line[x]!;
			if (filter === 1) v += a;
			else if (filter === 2) v += b;
			else if (filter === 3) v += (a + b) >> 1;
			else if (filter === 4) {
				const p = a + b - c;
				const pa = Math.abs(p - a);
				const pb = Math.abs(p - b);
				const pc = Math.abs(p - c);
				v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
			}
			out[x] = v & 255;
		}
	}
	const rgba = new Uint8Array(width * height * 4);
	for (let p = 0; p < width * height; p++) {
		const s = rows.subarray(p * channels, (p + 1) * channels);
		const o = p * 4;
		if (colour === 3) {
			const k = s[0]!;
			rgba[o] = palette?.[k * 3] ?? 0;
			rgba[o + 1] = palette?.[k * 3 + 1] ?? 0;
			rgba[o + 2] = palette?.[k * 3 + 2] ?? 0;
			rgba[o + 3] = alphas?.[k] ?? 255;
		} else if (channels <= 2) {
			rgba[o] = rgba[o + 1] = rgba[o + 2] = s[0]!;
			rgba[o + 3] = channels === 2 ? s[1]! : 255;
		} else {
			rgba[o] = s[0]!;
			rgba[o + 1] = s[1]!;
			rgba[o + 2] = s[2]!;
			rgba[o + 3] = channels === 4 ? s[3]! : 255;
		}
	}
	return { width, height, data: rgba };
}

const CRC = new Int32Array(256).map((_, n) => {
	let c = n;
	for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
	return c;
});

function chunk(type: string, data: Uint8Array): Uint8Array {
	const out = new Uint8Array(12 + data.length);
	const view = new DataView(out.buffer);
	view.setUint32(0, data.length);
	for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
	out.set(data, 8);
	let c = -1;
	for (const x of out.subarray(4, 8 + data.length)) c = CRC[(c ^ x) & 255]! ^ (c >>> 8);
	view.setUint32(8 + data.length, (c ^ -1) >>> 0);
	return out;
}

/** RGBA, unfiltered rows; small templates and frames, so plain is fine. */
export async function encodePng(p: Picture): Promise<Uint8Array> {
	const stride = p.width * 4;
	const raw = new Uint8Array((stride + 1) * p.height);
	for (let y = 0; y < p.height; y++) raw.set(p.data.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
	const ihdr = new Uint8Array(13);
	new DataView(ihdr.buffer).setUint32(0, p.width);
	new DataView(ihdr.buffer).setUint32(4, p.height);
	ihdr[8] = 8;
	ihdr[9] = 6;
	const parts = [new Uint8Array(SIGNATURE), chunk("IHDR", ihdr), chunk("IDAT", await pipe(raw, new CompressionStream("deflate"))), chunk("IEND", new Uint8Array())];
	const out = new Uint8Array(parts.reduce((n, b) => n + b.length, 0));
	parts.reduce((at, b) => (out.set(b, at), at + b.length), 0);
	return out;
}

/** The rectangle (x, y, w, h) of a picture, clipped to it. */
export function crop(p: Picture, x: number, y: number, w: number, h: number): Picture {
	const x0 = Math.max(0, x);
	const y0 = Math.max(0, y);
	const x1 = Math.min(p.width, x + w);
	const y1 = Math.min(p.height, y + h);
	const out = new Uint8Array(Math.max(0, x1 - x0) * Math.max(0, y1 - y0) * 4);
	for (let yy = y0; yy < y1; yy++) out.set(p.data.subarray((yy * p.width + x0) * 4, (yy * p.width + x1) * 4), (yy - y0) * (x1 - x0) * 4);
	return { width: x1 - x0, height: y1 - y0, data: out };
}
