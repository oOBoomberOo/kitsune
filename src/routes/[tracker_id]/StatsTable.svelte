<script lang="ts">
	import { liveStatsByTrackerId } from "$lib/api";
	import { getNumber, getTimestamp } from "$lib/display";
	import type { Stats } from "$lib/model";
	import type { Timestamp } from "$lib/model/timestamp";
	import { array } from "fp-ts";
	import { getFoldable } from "fp-ts/lib/ReadonlyRecord";
	import groupBy from "object.groupby";

	export let tracker_id: string;
	export let initial: Stats[];

	const stats = liveStatsByTrackerId(tracker_id, initial);

	$: items = stacked($stats);

	function stacked(iter: Iterable<Stats>) {
		type Data = { count: number, id: string, views: number, likes: number, created_at: Timestamp };

		const buffer = new Map<number, Data>();

		for (const item of iter) {
			const { id, created_at, views, likes } = item;

			let content = buffer.get(views);
			content ??= { count: 0, id, views, likes, created_at };
			content.count += 1;
			content.views = views;
			content.likes = likes;

			if (content.created_at < created_at) {
				content.created_at = created_at;
			}

			buffer.set(views, content);
		}

		return Array.from(buffer.values())
			.toSorted((a, b) => b.created_at.valueOf() - a.created_at.valueOf());
	}

	function getFold(n: number) {
		if (n <= 1) {
			return "";
		} else {
			return `x${n}`;
		}
	}
</script>

<table>
	<thead>
		<th>Timestamp</th>
		<th>Views</th>
		<th>Likes</th>
		<th></th>
	</thead>

	<tbody>
		{#each items as item (item.id)}
			<tr>
				<td>{getTimestamp(item.created_at)}</td>
				<td>{getNumber(item.views)}</td>
				<td>{getNumber(item.likes)}</td>
				<td>{getFold(item.count)}</td>
			</tr>
		{/each}
	</tbody>
</table>

{#if $stats.length === 0}
	<div class="empty-table">
		No stats yet
	</div>
{/if}

<style>
	table {
		width: 100%;
		border-collapse: collapse;

	}

	th, td {
		padding: 0.5rem;
		border-bottom: 1px solid var(--secondary-background-color);
		text-align: right;
	}

	tr:nth-child(even) {
		background-color: var(--secondary-background-color);
	}

	tr:hover {
		background-color: var(--hover-background-color);
	}

	div.empty-table {
		display: inline-block;
		padding: 1rem;
		box-sizing: border-box;
		text-align: center;
		color: var(--secondary-text-color);
		font-size: 14px;
		width: 100%;
	}
</style>