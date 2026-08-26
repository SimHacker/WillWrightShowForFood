<script lang="ts">
	import {
		debugEnabled,
		getDebugLines,
		getPreviousDebugLines,
		subscribeDebug,
		type DebugLine
	} from '$lib/debug-trap';
	import { onMount } from 'svelte';

	let enabled = $state(false);
	let lines = $state<DebugLine[]>([]);
	let previous = $state<DebugLine[]>([]);
	let open = $state(true);

	function fmt(line: DebugLine) {
		const d = new Date(line.t);
		const hh = String(d.getHours()).padStart(2, '0');
		const mm = String(d.getMinutes()).padStart(2, '0');
		const ss = String(d.getSeconds()).padStart(2, '0');
		return `${hh}:${mm}:${ss} ${line.msg}`;
	}

	function copy() {
		const text = [
			'--- previous session ---',
			...previous.map(fmt),
			'--- this session ---',
			...lines.map(fmt)
		].join('\n');
		void navigator.clipboard.writeText(text);
	}

	onMount(() => {
		enabled = debugEnabled();
		if (!enabled) return;
		previous = getPreviousDebugLines();
		lines = getDebugLines();
		return subscribeDebug(() => {
			lines = getDebugLines();
		});
	});
</script>

{#if enabled}
	<div class="dbg">
		<div class="bar">
			<button type="button" onclick={() => (open = !open)}>{open ? '▾' : '▸'} debug</button>
			<button type="button" onclick={copy}>copy</button>
		</div>
		{#if open}
			{#if previous.length}
				<pre class="prev">prev last: {fmt(previous[previous.length - 1])}</pre>
			{/if}
			<pre>{lines.slice(-12).map(fmt).join('\n')}</pre>
		{/if}
	</div>
{/if}

<style>
	.dbg {
		position: fixed;
		left: 8px;
		right: 8px;
		bottom: 8px;
		z-index: 99999;
		max-height: 32vh;
		overflow: auto;
		background: rgba(8, 12, 20, 0.92);
		color: #9f6;
		font: 11px/1.35 ui-monospace, Menlo, monospace;
		padding: 6px 8px;
		border-radius: 6px;
		pointer-events: auto;
	}
	.bar {
		display: flex;
		gap: 8px;
		margin-bottom: 4px;
	}
	.bar button {
		font: inherit;
		color: #fff;
		background: #234;
		border: 0;
		padding: 2px 8px;
		border-radius: 4px;
	}
	.prev {
		color: #fc6;
		margin: 0 0 6px;
		white-space: pre-wrap;
		word-break: break-all;
	}
	pre {
		margin: 0;
		white-space: pre-wrap;
		word-break: break-all;
	}
</style>
