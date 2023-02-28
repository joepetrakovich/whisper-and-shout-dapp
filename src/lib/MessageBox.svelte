<script lang="ts">
	import type { Message } from "$lib/Models";

    export let messages: Message[];
    export let emptyMessage: string = "No messages yet...";

    function convertToDate(timestamp: bigint) {
        const asNumber = Number(timestamp);
        return new Date(asNumber*1000).toDateString();
    }
</script>

<div class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
        <slot></slot>

    </div>
    <ul class="list-group list-group-flush">
        {#if messages.length}  
            {#each messages as message}
                <li class="list-group-item d-flex flex-column">
                    <div class="from">
                        <span>FROM: {message.from}</span> 
                        <small>{convertToDate(message.timestamp)}</small>
                    </div>
                    <b>{message.text}</b>
                </li>
            {/each}
        {:else}
            <li class="list-group-item fst-italic">{emptyMessage}</li>
        {/if}
    </ul>
</div>

<style>
    .from {
        font-size: 0.8rem;
        color: gray;
    }
    .from small {
        float: right;
    }
</style>