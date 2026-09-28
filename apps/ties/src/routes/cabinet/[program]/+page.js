import { error } from '@sveltejs/kit';
import { PROGRAMS, programById } from '$lib/cabinet-programs.js';

export function entries() {
	return PROGRAMS.map((p) => ({ program: p.id }));
}

export function load({ params }) {
	if (!programById(params.program)) error(404, `no program ${params.program}`);
	return { program: params.program };
}
