import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.donhopkins.ebikesafari',
	appName: 'Ebike Safari',
	webDir: 'build',
	server: {
		// Dev on device: point at laptop Vite (see runbooks/02-capacitor-ios.md)
		// url: 'http://192.168.x.x:5173',
		cleartext: true
	}
};

export default config;
