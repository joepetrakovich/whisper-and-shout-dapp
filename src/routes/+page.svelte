<script lang="ts">
    import { ethers } from 'ethers'
    import * as sapphire from '@oasisprotocol/sapphire-paratime';
    import Whisper from '$lib/Whisper.json';
    import Shout from '$lib/Shout.json';
    import { onMount } from 'svelte';

    const SHOUT_CONTRACT_ADDRESS="0xea839C7542FB2419B9f71A0bdff6D4fa3dbca792";
    const WHISPER_CONTRACT_ADDRESS="0xebcc16233DE34C1945214C92896eb88182bC8def";

    type Message = { from: string; text: string; timestamp: string };

    let messages: Message[] = [];
    let message: string = '';
    let address: string = '';

	async function getMessages() {
		if (!window.ethereum) {
			return;
		}

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
             .map(normalizeMessage)
             .sort((a: any, b: any) => b.timestamp - a.timestamp);
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
            await transaction.wait();

            address = '';
            message = '';
        
        } catch (error) {
            alert('Error while sending message: ' + error);
        }
    }

    async function getSecretMessages() {
		if (!window.ethereum) {
			return;
		}

        window.ethereum = sapphire.wrap(window.ethereum);

		const whisperContract = new ethers.Contract(
			WHISPER_CONTRACT_ADDRESS,
			Whisper.abi,
            await new ethers.BrowserProvider(window.ethereum).getSigner()
		);

        let receivedMessages = await whisperContract.getMessages();

         const normalizeMessage = (message: any) => ({
             from: message.from,
             text: message.text,
             timestamp: message.timestamp,
         });

         messages = receivedMessages
             .map(normalizeMessage)
             .sort((a: any, b: any) => b.timestamp - a.timestamp);
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

    onMount(() => {
        //getMessages();
        getSecretMessages();
    });
</script>

<div>
    <h1>Whisper & Shout</h1>

    <input bind:value={address} type="text" placeholder="Address" />
    <textarea bind:value={message} rows="5" cols="33" placeholder="Write something..." />
    <button on:click={sendMessage}>Shout</button>
    <button on:click={sendSecretMessage}>Whisper</button>

    <h2>Messages</h2>
        {#if messages.length} 
            <ul>
                {#each messages as message}
                    <li>{message.text}</li>
                {/each}
            </ul>
        {:else}
            <i>No messages yet</i>
        {/if}
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-width: 500px;
        margin: 0 auto;
    }
</style>


