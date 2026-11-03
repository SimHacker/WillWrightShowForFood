/**
 * The machines an entry can run, by the name in its `runs.machine`. Each adapter is imported
 * when an entry first needs it, so browsing the catalog loads no emulator.
 *
 * `fresh` means the machine cannot be swapped for another in a running page: going from one
 * to the other reloads the page, so two emulators never share it.
 * @type {Record<string, { name: string, title: string, fresh: boolean, adapter: () => Promise<{ default: import('svelte').Component<any> }> }>}
 */
export const MACHINES = {
	pdp7: { name: 'pdp7', title: 'PDP-7', fresh: true, adapter: () => import('./machines/Pdp7Machine.svelte') },
	apple2: { name: 'apple2', title: 'Apple II', fresh: true, adapter: () => import('./machines/Apple2Machine.svelte') }
};

/** @param {string | undefined} name */
export const machineFor = (name) => (name ? MACHINES[name] : undefined);
