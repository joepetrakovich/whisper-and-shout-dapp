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
		<span class="navbar-brand">
            <i class="bi bi-incognito"></i> ||
            <i class="bi bi-megaphone-fill"></i>
            &nbsp;
            Whisper & Shout
        </span>

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

<div class="main">
    <div>
        <ModeToggle bind:mode />
    </div>
    <div style:display={mode === Mode.Shout ? '' : 'none'}>
        <Shout networkStatus={$oasisNetworkStatus} />
    </div>
    <div style:display={mode === Mode.Whisper ? '' : 'none'}>
        <Whisper networkStatus={$oasisNetworkStatus} />
    </div>
    <img class="rosetan" src="comfy.png" alt="Comfy Rosetan" width="10%">
</div>

<style>
	.powered-by-oasis {
		display: flex;
		gap: 8px;
		align-items: center;
		font-style: italic;
		color: #65c1ff;
	}
    .main {
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-width: 600px;
        padding: 2em;
        margin: 0 auto;
    }
	.right-controls {
		display: flex;
	}
    img.rosetan {
        align-self: flex-end;
    }
</style>
