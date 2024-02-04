<script lang="ts">
	import { liveTracker } from "$lib/api";
	import { getInterval } from "$lib/interval";
	import { Tracker } from "$lib/model";
	import { decode } from "$lib/model/helper";
	import { DateTime } from "luxon";
	import { linear } from "svelte/easing";
	import { tweened } from "svelte/motion";

	export let tracker: Tracker;

	const live_tracker = liveTracker(tracker);
	$: interval = getInterval($live_tracker);
	
	$: has_started = min < DateTime.now().toMillis();

	$: min = $interval.from;
	$: max = $interval.to;
	
	$: progress = tweened($interval.current, { 
		duration: $interval.duration * 1000,
		easing: linear,
	});

	$: $progress = $interval.to;

</script>

{#if has_started}
	<meter min={min} value={$progress} max={max}></meter>
{/if}

<style>
	meter {
		width: 100%;

	}

	meter::-webkit-meter-bar {
		background: var(--secondary-background-color);
	}

	meter::-webkit-meter-optimum-value {
		background: hsl(145, 50%, 50%);
	}
</style>