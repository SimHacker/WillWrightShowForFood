/**
 * The page's board: each applet publishes its state under its id, and a
 * ```transclude with `follows: <id>` reads it (transclude.js).
 *
 *     cabinet → { program: 'lp370', label: 'LIGHT PEN TEST (1964)' }
 */
import { getContext, setContext } from 'svelte';

const KEY = Symbol('applets');

/** One board per page: a nested article shares its host's. */
export function provideApplets() {
	const existing = getContext(KEY);
	if (existing) return existing;
	const board = $state({});
	setContext(KEY, board);
	return board;
}

export function useApplets() {
	return getContext(KEY) ?? null;
}
