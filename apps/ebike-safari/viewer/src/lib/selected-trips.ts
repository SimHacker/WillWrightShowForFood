const STORAGE_KEY = 'ebike-safari-selected-trips-v4';

/**
 * `?rides=all` or `?rides=<id>,<id>` beats storage; otherwise the saved set; otherwise every ride.
 * Unknown ids are dropped, and a list that drops to nothing falls through to the next source.
 */
export function loadSelectedTripIds(validIds: Set<string>, url?: URL): Set<string> {
	const param = url?.searchParams.get('rides');
	if (param) {
		if (param === 'all') return new Set(validIds);
		const fromUrl = param.split(',').filter((id) => validIds.has(id));
		if (fromUrl.length) return new Set(fromUrl);
	}
	if (typeof localStorage === 'undefined') return new Set(validIds);
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const ids = JSON.parse(raw) as string[];
			const filtered = ids.filter((id) => validIds.has(id));
			if (filtered.length) return new Set(filtered);
		}
	} catch {
		/* private mode / corrupt JSON */
	}
	return new Set(validIds);
}

export function saveSelectedTripIds(ids: Set<string>) {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
	} catch {
		/* quota / private mode */
	}
}
