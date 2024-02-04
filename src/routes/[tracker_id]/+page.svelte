<script lang="ts">
	import { liveStatsByTrackerId, liveTracker } from "$lib/api";
	import type { PageData } from "./$types";
	import { decode, decodeList } from "$lib/model/helper";
	import { Stats, Tracker } from "$lib/model";
	import { formatTracker } from "$lib/display";
	import "../styles.css";
	import StatsTable from "./StatsTable.svelte";
	import IntervalBar from "./IntervalBar.svelte";

	export let data: PageData;

	const stats = decodeList(Stats, data.stats);
	const tracker = liveTracker(decode(Tracker, data.tracker));

	$: fmt = formatTracker($tracker);

	function copyVideoId() {
		navigator.clipboard.writeText($tracker.video_id);
	}
</script>

<article>
	<section class="video_info">
		<h1>Video</h1>

		<div class="container">
			<div class="thumbnail">
				<img src={fmt.thumbnail_url} alt="youtube thumbnail">
			</div>

			<section class="details">
				<div class="label video_id">
					<header>Video ID</header>
					<button on:click={copyVideoId}>{$tracker.video_id}</button>
				</div>

				<div class="label title">
					<header>Title</header>
					<section>
						<a href={fmt.video_url}>{$tracker.title}</a>
					</section>
				</div>

				<div class="label scheduled_at">
					<header>Scheduled At</header>
					<section>{fmt.scheduled_at}</section>
				</div>
				
				<div class="label interval">
					<header>Interval</header>
					<section>{fmt.interval}</section>
				</div>
				
				<div class="label milestone">
					<header>Milestone</header>
					<section>{fmt.milestone}</section>
				</div>

				<div class="interval-bar">
					<IntervalBar tracker={$tracker} />
				</div>
			</section>
		</div>
	</section>

	<section class="stats">
		<h1>Stats</h1>

		<div class="table">
			<StatsTable initial={stats} tracker_id={$tracker.id} />
		</div>
	</section>

</article>

<style>
	article {
		display: grid;
		grid-template-columns: 3fr 2fr;
		grid-template-rows: 100%;

		margin: 0 20px;
		gap: 25px;

		max-height: 90vh;
	}

	h1 {
		font-size: 25px;
	}

	.stats {
		overflow: auto;

	}

	.video_info .container {
		display: flex;
		gap: 5px;
		align-items: center;
		height: 180px;
	}

	.thumbnail {
		height: 100%;
	}

	.thumbnail img {
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 5px;
		height: 100%;
	}

	.details {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, 1fr), 10px;
		gap: 5px 15px;
	}

	.title {
		grid-column: 1 / -1;
	}

	.video_id button {
		font-family: 'Fira Code', monospace;

		background-color: var(--primary-color);
		color: var(--text-color);
		padding: 3px 7px;
		border-radius: 3px;
		width: fit-content;

		border: none;
		outline: none;
		cursor: pointer;

		&:hover {
			background-color: var(--primary-color-dark);
		}

		&:active {
			transform: scale(0.95);
		}
	}

	.label header {
		font-weight: bold;
	}

	.interval-bar {
		grid-column: 1 / -1;
		padding: 0 15px;
	}

	@media (max-width: 680px) {
		.video_info .container {
			flex-direction: column;
			height: auto;
			align-items: stretch;
		}

		.container .thumbnail img {
			height: 180px;
		}
	}

	@media (max-width: 1100px) {
		article {
			grid-template-columns: 1fr;
			grid-template-rows: auto;
			width: 100%;
			gap: 0px;
		}

		.stats {
			overflow: initial;
		}
	}
</style>