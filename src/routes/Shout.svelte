<script lang="ts">
    import { ethers } from 'ethers'
    import Shout from '$lib/Shout.json';
	import { Mode, OasisNetworkStatus, type Message } from '$lib/Models';
	import NetworkButton from './NetworkButton.svelte';
    import { createEventDispatcher } from 'svelte';
	import MessageBox from './MessageBox.svelte';

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
    
    let connectedToEmerald: boolean;
    $: connectedToEmerald = networkStatus === OasisNetworkStatus.ON_EMERALD_PARATIME;

    const SHOUT_CONTRACT_ADDRESS: string = "0xea839C7542FB2419B9f71A0bdff6D4fa3dbca792";

    let address: string = '';
    let message: string = '';
    let messages: Message[] = []; 

    let refreshing: boolean = false;
    let sending: boolean = false;
    let tx: Promise<any> | undefined;

	async function getMessages() {
        refreshing = true;
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const shoutContract = new ethers.Contract(
            SHOUT_CONTRACT_ADDRESS,
            Shout.abi,
            signer
        );

        let receivedMessages = await shoutContract.getMessages();

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
        refreshing = false;
    }

    async function sendMessage() {   
        try {
            sending = true;
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
            <input bind:value={address} id="address" class="form-control" type="text" placeholder="Address" />
        </div>
        <div class="mb-3">
            <textarea bind:value={message} id="message" class="form-control" rows="4" cols="33" placeholder="Write something... (everyone can see)" />
            {#await tx}
                <div class="tx-pending">
                    <span class="spinner-grow spinner-grow-sm text-secondary" role="status"></span>
                    Transaction pending...
                </div>
            {/await}
        </div>

        <div class="d-flex justify-content-between">
            <img src="emerald-certified.png" alt="emerald-certified" class="gem" height="56">
            {#if connectedToEmerald}
                <div class="send-container">
                    <a href="https://faucet.testnet.oasis.dev/" target="_blank" rel="noreferrer" class="text-success">Get Testnet Tokens<i class="bi bi-droplet-fill ms-1"></i></a>
                    {#if sending}
                        <button class="btn btn-success" type="button" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Sending...
                        </button>
                    {:else}
                        <button class="btn btn-success btn-send" on:click={sendMessage}>Send</button>
                    {/if}
                </div>
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
        {#if refreshing}
            <button class="btn btn-sm btn-secondary" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Refreshing...
            </button>
        {:else}
            <button class="btn btn-sm btn-secondary" on:click={getMessages}>Refresh</button>  
        {/if}
    {/if}
</MessageBox>


