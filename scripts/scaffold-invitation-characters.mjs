#!/usr/bin/env node
/**
 * Scaffold invitation character dirs from DonHopkins public portrayals + INDEX.yml.
 * Skips existing dirs. WWSFF is live — does not write back to DonHopkins.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DON = path.resolve(ROOT, "../DonHopkins");
const CHAR = path.join(ROOT, "characters");

const SKIP = new Set([
	"will-wright",
	"don-hopkins",
	"david-ungar",
	"don-philahue",
	"slats",
]);

function readGuestSlugs() {
	const index = fs.readFileSync(path.join(CHAR, "INDEX.yml"), "utf8");
	const slugs = [];
	let inGuests = false;
	for (const line of index.split("\n")) {
		if (line.startsWith("guests:")) {
			inGuests = true;
			continue;
		}
		if (inGuests && line.startsWith("bots:")) break;
		if (!inGuests) continue;
		const m = line.match(/^  ([a-z0-9-]+):/);
		if (m) slugs.push(m[1]);
	}
	return slugs;
}

function pick(re, text, fallback = "") {
	const m = text.match(re);
	return m ? m[1].trim() : fallback;
}

function loadSource(slug) {
	const dir = path.join(DON, "characters", slug);
	const charPath = path.join(dir, "CHARACTER.yml");
	if (!fs.existsSync(charPath)) return null;
	const yml = fs.readFileSync(charPath, "utf8");
	const glancePath = path.join(dir, "GLANCE.md");
	const glance = fs.existsSync(glancePath)
		? fs.readFileSync(glancePath, "utf8").trim()
		: "";
	return {
		name: pick(/name:\s*["']?([^"'\n]+)/, yml, slug),
		field: pick(/field:\s*["']?([^"'\n]+)/, yml, ""),
		status: pick(/status:\s*(\w+)/, yml, "living"),
		signifier: pick(/signifier:\s*["']?([^"'\n]+)/, yml, "👤"),
		glance,
	};
}

function indexEntry(slug) {
	const index = fs.readFileSync(path.join(CHAR, "INDEX.yml"), "utf8");
	const re = new RegExp(`  ${slug}:\\s*\\{([^}]*)\\}`);
	const m = index.match(re);
	if (!m) return {};
	const block = m[1];
	const show = block.match(/show_seed:\s*([^,}\s]+)/);
	const note = block.match(/note:\s*"([^"]+)"/);
	return {
		show_seed: show ? show[1] : `repo-shows/${slug}/`,
		note: note ? note[1] : "",
	};
}

function writeInvitation(slug, meta) {
	const dir = path.join(CHAR, slug);
	fs.mkdirSync(dir, { recursive: true });
	const deceased = meta.status === "deceased" || meta.signifier.includes("🕯");
	const consent = deceased ? "legacy_kline" : 3;

	const characterYml = `# ${meta.name} — INVITATION CHARACTER (public WWSFF portrayal)
# NOT ${meta.name}. See ../schemas/guest-invitation-status.yml

character:
  name: "${meta.name}"
  type: invitation
  real_being: ${deceased ? "legacy" : "true"}
  signifier: "${meta.signifier}"
  status: ${meta.status}
  field: "${meta.field.replace(/"/g, '\\"')}"
  home: characters/${slug}/

representation:
  consent_level: ${consent}
  authored_by: don-hopkins
  must_not: [impersonate, fabricate_quotes]

invitation:
  status: not_yet_asked
  show_seed: ${meta.show_seed}
${meta.note ? `  note: "${meta.note.replace(/"/g, '\\"')}"` : ""}

source:
  projected_from: DonHopkins/characters/${slug}/
  live_repo: WillWrightShowForFood
`;

	const glance =
		meta.glance ||
		`${meta.signifier} **${meta.name}** — proposed Repo Show guest. Invitation not yet sent.`;

	const readme = `# ${meta.name}

Invitation character — portrayal **about** ${meta.name}, not ${meta.name}.

${meta.field ? `**Field:** ${meta.field}` : ""}

Show seed: \`${meta.show_seed}\`

Draft invitation: [\`invitation.md\`](invitation.md) — *not sent* (\`invitation_status: not_yet_asked\`).

Live repo: [WillWrightShowForFood](https://github.com/SimHacker/WillWrightShowForFood) — edit here, not DonHopkins backfill.
`;

	const invitation = `# Invitation draft — ${meta.name}

*Not sent. Don to edit and send.*

We would love a **Repo Show** with you — the stage is this public GitHub repo; the audience RTFR on their own rigs; ideas follow through to code and MOOLLM skills.

**Show seed:** \`${meta.show_seed}\`

**Browse:** https://github.com/SimHacker/WillWrightShowForFood

**Repo Show format:** [\`process/repo-show-format.yml\`](../../process/repo-show-format.yml)

— Don Hopkins
`;

	fs.writeFileSync(path.join(dir, "CHARACTER.yml"), characterYml);
	fs.writeFileSync(path.join(dir, "GLANCE.md"), glance + "\n");
	fs.writeFileSync(path.join(dir, "README.md"), readme);
	fs.writeFileSync(path.join(dir, "invitation.md"), invitation);
}

const slugs = readGuestSlugs();
let created = 0;
let skipped = 0;

for (const slug of slugs) {
	if (SKIP.has(slug)) {
		skipped++;
		continue;
	}
	const dest = path.join(CHAR, slug, "CHARACTER.yml");
	if (fs.existsSync(dest)) {
		skipped++;
		continue;
	}
	const idx = indexEntry(slug);
	const src = loadSource(slug);
	const meta = {
		name: src?.name ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
		field: src?.field ?? idx.note ?? "",
		status: src?.status ?? "living",
		signifier: src?.signifier ?? "👤",
		glance: src?.glance ?? "",
		show_seed: idx.show_seed ?? `repo-shows/${slug}/`,
		note: idx.note ?? "",
	};
	writeInvitation(slug, meta);
	created++;
	console.log(`+ characters/${slug}/`);
}

console.log(`Done: ${created} created, ${skipped} skipped.`);
