<script>
	/**
	 * An Apple app (packages/cabinet/disks/apple2/APPS.yml) around the Apple screen: its starts,
	 * its disks by what they are for, and its moves as buttons. The screen opens on the Korz
	 * compiler. The menu there also has the switch, the resolver, the interpreter, and microM8.
	 */
	import { onMount } from 'svelte';
	import { driveIndex } from '@wwsff/cabinet/disk-catalog';
	import MicroM8 from '../MicroM8.svelte';
	import ApplePanels from '../ApplePanels.svelte';
	import ScreenAngel from './ScreenAngel.svelte';
	import { apple } from '../apple.svelte.js';
	import { chargenUrl, diskUrl } from '../catalog.js';

	/** @typedef {import('@wwsff/cabinet/disk-catalog').AppleApp} AppleApp */
	/** @typedef {import('@wwsff/cabinet/disk-catalog').AppAction} AppAction */

	/** @type {{ app: AppleApp }} */
	let { app } = $props();

	/** Set across a reload when a start needs another machine profile: `<app id>#<start>`. */
	const STARTING = 'apple-app-start';
	const profile = $derived(app.profile ?? '');
	const drives = $derived(app.drives === 1 ? [0] : [0, 1]);
	const disks = $derived(
		Object.values(app.disks).map((d) => ({ name: d.file, label: d.label, profile: app.profile ?? '', url: () => diskUrl(d.file) }))
	);
	let busy = $state('');
	let failed = $state('');

	/** Disk images fetched so far, by DISKS.yml path. */
	const fetched = new Map();

	/** @param {string} id @returns {Promise<Uint8Array>} */
	async function bytes(id) {
		const file = app.disks[id]?.file;
		if (!file) throw new Error(`${app.id} has no disk ${id}`);
		if (!fetched.has(file)) {
			const response = await fetch(await diskUrl(file));
			fetched.set(file, new Uint8Array(await response.arrayBuffer()));
		}
		return fetched.get(file);
	}

	/** @param {string} label @param {() => Promise<void>} work */
	async function doing(label, work) {
		busy = label;
		failed = '';
		try {
			await work();
		} catch (e) {
			failed = e instanceof Error ? e.message : String(e);
		} finally {
			busy = '';
		}
	}

	/** @param {string} id */
	const locked = (id) => app.disks[id]?.write_protected === true;

	/** The start last booted; its `use` swaps the disks the actions name. */
	let started = $state(0);

	/** Put each of a start's disks in its drive and boot drive 1. */
	function start(i = 0) {
		const s = app.starts[i];
		if (!s) return;
		started = i;
		if (apple.id === 'microm8' && apple.phase !== 'idle' && apple.profile !== profile) {
			sessionStorage.setItem(STARTING, `${app.id}#${i}`);
			location.reload();
			return;
		}
		return doing(s.label, async () => {
			if (app.chargen) {
				const res = await fetch(await chargenUrl(app.chargen));
				if (!res.ok) throw new Error(`could not read ${app.chargen}`);
				apple.chargen = new Uint8Array(await res.arrayBuffer());
			} else apple.chargen = null;
			const images = await Promise.all(s.drives.map(bytes));
			const files = s.drives.map((id) => app.disks[id]?.file ?? id);
			if (apple.id === 'microm8' && apple.phase === 'idle') apple.profile = profile;
			const entries = files.map((name, d) => ({ name, bytes: images[d], drive: d, protect: locked(s.drives[d]), profile }));
			await apple.boot(entries);
		});
	}

	/** @param {string} id @param {number} drive */
	const insert = (id, drive) =>
		doing(app.disks[id]?.label ?? id, async () => {
			await apple.insert(app.disks[id]?.file ?? id, await bytes(id), drive, profile, locked(id));
		});

	/** @param {AppAction} a */
	const act = (a) =>
		doing(a.label, async () => {
			const use = app.starts[started]?.use ?? {};
			for (const [drive, named] of Object.entries(a.insert ?? {})) {
				const id = use[named] ?? named;
				await apple.insert(app.disks[id]?.file ?? id, await bytes(id), driveIndex(drive), profile, locked(id));
			}
			if (a.keys) apple.type(a.keys);
		});

	/** The moves the screen angel says work now, or null for all of them. @type {string[] | null} */
	let allowed = $state(null);
	const actions = $derived(allowed ? (app.actions ?? []).filter((a) => allowed?.includes(a.label)) : (app.actions ?? []));

	/** @param {string} label */
	function moveNamed(label) {
		const a = app.actions?.find((x) => x.label === label);
		if (a) act(a);
	}

	/** @param {string} id @param {number} drive */
	const inDrive = (id, drive) => apple.drives[drive] === app.disks[id]?.file;

	/** @type {{ name: string, file: string, text: string }[]} */
	let people = $state([]);
	let peopleFrom = $state('');

	/** The characters on the first people disk in a drive, as the disk is now. */
	const readPeople = () =>
		doing('Reading characters', async () => {
			const ids = app.people?.disks ?? [];
			const drive = [0, 1].find((d) => ids.some((id) => inDrive(id, d)));
			if (drive === undefined) throw new Error(`put ${ids.map((id) => app.disks[id]?.label).join(' or ')} in a drive first`);
			const image = apple.saved(drive);
			if (!image) throw new Error('the disk could not be read back');
			const { BRIDGES } = await import('@wwsff/cabinet/apple2/games');
			const bridge = BRIDGES[app.people?.bridge ?? ''];
			if (!bridge) throw new Error(`no character bridge ${app.people?.bridge}`);
			const files = bridge.export(image);
			people = [...files]
				.filter(([path]) => /^characters\/[^/]+\/CHARACTER\.yml$/.test(path))
				.map(([path, text]) => ({ name: path.split('/')[1] ?? path, file: path, text }));
			peopleFrom = labelOf(apple.drives[drive] ?? '');
		});

	/** @param {string} file */
	const labelOf = (file) => Object.values(app.disks).find((d) => d.file === file)?.label ?? file;

	/** What is in each drive, for the folded disks list. */
	const mounted = $derived(drives.map((d) => `drive ${d + 1}: ${apple.drives[d] ? labelOf(apple.drives[d]) : 'empty'}`).join(' · '));

	/** @param {{ name: string, text: string }} p */
	function download(p) {
		const a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([p.text], { type: 'text/yaml' }));
		a.download = `${p.name}.yml`;
		a.click();
		URL.revokeObjectURL(a.href);
	}

	onMount(() => {
		apple.listen();
		const flag = sessionStorage.getItem(STARTING);
		if (flag?.startsWith(`${app.id}#`)) sessionStorage.removeItem(STARTING);
		start(flag?.startsWith(`${app.id}#`) ? Number(flag.slice(app.id.length + 1)) || 0 : 0);
	});
