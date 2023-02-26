<script lang="ts">
	import { Mode, OasisNetworkStatus, type Network } from "$lib/Models";
	import { addNetwork, OASIS_EMERALD_TESTNET, OASIS_SAPPHIRE_TESTNET, switchNetwork } from "$lib/Network";

    export let mode: Mode; 
    export let networkStatus: OasisNetworkStatus;

    const SWITCH_CHAIN_ERROR_CHAIN_NOT_ADDED: number = 4902;

    function switchTo(network: Network) {
        switchNetwork(network.chainIdHex)
        .catch(error => {
            if (error.code === SWITCH_CHAIN_ERROR_CHAIN_NOT_ADDED) {
                addNetwork(network);
            }
        });
    }
</script>

{#if networkStatus === OasisNetworkStatus.PROVIDER_NOT_FOUND}
    <a href="https://metamask.io/" target="_blank" rel="noreferrer" class="btn btn-outline-warning">Install MetaMask</a>
{:else}

    {#if mode === Mode.Shout}
        {#if networkStatus === OasisNetworkStatus.ON_EMERALD_PARATIME}
            <button class="btn btn-success glow">
                <i class="bi bi-gem me-2"></i>Connected to Emerald Testnet
            </button>
        {:else}
            <button class="btn btn-outline-success" on:click={() => switchTo(OASIS_EMERALD_TESTNET)}>
                <i class="bi bi-gem me-2"></i>Connect to Emerald Testnet
            </button>
        {/if}
    {/if}

    {#if mode === Mode.Whisper}
        {#if networkStatus === OasisNetworkStatus.ON_SAPPHIRE_PARATIME}
            <button class="btn btn-primary glow">
                <i class="bi bi-suit-diamond-fill me-2"></i>Connected to Sapphire Testnet
            </button>
        {:else}
            <button class="btn btn-outline-primary" on:click={() => switchTo(OASIS_SAPPHIRE_TESTNET)}>
                <i class="bi bi-suit-diamond-fill me-2"></i>Connect to Sapphire Testnet
            </button>
        {/if}
    {/if}

{/if}

<style>
    @keyframes glow {
        0% {
            filter: brightness(1);
        }
        100% {
            filter: brightness(1.3);
        }
    }
    .glow {
        animation: glow 3s alternate infinite;
        cursor: default;
        pointer-events: none;
    }
</style>