<script>
	import Paginator from '$lib/components/Paginator.svelte';
	import { absoluteDate } from '$lib/timing';

	export let data;

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
		const csv = data.records.map((row) => `${row.created_at},${row.views},${row.likes}`).join('\n');

		await navigator.clipboard.writeText(csv);
	}
</script>

<nav>
	<a href="/tracker/{data.id}" class="selected">Stats</a>
	<a href="/tracker/{data.id}/logs">Logs</a>
</nav>

<div class="clipboard">
	<button on:click={copyStatsToClipboard}>Copy to Clipboard</button>
</div>

<div class="paginate">
	<Paginator pageData={data} />
</div>

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
				<td class="repeat">x{item.children.length + 1}</td>
				<td class="timestamp"
					>{absoluteDate(item.time_range.from)} - {absoluteDate(item.time_range.to)}</td
				>
				<td>{number(item.views)}</td>
				<td>{number(item.likes)}</td>
			{:else}
				<td class="repeat"></td>
				<td class="timestamp">{absoluteDate(item.created_at)}</td>
				<td>{number(item.views)}</td>
				<td>{number(item.likes)}</td>
			{/if}
		</tr>
	{/each}
</table>

<style>
	.clipboard {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 1em;
	}

	.paginate {
		display: flex;
		flex-direction: column;
	}
</style>
