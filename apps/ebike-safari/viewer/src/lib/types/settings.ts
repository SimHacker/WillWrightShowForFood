export type LocationMode = 'gps' | 'manual' | 'off';

export type AppSettings = {
	locationMode: LocationMode;
	followUser: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
	locationMode: 'gps',
	followUser: true
};
