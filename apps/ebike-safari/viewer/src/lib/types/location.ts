export type UserLocation = {
	lat: number;
	lon: number;
	accuracy_m?: number;
	updated_at: string;
	source: 'gps' | 'manual';
};
