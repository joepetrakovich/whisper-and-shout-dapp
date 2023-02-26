<script lang="ts">
    import { onMount } from 'svelte';
	import ModeToggle from './ModeToggle.svelte';
	import { Mode, OasisNetworkStatus } from '$lib/Models';
	import Shout from './Shout.svelte';
	import Whisper from './Whisper.svelte';
	import type { Readable } from 'svelte/store';
	import { createOasisNetworkWatcherStore } from '$lib/Network';
	import NetworkButton from './NetworkButton.svelte';

    let mode: Mode = Mode.Shout;
    let oasisNetworkStatus: Readable<OasisNetworkStatus> = createOasisNetworkWatcherStore();
</script>

<nav class="navbar bg-body-tertiary bg-dark" data-bs-theme="dark">
	<div class="container">
		<span class="navbar-brand"> Whisper & Shout </span>

		<span class="right-controls">
			<a href="https://oasisprotocol.org/" class="navbar-brand powered-by-oasis">
				<img
					src="oasis-logo.png"
					alt="Powered by Oasis"
					width="30"
					height="30"
					class="d-inline-block"
				/>
				Powered by Oasis
			</a>
            <NetworkButton {mode} networkStatus={$oasisNetworkStatus} />
		</span>
	</div>
</nav>

<div class="container p-4 mw-600">
    <div class="container p-0 m-0 my-3">
        <ModeToggle bind:mode />
    </div>

    {#if mode === Mode.Shout}
        <Shout networkStatus={$oasisNetworkStatus} />
    {:else}
        <Whisper networkStatus={$oasisNetworkStatus} />
    {/if}
</div>

<style>
    .mw-600 {
        max-width: 600px;
    }
	.powered-by-oasis {
		display: flex;
		gap: 8px;
		align-items: center;
		font-style: italic;
		color: #65c1ff;
	}
	.right-controls {
		display: flex;
	}
</style>
