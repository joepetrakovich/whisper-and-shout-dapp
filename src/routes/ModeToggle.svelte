<script lang="ts">
	import { Mode } from "$lib/Models";

    export let mode: Mode;
</script>

<div class="btn-group w-100" role="group">
    <input type="radio" class="btn-check" bind:group={mode} value={Mode.Whisper} name="btnradio" id="whisper" autocomplete="off">
    <label class="btn btn-outline-primary" for="whisper"><i class="bi bi-suit-diamond-fill"></i>&nbsp;Whisper</label>
  
    <input type="radio" class="btn-check" bind:group={mode} value={Mode.Shout} name="btnradio" id="shout" autocomplete="off">
    <label class="btn btn-outline-success" for="shout"><i class="bi bi-gem"></i>&nbsp;Shout</label>
</div>

