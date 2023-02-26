<script lang="ts">
    import { ethers } from 'ethers'
    import Shout from '$lib/Shout.json';
	import { Mode, OasisNetworkStatus, type Message } from '$lib/Models';
	import NetworkButton from './NetworkButton.svelte';
    import { createEventDispatcher } from 'svelte';
	import MessageBox from './MessageBox.svelte';

    export let networkStatus: OasisNetworkStatus;

    const dispatch = createEventDispatcher();
    
    let connectedToEmerald: boolean;
    $: connectedToEmerald = networkStatus === OasisNetworkStatus.ON_EMERALD_PARATIME;

    const SHOUT_CONTRACT_ADDRESS: string = "0xea839C7542FB2419B9f71A0bdff6D4fa3dbca792";

    let address: string = '';
    let message: string = '';

    let messages: Message[] = []; 

	async function getMessages() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const shoutContract = new ethers.Contract(
            SHOUT_CONTRACT_ADDRESS,
            Shout.abi,
            signer
        );

        let receivedMessages = await shoutContract.getMessages();

        const normalizeMessage = (message: any) => ({
            from: message.from,
            text: message.text,
            timestamp: message.timestamp,
        });

        messages = receivedMessages
            .map(normalizeMessage);
            //.sort((a: any, b: any) => b.timestamp - a.timestamp);
    }

    async function sendMessage() {   
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const shoutContract = new ethers.Contract(
                SHOUT_CONTRACT_ADDRESS,
                Shout.abi,
                signer
            );

            const transaction = await shoutContract.sendMessage(address, message, {
                gasLimit: 400000,
            });
            dispatch('transactionsent', transaction);
            //await transaction.wait();

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
        <div class="d-flex justify-content-between">
            <img src="emerald-certified.png" alt="emerald-certified" class="gem" height="56">
            {#if connectedToEmerald}
                <button class="btn btn-success btn-send" on:click={sendMessage}>Send</button>
            {:else}
            <span class="network-button">
                <NetworkButton mode={Mode.Shout} {networkStatus} />
            </span>
            {/if}
        </div>
    </div>
</div>

<MessageBox {messages} emptyMessage="No shouts yet">
    <span>
        <i class="bi bi-megaphone-fill"></i>&nbsp;Shouts
    </span>
    {#if connectedToEmerald}
        <button class="btn btn-sm btn-secondary" on:click={getMessages}>Refresh</button>
    {/if}
</MessageBox>

<style>
    .btn-send {
        width: 100px;
        align-self: flex-end;
    }
    span.network-button {
        align-self: flex-end;
    }
</style>


