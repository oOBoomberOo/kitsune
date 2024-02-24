<script>
	import Prediction from '$lib/components/Prediction.svelte';
	import { absoluteDate, localTime } from '$lib/timing';

	export let data;

	let tracker = data.tracker;

	let scheduled_on = localTime(tracker.scheduled_on);
	let stats = groupStats(data.records);

	function number(text) {
		const formatter = Intl.NumberFormat('en-US', {
			style: 'decimal'
		});

		return formatter.format(text);
	}

	function groupStats(records) {
		const result = [];

		for (const record of records) {
			const index = result.length - 1;
			const previous = result[index];

			if (previous && previous.views === record.views) {
				previous.children ??= [];
				previous.children.push(record);
				previous.time_range = { from: record.created_at, to: previous.created_at };
				previous.type = 'group';
				result[index] = previous;
			} else {
				result.push(record);
			}
		}

		return result;
	}

	async function copyStatsToClipboard() {

		// copy table to csv
		const csv = data.records
			.map(row => `${row.created_at},${row.views},${row.likes}`)
			.join('\n');

		await navigator.clipboard.writeText(csv);
	}
</script>

<article>
	<form class="info" action="?/update" method="post">
		<section>
			<header>
				Video <span class="id">{tracker.video}</span>
			</header>

			<a href="https://youtu.be/{tracker.video}">{tracker.title}</a>
		</section>

		<section>
			<header>Status</header>
			{#if tracker.stopped_at}
				Stopped at <time datetime={tracker.stopped_at}>{tracker.stopped_at}</time>
			{:else if new Date(tracker.scheduled_on) < new Date()}
				Running since <time datetime={tracker.scheduled_on}>{tracker.scheduled_on}</time>
			{:else}
				Not started yet
			{/if}
		</section>

		<input type="text" name="tracker" hidden value={tracker.id} />
		<input type="text" name="video" hidden value={tracker.video} />

		<section class="field">
			<header>Title</header>
			<input type="text" name="title" id="title" value={tracker.title} required />
		</section>

		<section class="field">
			<header>Scheduled On</header>
			<input
				type="datetime-local"
				name="scheduled_on"
				id="scheduled_on"
				value={scheduled_on}
				required
			/>
		</section>

		<section class="field">
			<header>Interval</header>
			<input type="text" name="interval" value={tracker.interval} required />
		</section>

		<section class="field">
			<header>Milestone</header>
			<input type="number" name="milestone" value={tracker.milestone} />
		</section>

		<section class="action">
			<button class="edit-btn" type="submit">Edit</button>

			<form action="?/stop" method="post">
				<input type="text" name="tracker" hidden value={tracker.id} />

				<button class="stop-btn" type="submit" disabled={tracker.stopped}>Stop</button>
			</form>
		</section>
	</form>

	<section class="video">
		<iframe
			src="https://www.youtube.com/embed/{tracker.video}"
			title={tracker.title}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowfullscreen
		></iframe>
	</section>
</article>

<section class="prediction">
	<Prediction timestamp={tracker.scheduled_on} period={tracker.period} />

	{#if tracker.milestone}
		<div class="separator" />

		{@const views = tracker.views ?? 0}

		<section class="milestone">
			<progress value={views} max={tracker.milestone} />
			<span>{number(views)}</span> / <span>{number(tracker.milestone)}</span>
		</section>
	{/if}
</section>

<hr />

	<section class="clipboard">
		<button on:click={copyStatsToClipboard}>Copy to Clipboard</button>
	</section>

<article id="table">
	<table class="stats">
		<thead>
			<th>Duplicate</th>
			<th>Timestamp</th>
			<th>Views</th>
			<th>Likes</th>
		</thead>

		{#each stats as item (item.id)}
			<tr>

				{#if item.type === 'group'}
					<td>x{item.children.length + 1}</td>
					<td class="timestamp"
						>{absoluteDate(item.time_range.from)} - {absoluteDate(item.time_range.to)}</td
					>
					<td>{number(item.views)}</td>
					<td>{number(item.likes)}</td>
				{:else}
					<td></td>
					<td class="timestamp">{absoluteDate(item.created_at)}</td>
					<td>{number(item.views)}</td>
					<td>{number(item.likes)}</td>
				{/if}
			</tr>
		{/each}
	</table>
</article>

<style>
	.edit-btn:not(:disabled) {
		background-color: deepskyblue;

		&:hover {
			background-color: aqua;
		}
	}

	.stop-btn:not(:disabled) {
		background-color: tomato;

		&:hover {
			background-color: red;
		}
	}

	#table {
		display: grid;

		grid-template-columns: 1fr 60% 1fr;
	}

	.clipboard {
		display: flex;
		justify-content: end;
		margin: 15px;
	}

	.stats {
		grid-column: 2;
		width: 100%;
		font-family: 'Roboto Mono', monospace;

		& th {
			background-color: #f4f4f4;
			padding: 0.5em;
		}

		& td {
			padding: 0.5em;
			text-align: right;
		}

		& tr:nth-child(odd) {
			background-color: #f4f4f4;
		}

		& .timestamp {
			text-wrap: nowrap;
		}
	}

	article {
		display: flex;

		gap: 15px;
		margin: 15px;

		& .id {
			background-color: bisque;
			color: chocolate;

			font-family: 'Roboto Mono', monospace;
			border-radius: 5px;
			padding: 3px 5px;
		}
	}

	.milestone {
		flex-grow: 1;

		display: flex;
		gap: 5px;
		justify-content: center;
		align-items: center;

		font-family: 'Roboto Mono', monospace;

		& progress {
			width: 100%;
		}
	}

	.prediction {
		font-size: small;

		display: flex;
		flex-direction: row;
		gap: 10px;
		margin: 10px;

		& .separator {
			/* vertical bar */
			border: none;
			border-left: 1px solid slategray;
			height: 1lh;
			width: 0;
		}
	}

	.info {
		display: grid;
		flex-grow: 4;

		grid-template-columns: 1fr 1fr;

		gap: 15px;

		& header {
			font-weight: bold;
			margin-bottom: 5px;
		}

		& input {
			width: 100%;
			padding: 5px;
			border: none;
			border-bottom: 1px solid #ccc;
		}

		& .field {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
	}

	.action {
		display: flex;
		flex-direction: row;
		gap: 5px;

		& button {
			padding: 5px 2em;
			border: none;
			border-radius: 3px;
			cursor: pointer;

			justify-self: end;
			align-self: first baseline;
			color: white;
		}
	}

	.video {
		flex-grow: 1;

		align-self: center;

		place-content: center;
		place-items: center;

		display: flex;
		place-content: center;

		aspect-ratio: 16 / 9;
		min-height: 200px;
		height: 100%;
		max-height: 400px;

		& iframe {
			aspect-ratio: 16 / 9;
			width: 100%;
		}
	}
</style>
