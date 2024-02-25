<script>
	import { absoluteDate } from '$lib/timing';

	export let data;
</script>

<svelte:head>
	<title>Logs - {data.logs.length} entries</title>
</svelte:head>

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
		& .fit {
			text-wrap: nowrap;
		}

		& .message {
			text-align: left;
		}
	}

	@media (max-width: 600px) {
		table {
			font-size: 0.8em;
		}

		tr {
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: auto 1fr;
			grid-template-areas:
				"timestamp tracker"
				"message message";
		}

		tr td {
			text-align: left;
			border: none;
		}

		.message {
			grid-area: message;
		}
	}
</style>
