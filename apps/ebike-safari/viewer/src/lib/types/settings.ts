export type LocationMode = 'gps' | 'manual' | 'off';

export type AppSettings = {
	locationMode: LocationMode;
	followUser: boolean;
	/** Speech in/out (synthesis + recognition). Off by default; opt in via Settings. */
	speechEnabled: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
	locationMode: 'gps',
	followUser: true,
	speechEnabled: false
};
