/** 42 → "42s", 725 → "12m 05s", 4490 → "1h 14m". */
export function formatDuration(totalS: number): string {
	const s = Math.max(0, Math.round(totalS));
	if (s < 60) return `${s}s`;
	const m = Math.floor(s / 60);
	if (m < 60) return `${m}m ${String(s % 60).padStart(2, '0')}s`;
	const h = Math.floor(m / 60);
	return `${h}h ${String(m % 60).padStart(2, '0')}m`;
}
