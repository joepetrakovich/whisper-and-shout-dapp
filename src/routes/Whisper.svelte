<script lang="ts">
    import { ethers } from 'ethers'
    import * as sapphire from '@oasisprotocol/sapphire-paratime';
    import Whisper from '$lib/Whisper.json';
	import NetworkButton from './NetworkButton.svelte';
	import { Mode, OasisNetworkStatus, type Message } from '$lib/Models';

    export let networkStatus: OasisNetworkStatus;

    let connectedToSapphire: boolean;
    $: connectedToSapphire = networkStatus === OasisNetworkStatus.ON_SAPPHIRE_PARATIME;

    const WHISPER_CONTRACT_ADDRESS="0xebcc16233DE34C1945214C92896eb88182bC8def";

    let messages: Message[] = [];
    let message: string = '';
    let address: string = '';

    async function getSecretMessages() {

        let wrapped = sapphire.wrap(window.ethereum);

		const whisperContract = new ethers.Contract(
			WHISPER_CONTRACT_ADDRESS,
			Whisper.abi,
            await new ethers.BrowserProvider(wrapped).getSigner()
		);

        let receivedMessages = await whisperContract.getMessages();

         const normalizeMessage = (message: any) => ({
             from: message.from,
             text: message.text,
             timestamp: message.timestamp,
         });

         messages = receivedMessages
             .map(normalizeMessage);
             //.sort((a: any, b: any) => b.timestamp - a.timestamp);
    }

    async function sendSecretMessage() {   
        try {
            window.ethereum = sapphire.wrap(window.ethereum);

            const whisperContract = new ethers.Contract(
                WHISPER_CONTRACT_ADDRESS,
                Whisper.abi,
                await new ethers.BrowserProvider(window.ethereum).getSigner()
            );

            const transaction = await whisperContract.sendMessage(address, message, {
                gasLimit: 400000,
            });
            await transaction.wait();

            address = '';
            message = '';
        
        } catch (error) {
            alert('Error while sending message: ' + error);
        }
    }
</script>

<div class="card mb-3">
    <div class="card-body">
        <div class="mb-3">
            <input bind:value={address} id="address" class="form-control" type="text" placeholder="Address" />
        </div>
        <div class="mb-3">
            <textarea bind:value={message} id="message" class="form-control" rows="5" cols="33" placeholder="Write something..." />
        </div>
        <div class="d-flex justify-content-end">
            {#if connectedToSapphire}
                <button class="btn btn-primary btn-send" on:click={sendSecretMessage}>Send</button>
            {:else}
                <NetworkButton mode={Mode.Whisper} {networkStatus} />
            {/if}
        </div>
    </div>
</div>

<h4>
    Whispers 
    {#if connectedToSapphire}
        <button class="btn btn-primary" on:click={getSecretMessages}>Sign To Refresh</button>
    {/if}
</h4>

{#if messages.length} 
    <ul>
        {#each messages as message}
            <li>{message.text}</li>
        {/each}
    </ul>
{:else}
    <i>No whispers yet</i>
{/if}

<style>
    .btn-send {
        width: 100px;
    }
</style>


