import { stringify } from "yaml";

/** Stable YAML, so saving twice writes the same bytes. */
export function toYaml(doc: unknown): string {
	return stringify(doc, { sortMapEntries: true, lineWidth: 0 });
}