</script>

<MicroM8 {disks} defaultCpu="compile" begin={() => start(0)} beginLabel={app.starts[0]?.label ?? app.title} panels={false} />

{#snippet movesRow()}
	{#if actions.length}
		<div class="row moves">
			<span class="head">Moves</span>
			{#each actions as a (a.label)}
				<span class="move">
					{#if a.prompt}<span class="prompt">When the screen says “{a.prompt}”, press</span>{/if}
					<button onclick={() => act(a)} disabled={!!busy} title={a.prompt ? `Press when the screen says “${a.prompt}”` : a.label}>{a.label}</button>
				</span>
			{/each}
		</div>
	{/if}
{/snippet}

{#if app.angel}<ScreenAngel path={app.angel} move={moveNamed} bind:moves={allowed} controls={movesRow} />{/if}

<section class="app" aria-label="{app.title} controls">
	{#if !app.angel}{@render movesRow()}{/if}
	<div class="row">
		<span class="head">Start</span>
		{#each app.starts as s, i (s.label)}
			<button onclick={() => start(i)} disabled={!!busy} title="Put {s.drives.map((id) => app.disks[id]?.label).join(' and ')} in the drives and boot"
				>{s.label}</button
			>
		{/each}
	</div>
	{#if app.people}
		<div class="row">
			<span class="head">Characters</span>
			<button onclick={readPeople} disabled={!!busy} title="Read the characters off the disk as the game has written it">Read from Disk</button>
			{#if peopleFrom}<span class="prompt">{people.length} on {peopleFrom}</span>{/if}
			{#each people as p (p.file)}
				<button class="person" onclick={() => download(p)} title="Download {p.name}'s CHARACTER.yml">{p.name}</button>
			{/each}
		</div>
	{/if}
	<details class="disks-box">
		<summary><span class="head">Disks</span> {mounted}</summary>
		<ul class="disks" style:--drives={drives.length}>
			{#each Object.entries(app.disks) as [id, d] (id)}
				<li>
					<span class="label">{d.label}</span>
					{#each drives as drive (drive)}
						<button
							class={{ on: inDrive(id, drive) }}
							aria-pressed={inDrive(id, drive)}
							disabled={!!busy}
							title="Put {d.label} in drive {drive + 1}"
							onclick={() => insert(id, drive)}>Drive {drive + 1}</button
						>
					{/each}
				</li>
			{/each}
		</ul>
	</details>
	{#if busy}<p class="note">{busy}…</p>{/if}
	{#if failed}<p class="note failed">{failed}</p>{/if}
	<ApplePanels {labelOf} />
</section>

<style>
	.app {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin-top: 0.6rem;
		font: 0.85rem system-ui, sans-serif;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem;
	}
	.head {
		min-width: 5.5rem;
		font-weight: 600;
	}
	.moves {
		margin-top: 0.5rem;
	}
	.disks-box summary {
		cursor: pointer;
	}
	.disks-box[open] summary {
		margin-bottom: 0.4rem;
	}
	.disks-box .disks {
		margin-left: 5.9rem;
	}
	.move {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem;
	}
	.disks {
		display: grid;
		grid-template-columns: max-content repeat(var(--drives), auto);
		gap: 0.2rem 0.4rem;
		align-items: baseline;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.disks li {
		display: contents;
	}
	button.on {
		background: #cfc;
		color: #000;
	}
	.prompt,
	.note {
		opacity: 0.75;
		margin: 0;
	}
	.failed {
		color: #e8a070;
		opacity: 1;
	}
</style>
