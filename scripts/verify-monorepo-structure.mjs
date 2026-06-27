#!/usr/bin/env node
/**
 * Structural assertions for WillWrightShowForFood polyglot monorepo.
 * Run: pnpm run verify:structure
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function check(label, fn) {
	try {
		fn();
	} catch (err) {
		failures.push(`${label}: ${err.message}`);
	}
}

function mustExist(rel) {
	const abs = join(repoRoot, rel);
	if (!existsSync(abs)) throw new Error(`missing ${rel}`);
}

check('root manifests', () => {
	for (const f of ['MOOLLM.yml', 'CARD.yml', 'GLANCE.yml', 'README.md', 'SETUP.md', 'package.json', 'pnpm-workspace.yaml']) {
		mustExist(f);
	}
});

check('moollm microworld dirs', () => {
	for (const d of ['repo-shows', 'characters', 'kernel', 'schemas', 'process', 'skills']) {
		mustExist(d);
	}
});

check('monorepo dirs', () => {
	for (const d of ['apps', 'packages', 'scripts']) {
		mustExist(d);
	}
});

check('workspace packages have package.json', () => {
	const ws = readFileSync(join(repoRoot, 'pnpm-workspace.yaml'), 'utf8');
	if (!ws.includes('apps/*') || !ws.includes('packages/*')) {
		throw new Error('pnpm-workspace.yaml must declare apps/* and packages/*');
	}
	for (const entry of readdirSync(join(repoRoot, 'packages'))) {
		const entryPath = join(repoRoot, 'packages', entry);
		if (!statSync(entryPath).isDirectory()) continue;
		const pkgPath = join(entryPath, 'package.json');
		if (!existsSync(pkgPath)) {
			throw new Error(`packages/${entry}/ missing package.json`);
		}
	}
});

check('will-wright show bundle', () => {
	mustExist('repo-shows/will-wright/SHOW.yml');
	mustExist('repo-shows/will-wright/invitation.md');
});

if (failures.length) {
	console.error('verify-monorepo-structure FAILED:\n' + failures.map((f) => `  ✗ ${f}`).join('\n'));
	process.exit(1);
}

console.log('verify-monorepo-structure OK');
