<script lang="ts">
	import type { Message } from "$lib/Models";

    export let messages: Message[];
    export let emptyMessage: string = "No messages yet...";
</script>

<div class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
        <slot></slot>
    </div>
    <ul class="list-group list-group-flush">
        {#if messages.length}  
            {#each messages as message}
                <li class="list-group-item d-flex flex-column">
                    <span class="text-muted from">{message.from}</span>
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
    }
</style>