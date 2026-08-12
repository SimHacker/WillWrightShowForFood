<script lang="ts">
	type PopupMenuItem = {
		id: string;
		label: string;
		active?: boolean;
		disabled?: boolean;
	};

	type Props = {
		open: boolean;
		items: PopupMenuItem[];
		onSelect: (id: string) => void;
		onClose: () => void;
	};

	let { open, items, onSelect, onClose }: Props = $props();

	function pick(id: string, disabled?: boolean) {
		if (disabled) return;
		onSelect(id);
		onClose();
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="backdrop" onclick={onClose} role="presentation"></div>
	<div class="menu" role="menu">
		{#each items as item (item.id)}
			<button
				type="button"
				role="menuitem"
				class:active={item.active}
				disabled={item.disabled}
				aria-current={item.active ? 'true' : undefined}
				onclick={() => pick(item.id, item.disabled)}
			>
				{item.label}
			</button>
		{/each}
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 40;
		background: transparent;
	}

	.menu {
		position: absolute;
		bottom: calc(100% + 0.35rem);
		left: 0;
		right: 0;
		z-index: 41;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 0.35rem;
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 10px;
		background: #16213e;
		box-shadow: 0 -8px 28px rgba(0, 0, 0, 0.45);
	}

	.menu button {
		min-height: 2.75rem;
		padding: 0.55rem 0.75rem;
		border: none;
		border-radius: 8px;
		background: #1a1a2e;
		color: #f8f9fa;
		font: inherit;
		font-size: 0.95rem;
		font-weight: 600;
		text-align: left;
		cursor: pointer;
	}

	.menu button:hover:not(:disabled) {
		background: #243055;
	}

	.menu button.active {
		background: #0077b6;
	}

	.menu button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
