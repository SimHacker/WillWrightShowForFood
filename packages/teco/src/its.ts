import { registerItsSubset } from "./commands.js";
import { CommandTable, TecoEngine } from "./engine.js";

/** ITS-flavoured table: the Minsky mail subset, ready to grow. */
export function createItsEngine(): TecoEngine {
	const table = new CommandTable();
	registerItsSubset(table);
	return new TecoEngine(table);
}
