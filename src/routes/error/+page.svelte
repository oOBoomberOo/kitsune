<script>
	import { absoluteDate } from '$lib/timing';

	export let data;
</script>

<main>
	<table>
		<thead>
			<th>Timestamp</th>
			<th>Tracker</th>
			<th>Message</th>
		</thead>

		{#each data.logs as log (log.id)}
			<tr>
				<td class="fit">{absoluteDate(log.created_at)}</td>
				<td class="fit">
					<a href="/tracker/{log.tracker.id}">{log.tracker.id}</a>
				</td>
				<td class="message">
					{log.message}
				</td>
			</tr>
		{/each}
	</table>
</main>

<style>
	main {
		display: flex;
		place-content: center;
	}

	table {
		width: 100%;
		height: auto;
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

		& .fit {
			text-wrap: nowrap;
		}

		& .message {
			text-align: left;
		}
	}
</style>
