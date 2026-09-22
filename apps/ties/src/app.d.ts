/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface Locals {
			user: { id: string; username: string; displayName: string } | null;
		}
	}
}

export {};
