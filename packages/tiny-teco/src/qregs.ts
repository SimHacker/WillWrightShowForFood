/** Q-register: numeric value plus optional text (macro / string). */

export type QName = string;

export class QRegister {
	numeric = 0;
	text = "";
}

export class QRegisterBank {
	private readonly regs = new Map<QName, QRegister>();

	#slot(name: QName): QRegister {
		const key = name.length === 1 ? name : name;
		let r = this.regs.get(key);
		if (!r) {
			r = new QRegister();
			this.regs.set(key, r);
		}
		return r;
	}

	get(name: QName): QRegister {
		return this.#slot(name);
	}

	setNumeric(name: QName, n: number): void {
		this.#slot(name).numeric = n;
	}

	setText(name: QName, text: string): void {
		this.#slot(name).text = text;
	}

	names(): QName[] {
		return [...this.regs.keys()].sort();
	}
}
