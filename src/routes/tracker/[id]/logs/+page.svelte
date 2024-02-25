<script>
	import { absoluteDate } from '$lib/timing.js';

	export let data;
</script>

<nav>
	<a href="/tracker/{data.id}">Stats</a>
	<a href="/tracker/{data.id}/logs" class="selected">Logs</a>
</nav>

<table>
	<thead>
		<th>Timestamp</th>
		<th>Message</th>
	</thead>

	{#each data.logs as log (log.id)}
		<tr>
			<td class="timestamp">{absoluteDate(log.created_at)}</td>
			<td>{log.message}</td>
		</tr>
	{/each}
</table>

<style>
	table > tr > td {
		text-align: left;
	}
</style>
