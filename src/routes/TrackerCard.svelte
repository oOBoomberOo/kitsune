<script lang="ts">
	import { formatTracker } from "$lib/display";
	import type { Tracker } from "$lib/model";

	export let tracker: Tracker;
	export let compact: boolean = false;

	$: fmt = formatTracker(tracker);
	$: tracker_url = `/${tracker.id}`;
</script>

<a class:compact={compact} href={tracker_url}>
	<article>
		<header class="thumbnail">
			<img src={fmt.thumbnail_url} alt="youtube thumbnail">
		</header>

		<section class="info">
			<span class="title">
				{tracker.title}
			</span>
			
			<div class="label interval">
				<header>Interval</header>
				<section>{fmt.interval}</section>
			</div>
			
			<div class="label schedule_at">
				<header>Scheduled At</header>
				<section>{fmt.scheduled_at}</section>
			</div>

			<div class="label milestone">
				<header>Milestone</header>
				<section>{fmt.milestone}</section>
			</div>
		</section>
	</article>
</a>

<style>
	article {
		display: flex;
		flex-direction: row;

		border-radius: 15px;
		overflow: hidden;
		box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.1);

		height: 100%;
		width: 100%;
	}

	a {
		display: block;

		text-decoration: none;
		color: var(--text-color);

		height: 100%;
		width: 100%;
	}

	a:hover {
		& img {
			transform: scale(1.1);
		}

		& .title {
			text-decoration: underline;
		}
	}

	.thumbnail {
		flex-shrink: 0;
		display: flex;
		place-items: center;
		overflow: hidden;
		width: 150px;
	}

	.thumbnail img {
		aspect-ratio: 16 / 9;
		object-fit: cover;
		object-position: center;
		width: 100%;
		height: 100%;
		transition: transform 0.2s;
	}

	.info {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, 1fr);
		gap: 5px;
		padding: 15px;
		box-sizing: border-box;

		width: auto;
		height: 100%;
	}

	.label header {
		font-weight: bold;
	}

	.title {
		grid-column: 1 / -1;
		grid-row: 1;

		text-overflow: ellipsis;
		text-wrap: pretty;

		height: fit-content;
		display: -webkit-box;

		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.interval {
		grid-column: 1 / 3;
		grid-row: 3;
	}

	.schedule_at {
		grid-column: 1 / 4;
		grid-row: 2;
	}

	.milestone {
		grid-column: 3;
		grid-row: 3;
	}

	.compact {
		& article {
			border-radius: 0;
			overflow: hidden;
			box-shadow: none;
		}

		& .thumbnail {
			display: none;
		}

		& .info {
			grid-template-columns: repeat(4, 1fr);
			grid-template-rows: 1fr;
			gap: 5px;
			padding: 5px;
			width: 100%;
		}

		& .title {
			grid-column: 1;
			grid-row: 1;
			
			display: block;
			text-wrap: pretty;

			-webkit-line-clamp: 1;
		}

		& .interval {
			grid-column: 2;
			grid-row: 1;
		}

		& .schedule_at {
			grid-column: 3;
			grid-row: 1;
		}

		& .milestone {
			grid-column: 4;
			grid-row: 1;
		}
	}
</style>
