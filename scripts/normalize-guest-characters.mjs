#!/usr/bin/env node
/**
 * Normalize guest characters to uniform baseline (portrayal-standards.yml).
 * Skips: don-hopkins, will-wright, don-philahue, slats.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DON = path.resolve(ROOT, "../DonHopkins");
const CHAR = path.join(ROOT, "characters");

const SKIP = new Set(["don-hopkins", "will-wright", "don-philahue", "slats"]);

function readGuestSlugs() {
	const index = fs.readFileSync(path.join(CHAR, "INDEX.yml"), "utf8");
	const slugs = [];
	let inGuests = false;
	for (const line of index.split("\n")) {
		if (line.startsWith("guests:")) {
			inGuests = true;
			continue;
		}
		if (inGuests && line.match(/^(flagship|host|orchestrator|sidekick|bots):/)) break;
		if (!inGuests) continue;
		const m = line.match(/^  ([a-z0-9-]+):/);
		if (m) slugs.push(m[1]);
	}
	return slugs;
}

function indexEntry(slug) {
	const index = fs.readFileSync(path.join(CHAR, "INDEX.yml"), "utf8");
	const re = new RegExp(`  ${slug}:\\s*\\{([^}]*)\\}`);
	const m = index.match(re);
	if (!m) return { show_seed: `repo-shows/${slug}/`, note: "" };
	const block = m[1];
	const show = block.match(/show_seed:\s*([^,}\s]+)/);
	const note = block.match(/note:\s*"([^"]+)"/);
	return {
		show_seed: show ? show[1] : `repo-shows/${slug}/`,
		note: note ? note[1] : "",
	};
}

function pick(re, text, fallback = "") {
	const m = text.match(re);
	return m ? m[1].trim() : fallback;
}

function loadDonHopkins(slug) {
	const p = path.join(DON, "characters", slug, "CHARACTER.yml");
	if (!fs.existsSync(p)) return null;
	const yml = fs.readFileSync(p, "utf8");
	const glancePath = path.join(DON, "characters", slug, "GLANCE.md");
	let glance = "";
	if (fs.existsSync(glancePath)) {
		glance = fs
			.readFileSync(glancePath, "utf8")
			.trim()
			.split("\n")[0]
			.replace(/^[^\s]+\s*/, "");
	}
	const urls = [...yml.matchAll(/https?:\/\/[^\s"'#]+/g)].map((x) => x[0]);
	const wiki = urls.find((u) => u.includes("wikipedia.org")) || null;
	const web = urls.filter(
		(u) =>
			!u.includes("wikipedia.org") &&
			!u.includes("moollm://") &&
			!u.includes("correspondence"),
	);
	return {
		name: pick(/name:\s*["']?([^"'\n]+)/, yml, slug),
		field: pick(/field:\s*["']?([^"'\n]+)/, yml, ""),
		signifier: pick(/signifier:\s*["']?([^"'\n]+)/, yml, "👤"),
		status: pick(/status:\s*(\w+)/, yml, "living"),
		consent_level: pick(/consent_level:\s*(\d+)/, yml, "3"),
		glance,
		wikipedia: wiki,
		web: [...new Set(web)].slice(0, 8),
	};
}

function titleCase(slug) {
	return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function writeGuest(slug, meta) {
	const dir = path.join(CHAR, slug);
	fs.mkdirSync(dir, { recursive: true });
	const deceased =
		meta.status === "deceased" ||
		meta.signifier.includes("🕯") ||
		["marvin-minsky", "seymour-papert", "jean-piaget"].includes(slug);
	const invStatus = deceased ? "legacy_only" : "draft";
	const consentLevel = deceased ? 5 : meta.consent_level || 3;
	const esc = (s) => (s || "").replace(/"/g, '\\"').slice(0, 500);

	const characterYml = `# ${meta.name} — invitation portrayal. NOT ${meta.name}.
# Standards: ../../schemas/portrayal-standards.yml

character:
  id: ${slug}
  name: "${esc(meta.name)}"
  type: invitation
  signifier: "${meta.signifier}"
  status: ${deceased ? "deceased" : meta.status}
  field: "${esc(meta.field || meta.note)}"
  home: characters/${slug}/

representation:
  governed_by: ../../schemas/portrayal-standards.yml
  consent_level: ${consentLevel}
  authored_by: don-hopkins

invitation:
  status: ${invStatus}
  consent: not_yet_asked
  document: invitation.md
  show_seed: ${meta.show_seed}
${meta.note ? `  note: "${esc(meta.note)}"` : ""}

bio:
  summary: "${esc(meta.bioSummary || meta.glance || meta.field)}"

sources:
  wikipedia: ${meta.wikipedia ? `"${meta.wikipedia}"` : "null"}
  web:
${meta.web.length ? meta.web.map((u) => `    - ${u}`).join("\n") : "    []"}
  papers: []
  blogs: []
`;

	const focus = meta.note || meta.field || "their public work and a Repo Show conversation";
	const invBody = deceased
		? `# ${meta.name} — legacy K-line

*Historical constructionist lineage — not a living invitation.*
[Portrayal standards](../../schemas/portrayal-standards.yml)

Respectful portrayal of public legacy and published work for Micropolis Class attribution.
`
		: `---
status: draft
character_id: ${slug}
public: true
consent: not_yet_asked
show_seed: ${meta.show_seed}
---

# Repo Show invitation — ${meta.name}

*Public draft — not sent. ${meta.name} may edit, decline, delay, or request removal at any time.*
[Portrayal standards](../../schemas/portrayal-standards.yml)

We would respectfully invite **${meta.name}** to a **Repo Show** — a Micropolis Class
conversation whose stage is [this public repository](https://github.com/SimHacker/WillWrightShowForFood),
following through to working code and credited ideas in public.

**Proposed focus:** ${focus}

**Materials:** [\`${meta.show_seed}\`](../../${meta.show_seed})

Browse without a GitHub account — [README](https://github.com/SimHacker/WillWrightShowForFood).

**Your response:** Accepted, delayed, too busy, declined, or no reply — all honored gracefully.

— Don Hopkins, Micropolis Class
`;

	const readme = `# ${meta.name}

Invitation portrayal — **not** ${meta.name}. [Standards](../../schemas/portrayal-standards.yml)

${meta.field ? `**Field:** ${meta.field}\n` : ""}
[Invitation](invitation.md) · [Show seed](../../${meta.show_seed})

Verifiable sources in \`CHARACTER.yml\`. Subject may request correction or removal anytime.
`;

	fs.writeFileSync(path.join(dir, "CHARACTER.yml"), characterYml);
	fs.writeFileSync(path.join(dir, "invitation.md"), invBody);
	fs.writeFileSync(path.join(dir, "README.md"), readme);
}

let n = 0;
for (const slug of readGuestSlugs()) {
	if (SKIP.has(slug)) continue;
	const idx = indexEntry(slug);
	const src = loadDonHopkins(slug);
	const meta = {
		name: src?.name ?? titleCase(slug),
		field: src?.field ?? idx.note,
		signifier: src?.signifier ?? "👤",
		status: src?.status ?? "living",
		consent_level: src?.consent_level ?? "3",
		glance: src?.glance ?? "",
		wikipedia: src?.wikipedia ?? null,
		web: src?.web ?? [],
		show_seed: idx.show_seed,
		note: idx.note,
		bioSummary: src?.glance || src?.field,
	};
	writeGuest(slug, meta);
	n++;
	console.log(`~ characters/${slug}/`);
}
console.log(`Normalized ${n} guest characters.`);
