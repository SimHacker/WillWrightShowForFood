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
	console.warn('verify-yaml SKIPPED: PyYAML not installed. Run: pnpm run setup:python');
	process.exit(0);
}

const result = spawnSync(python, [script], { stdio: 'inherit', cwd: repoRoot });
process.exit(result.status ?? 1);
