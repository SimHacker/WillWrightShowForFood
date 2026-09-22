import { registerItsSubset } from "./commands.js";
import { CommandTable, TinyTeco } from "./engine.js";

/** ITS-flavoured table: the Minsky mail subset, ready to grow. */
export function createTinyTeco(): TinyTeco {
	const table = new CommandTable();
	registerItsSubset(table);
	return new TinyTeco(table);
}
