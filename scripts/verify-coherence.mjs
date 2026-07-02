#!/usr/bin/env node
/**
 * Coherence checks beyond YAML parse — character registry, show seeds, memorial shape.
 * Run: pnpm run verify:coherence
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const warnings = [];

const NON_GUEST_DIRS = new Set([
	'don-hopkins',
	'will-wright',
	'don-philahue',
	'slats',
	'palm',
	'ultimate-machine',
	'_TEMPLATE',
]);

function fail(msg) {
	failures.push(msg);
}

function warn(msg) {
	warnings.push(msg);
}

function readGuestsFromIndex() {
	const index = readFileSync(join(repoRoot, 'characters/INDEX.yml'), 'utf8');
	const slugs = [];
	const entries = new Map();
	let inGuests = false;
	for (const line of index.split('\n')) {
		if (line.startsWith('guests:')) {
			inGuests = true;
			continue;
		}
		if (inGuests && /^[a-z_]+:/.test(line) && !line.startsWith('  ')) break;
		if (!inGuests) continue;
		const m = line.match(/^  ([a-z0-9-]+):\s*(.*)$/);
		if (m) {
			slugs.push(m[1]);
			entries.set(m[1], m[2]);
		}
	}
	return { index, slugs, entries };
}

function showSeedForEntry(block) {
	const m = block.match(/show_seed:\s*([^,}\s]+)/);
	return m ? m[1].replace(/^["']|["']$/g, '') : null;
}

function isMemorialEntry(block) {
	return /invitation_status:\s*memorial/.test(block);
}

const { slugs: guestSlugs, entries } = readGuestsFromIndex();

for (const slug of guestSlugs) {
	const dir = join(repoRoot, 'characters', slug);
	if (!existsSync(dir)) {
		fail(`characters/INDEX.yml guest '${slug}' — missing directory characters/${slug}/`);
		continue;
	}
	for (const f of ['CHARACTER.yml', 'README.md']) {
		if (!existsSync(join(dir, f))) fail(`characters/${slug}/ missing ${f}`);
	}

	const block = entries.get(slug) || '';
	if (isMemorialEntry(block) && !existsSync(join(dir, 'memorial.md'))) {
		fail(`memorial guest characters/${slug}/ missing memorial.md`);
	}

	const seed = showSeedForEntry(block);
	if (seed && seed.includes('#')) continue;
	if (seed && !existsSync(join(repoRoot, seed))) {
		const severity = isMemorialEntry(block) ? fail : warn;
		severity(`show_seed missing on disk: ${seed} (characters/${slug})`);
	}
}

for (const entry of readdirSync(join(repoRoot, 'characters'))) {
	if (entry.startsWith('.') || NON_GUEST_DIRS.has(entry)) continue;
	const p = join(repoRoot, 'characters', entry);
	if (!statSync(p).isDirectory()) continue;
	if (!guestSlugs.includes(entry)) {
		warn(`characters/${entry}/ exists but is not listed under guests: in INDEX.yml`);
	}
}

const rememberingSeeds = readdirSync(join(repoRoot, 'repo-shows')).filter((f) => f.startsWith('remembering-') && f.endsWith('.yml'));
for (const file of rememberingSeeds) {
	const y = readFileSync(join(repoRoot, 'repo-shows', file), 'utf8');
	const subject = y.match(/subject:\s*([a-z0-9-]+)/)?.[1];
	if (subject && !existsSync(join(repoRoot, 'characters', subject, 'memorial.md'))) {
		fail(`${file} memorial subject '${subject}' — missing characters/${subject}/memorial.md`);
	}
}

for (const rel of [
	'characters/jef-raskin/CHARACTER.yml',
	'characters/jef-raskin/memorial.md',
	'repo-shows/remembering-jef-raskin.yml',
]) {
	if (!existsSync(join(repoRoot, rel))) fail(`jef-raskin coherence: missing ${rel}`);
}

if (warnings.length) {
	console.warn('verify-coherence warnings:\n' + warnings.map((w) => `  ⚠ ${w}`).join('\n') + '\n');
}

if (failures.length) {
	console.error('verify-coherence FAILED:\n' + failures.map((f) => `  ✗ ${f}`).join('\n'));
	process.exit(1);
}

console.log(`verify-coherence OK (${guestSlugs.length} guests, ${rememberingSeeds.length} remembering seeds)`);
