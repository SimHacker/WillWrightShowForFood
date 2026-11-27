<script>
	/**
	 * The last node of a machine page's outline: what the Machine Room is, and the people and
	 * projects it stands on (packages/cabinet/CREDITS.yml). Everything is pinnable: the whole
	 * About panel, each section and each node under it as a panel, each name as a link that
	 * opens its page in a new tab. Pinned, they are things to look at later.
	 */
	import CreditOffer from './CreditOffer.svelte';
	import Outline from './Outline.svelte';
	import { credits, flatten } from './credits.js';

	/** @type {{ bar: import('./toolbar.svelte.js').Toolbar, machine: string, move?: (id: string, to: string | number) => void }} */
	let { bar, machine, move } = $props();

	/** @param {string} id */
	const outlineId = (id) => (id === 'about' ? `${machine}-about` : `${machine}-about-${id}`);
	const nodes = $derived(flatten(credits, [], outlineId));
	const names = $derived(nodes.filter((n) => n.node.url).length);
</script>

{#each nodes as n (n.node.id)}
	<CreditOffer {bar} node={n.node} home={n.home} {outlineId} />
{/each}

<Outline id={outlineId('about')} title="About" hint="What the Machine Room is, and the people and projects it stands on. Pin any of it." summary="{credits.entries.length} sections · {names} names" {move} pin={{ bar, id: 'about-about' }}>
	{@render bar.controls.get('about-about')?.render(false)}
</Outline>
