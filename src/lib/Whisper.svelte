<script lang="ts">
    import { ethers } from 'ethers'
    import * as sapphire from '@oasisprotocol/sapphire-paratime';
    import Whisper from '$lib/Whisper.json';
	import NetworkButton from './NetworkButton.svelte';
	import { Mode, OasisNetworkStatus, type Message } from '$lib/Models';
	import { createEventDispatcher } from 'svelte';
	import MessageBox from './MessageBox.svelte';
	import { tooltip } from '$lib/Tooltip';

    export let networkStatus: OasisNetworkStatus;
    export let currentAccount: string;

    function reset() { 
        messages = []; 
        refreshing = false;
        sending = false;
        message = '';
        address = '';
        tx = undefined;
    }

    $: currentAccount && reset();

    const dispatch = createEventDispatcher();

    let connectedToSapphire: boolean;
    $: connectedToSapphire = networkStatus === OasisNetworkStatus.ON_SAPPHIRE_PARATIME;

    const WHISPER_CONTRACT_ADDRESS="0xebcc16233DE34C1945214C92896eb88182bC8def";

    const signatureTooltip: string = "On Sapphire, if you use msg.sender for access control in your contract, the call must be signed, otherwise msg.sender will be zeroed.";
    let signatureRefreshButton: HTMLButtonElement;

    let messages: Message[] = [];
    let message: string = '';
    let address: string = '';

    let refreshing: boolean = false;
    let sending: boolean = false;
    let tx: Promise<any> | undefined;

    async function getSecretMessages() {
        refreshing = true;

        let wrapped = sapphire.wrap(window.ethereum);

		const whisperContract = new ethers.Contract(
			WHISPER_CONTRACT_ADDRESS,
			Whisper.abi,
            await new ethers.BrowserProvider(wrapped).getSigner()
		);

        let receivedMessages = [];

        try {
            receivedMessages = await whisperContract.getMessages();
        } catch(error) {
            console.error(`An error occurred getting whispers.  Did you sign the request? Error: ${error}`);
        }

        refreshing = false;

        if (!receivedMessages?.length) {
            return;
        }

         const normalizeMessage = (message: any) => ({
             from: message.from,
             text: message.text,
             timestamp: message.timestamp,
         });

         messages = receivedMessages
             .map(normalizeMessage)
             .sort((a: any, b: any) => Number(b.timestamp) - Number(a.timestamp));
    }

    async function sendSecretMessage() {   
        try {
            sending = true;
            window.ethereum = sapphire.wrap(window.ethereum);

            const whisperContract = new ethers.Contract(
                WHISPER_CONTRACT_ADDRESS,
                Whisper.abi,
                await new ethers.BrowserProvider(window.ethereum).getSigner()
            );

            const transaction = await whisperContract.sendMessage(address.trim(), message, {
                gasLimit: 400000,
            });
            dispatch('transactionsent', transaction);
            tx = transaction.wait();

            address = '';
            message = '';
        
        } catch (error) {
            alert('Error while sending message: ' + error);
        } finally {
            sending = false;
        }
    }
</script>

<div class="card mb-3">
    <div class="card-body">
        <div class="mb-3">
            <input bind:value={address} autocomplete="new-password" id="address" class="form-control" type="text" placeholder="Address" />
        </div>
        <div class="mb-3">
            <textarea bind:value={message} autocomplete="new-password" id="message" class="form-control" rows="4" cols="33" placeholder="Write something... (it's end-to-end encrypted)" />
            {#await tx}
                <div class="tx-pending">
                    <span class="spinner-grow spinner-grow-sm text-secondary" role="status"></span>
                    Transaction pending...
                </div>
            {/await}
        </div>
        <div class="d-flex justify-content-between">
            <img src="sapphire-certified.png" alt="sapphire-certified" class="gem" height="56">
            {#if connectedToSapphire}
                <div class="send-container">
                    <a href="https://faucet.testnet.oasis.dev/" target="_blank" rel="noreferrer" class="text-primary">Get Testnet Tokens<i class="bi bi-droplet-fill ms-1"></i></a>        
                    {#if sending}
                        <button class="btn btn-primary" type="button" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Sending...
                        </button>
                    {:else}
                        <button class="btn btn-primary btn-send" on:click={sendSecretMessage}>Send</button>
                    {/if}
                </div>
            {:else}
                <span class="network-button">
                    <NetworkButton mode={Mode.Whisper} {networkStatus} />
                </span>
            {/if}
        </div>
    </div>
</div>

<MessageBox {messages} emptyMessage="No whispers yet">
    <span>
        <i class="bi bi-incognito me-2"></i>Whispers
    </span>
    {#if connectedToSapphire}
        {#if refreshing}
            <button class="btn btn-sm btn-secondary" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Signing (and Refreshing)...
            </button>
        {:else}
            <button class="btn btn-sm btn-secondary" bind:this={signatureRefreshButton} on:click={getSecretMessages} 
                    title="{signatureTooltip}" use:tooltip data-bs-placement="bottom">
                <i class="bi bi-pen me-2"></i>Sign To Refresh
            </button>
        {/if}

    {/if}
</MessageBox>



