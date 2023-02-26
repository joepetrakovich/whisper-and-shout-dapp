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
    <a href="https://metamask.io/" target="_blank" rel="noreferrer" class="btn btn-outline-warning btn-metamask">Install MetaMask</a>
{:else}

    {#if mode === Mode.Shout}
        {#if networkStatus === OasisNetworkStatus.ON_EMERALD_PARATIME}
            <button class="btn btn-success btn-metamask" disabled>
                <i class="bi bi-gem"></i>&nbsp;Connected to Emerald
            </button>
        {:else}
            <button class="btn btn-outline-success btn-metamask" on:click={() => switchTo(OASIS_EMERALD_TESTNET)}>
                <i class="bi bi-gem"></i>&nbsp;Connect to Emerald
            </button>
        {/if}
    {/if}

    {#if mode === Mode.Whisper}
        {#if networkStatus === OasisNetworkStatus.ON_SAPPHIRE_PARATIME}
            <button class="btn btn-primary btn-metamask" disabled>
                <i class="bi bi-suit-diamond-fill"></i>&nbsp;Connected to Sapphire
            </button>
        {:else}
            <button class="btn btn-outline-primary btn-metamask" on:click={() => switchTo(OASIS_SAPPHIRE_TESTNET)}>
                <i class="bi bi-suit-diamond-fill"></i>&nbsp;Connect to Sapphire
            </button>
        {/if}
    {/if}

{/if}