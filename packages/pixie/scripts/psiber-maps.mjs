// Re-import PSIBER's arpa.map and advent.map into commented YAML (and JSON).
// Existing YAML is saved into, not overwritten: comments and hand-added keys
// (lat/long from the printed-map scans) survive. Run after `npm run build`.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseAdventMap, parseArpaMap, saveInto, toJson, toYaml } from "../dist/index.js";

const psiber = fileURLToPath(new URL("../../../characters/don-hopkins/code/psiber/", import.meta.url));

const HEADERS = {
	arpanet: `# ARPANET, as PSIBER drew it: one node per IMP, links to its neighbours.
# Imported from cyber/arpa.map by packages/pixie/scripts/psiber-maps.mjs.
# Re-running the import saves into this file: comments and keys you add
# (lat/long below) are kept; source fields are refreshed.
#
# lat/long: not in the source. Fill each node's \`lat\` and \`long\` by hand
# from the printed ARPANET maps; don't compute them.
`,
	"colossal-cave": `# Colossal Cave, as PSIBER drew it: rooms, their descriptions, and the
# travel table with its verbs. Imported from cyber/advent.map by
# packages/pixie/scripts/psiber-maps.mjs, which saves into this file:
# comments and keys you add are kept; source fields are refreshed.
#
# Links: \`to\` is a room; \`special\`/\`message\` replace it for 300+n / 500+n
# destinations. \`when\` is the travel condition M (see meta encoding).
# Description lines are verbatim PostScript string bodies (see quirk).
`,
};

const maps = [
	["arpanet", parseArpaMap(readFileSync(`${psiber}cyber/arpa.map`, "latin1"))],
	["colossal-cave", parseAdventMap(readFileSync(`${psiber}cyber/advent.map`, "latin1"))],
];

for (const [name, graph] of maps) {
	const yml = `${psiber}maps/${name}.yml`;
	const text = existsSync(yml) ? saveInto(readFileSync(yml, "utf8"), graph, { prune: false }) : HEADERS[name] + toYaml(graph);
	writeFileSync(yml, text);
	writeFileSync(`${psiber}maps/${name}.json`, toJson(graph));
	console.log(`${name}: ${graph.nodes.length} nodes -> maps/${name}.yml, .json`);
}
