const STORAGE_KEY = 'ebike-safari-selected-trips';

/** Long Aug 5 roundtrip — flood-fill de Pijp showcase ride. */
export const DEFAULT_TRIP_ID = 'badhoevedorp-roundtrip-21bcec00-90ac-11f1-8ad1-a40dbc8fa83a';

export function loadSelectedTripIds(validIds: Set<string>): Set<string> {
	if (typeof localStorage === 'undefined') {
		return defaultSelection(validIds);
	}
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
	return defaultSelection(validIds);
}

function defaultSelection(validIds: Set<string>): Set<string> {
	if (validIds.has(DEFAULT_TRIP_ID)) return new Set([DEFAULT_TRIP_ID]);
	const first = validIds.values().next().value;
	return first ? new Set([first]) : new Set();
}

export function saveSelectedTripIds(ids: Set<string>) {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
	} catch {
		/* quota / private mode */
	}
}
