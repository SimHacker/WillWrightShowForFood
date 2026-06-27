#!/usr/bin/env node
/**
 * Wrapper for generate-markup-facades.py (PyYAML).
 * Run: pnpm run facades | pnpm run facades:check
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const venvPython = join(repoRoot, '.venv/bin/python');
const python = existsSync(venvPython) ? venvPython : 'python3';
const script = join(repoRoot, 'scripts/generate-markup-facades.py');
const args = process.argv.slice(2);

const probe = spawnSync(python, ['-c', 'import yaml'], { encoding: 'utf8' });
if (probe.status !== 0) {
	console.warn('facades SKIPPED: PyYAML not installed. Run: pnpm run setup:python');
	process.exit(0);
}

const result = spawnSync(python, [script, ...args], { stdio: 'inherit', cwd: repoRoot });
process.exit(result.status ?? 1);
