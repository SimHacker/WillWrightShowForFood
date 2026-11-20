/** A snapshot is a directory of named files. This is that directory in memory. */

export class MemoryStore {
	readonly files = new Map<string, Uint8Array>();

	put(path: string, data: Uint8Array | string): void {
		const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data.slice();
		this.files.set(path, bytes);
	}

	has(path: string): boolean {
		return this.files.has(path);
	}

	get(path: string): Uint8Array | undefined {
		const bytes = this.files.get(path);
		return bytes ? bytes.slice() : undefined;
	}

	text(path: string): string {
		const bytes = this.files.get(path);
		if (!bytes) throw new Error(`snapshot has no ${path}`);
		return new TextDecoder().decode(bytes);
	}
}
