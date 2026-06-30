#!/usr/bin/env node
/**
 * YAML parse check via scripts/verify-yaml.py (requires PyYAML).
 * Run: pnpm run verify:yaml
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const venvPython = join(repoRoot, '.venv/bin/python');
const python = existsSync(venvPython) ? venvPython : 'python3';
const script = join(repoRoot, 'scripts/verify-yaml.py');

const probe = spawnSync(python, ['-c', 'import yaml'], { encoding: 'utf8' });
if (probe.status !== 0) {
	console.error(
		'verify-yaml FAILED: PyYAML not installed.\n' +
			'  Run: pnpm run setup:python\n' +
			'  Or: pip install -r requirements.txt',
	);
	process.exit(1);
}

const result = spawnSync(python, [script], { stdio: 'inherit', cwd: repoRoot });
process.exit(result.status ?? 1);
