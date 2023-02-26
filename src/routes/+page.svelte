<script lang="ts">
	import ModeToggle from '$lib/ModeToggle.svelte';
	import { Mode, OasisNetworkStatus } from '$lib/Models';
	import Shout from '$lib/Shout.svelte';
	import Whisper from '$lib/Whisper.svelte';
    import { onMount } from 'svelte';
	import type { Readable } from 'svelte/store';
	import { createAccountWatcherStore, createOasisNetworkWatcherStore, OASIS_EMERALD_TESTNET, OASIS_SAPPHIRE_TESTNET } from '$lib/Network';
	import NetworkButton from '$lib/NetworkButton.svelte';

    let mode: Mode = Mode.Shout;

    let oasisNetworkStatus: Readable<OasisNetworkStatus> = createOasisNetworkWatcherStore();
    let currentAccount: Readable<string> = createAccountWatcherStore();
    let chainChaingedListener: ((chainId: string) => void) | undefined;

    onMount(() => {
        if (window.ethereum) {
            chainChaingedListener = (chainId: string) => { 
                 switch (chainId) {
                     //for whatever reason, the network isn't cleaned up after sending a sapphire tx.
                     //and then switching to emerald, so we'll force a reload...
                     case OASIS_EMERALD_TESTNET.chainIdHex:
                        window.location.reload();
                        break;
                 }
            }
            window.ethereum.on('chainChanged', chainChaingedListener);
        }

		return () => { 
            if (chainChaingedListener) {
                window.ethereum.removeListener('chainChanged', chainChaingedListener);
            }
        }
    })
</script>

<nav class="navbar navbar-expand-lg bg-body-tertiary bg-dark" data-bs-theme="dark">
	<div class="container">
        <div class="navbar-brand d-flex gap-2">
            <i class="bi bi-incognito"></i> ||
            <i class="bi bi-megaphone-fill me-2"></i>
            <span class="collapse navbar-collapse">
                Whisper & Shout
            </span>
        </div>

        <span class="right-controls">
            <div class="collapse navbar-collapse"> 
                <a href="https://oasisprotocol.org/" target="_blank" rel="noreferrer" class="navbar-brand powered-by-oasis">
                    <img
                        src="oasis-logo.png"
                        alt="Powered by Oasis"
                        width="30"
                        height="30"
                        class="d-inline-block"
                    />
                    Powered by Oasis
                </a>
            </div>
            <NetworkButton {mode} networkStatus={$oasisNetworkStatus} />
        </span>
	</div>
</nav>

<nav class="navbar">
    <div class="container d-flex justify-content-end">
        <span class="badge rounded-pill text-bg-secondary current-account">
            <i class="bi bi-person-circle me-1"></i>
            {$currentAccount}
        </span>
    </div>
</nav>

<div class="main">
    <div class="rosetan-box">
        <div class="alert" 
             class:alert-success={mode === Mode.Shout} 
             class:alert-primary={mode === Mode.Whisper}
             role="alert">
            <div class="rosetan">
                <div>
                    {#if mode === Mode.Shout}
                        <h3 class="alert-heading">Hey! I'm Rosetan!</h3>
                        <p>
                            This is the <b>Shout</b> mode.
                        </p>
                        <p>
                            Messages you send in this mode are publicly visible to anyone, like most blockchains.
                            This mode uses the Oasis Network's <a href="https://docs.oasis.io/dapp/emerald/" target="_blank" rel="noreferrer" class="alert-link">Emerald</a> paratime.
                        </p>
                        
                    {:else}
                        <h3 class="alert-heading">Psssst!</h3>
                        <p>
                            Hi, I'm Rosetan, and this is the <b>Whisper</b> mode.
                        </p>
                        <p>  
                            Messages you send in this mode are <b>end-to-end encrypted</b> using the Oasis Network's <a href="https://docs.oasis.io/dapp/sapphire/" target="_blank" rel="noreferrer" class="alert-link">Sapphire</a> paratime.
                        </p>
                    {/if}
                </div>
                <img src="comfy.png" alt="Comfy Rosetan" width="60">
            </div>
          </div>
    </div>
    <div>
        <ModeToggle bind:mode />
    </div>
    
    <div style:display={mode === Mode.Shout ? '' : 'none'}>
        <Shout networkStatus={$oasisNetworkStatus} currentAccount={$currentAccount} />
    </div>
    <div style:display={mode === Mode.Whisper ? '' : 'none'}>
        <Whisper networkStatus={$oasisNetworkStatus} currentAccount={$currentAccount} />
    </div>
</div>

<style>
    .current-account {
        font-size: 0.9rem;
    }
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
    .rosetan {
        display: flex;
        gap: 14px;
    }
    .rosetan img {
        align-self: flex-end;
    }
    :global(.tx-pending) {
        display: flex;
        justify-content: end;
        gap: 8px;
        font-size: 0.8rem;
        align-items: center;
        padding-top:4px;
        color: gray;
        position: absolute;
        right: 0;
        padding-right: 1.5em;
    }
    :global(.send-container) {
        display: flex;
        align-items: end;
        gap: 14px;
        align-self: flex-end;
    }
    :global(.btn-send) {
        width: 100px;
    }
    :global(span.network-button) {
        align-self: flex-end;
    }
</style>
