<script lang="ts">
	import type { PageData } from "./$types";

	import { pipe } from "fp-ts/lib/function";
	import { liveTrackers } from "$lib/api";
	import { decoder, toDecode } from "$lib/model/helper";
	import { Tracker } from "$lib/model";
	import TrackerCard from "./TrackerCard.svelte";

	import "./styles.css";
	import ToggleButton from "$lib/ToggleButton.svelte";
	import { localStore } from "$lib/database";

	export let data: PageData;

	const trackers = pipe(data.trackers, toDecode(decoder.array(Tracker)), liveTrackers);
	const compact = localStore("compact", false);

</script>

<div class="option">
	<ToggleButton bind:checked={$compact}>Compact</ToggleButton>
</div>

<div class="tracker-container" class:compact={$compact}>
	{#each $trackers.iter as tracker (tracker.id) }

		<TrackerCard tracker={tracker} compact={$compact} />
		
	{/each}
</div>

<style>
	.option {
		display: block;
		padding: 15px 1em;
	}

	.tracker-container {
		flex-grow: 1;

		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 1em;

		padding: 1em;
	}

	.compact {
		display: grid;
		gap: 0;
		grid-template-columns: 1fr;
		grid-auto-rows: 1fr;

		& > * {
			border-bottom: 1px solid var(--secondary-background-color);
		}
	}
</style>