import { surreal } from '$lib/database.js';
import * as z from "zod";

export const prerender = false;

export const actions = {
	default: async () => { }
}

const Key = z.enum(["scheduled_on", "created_at", "recent_views", "interval"]);
const Ordering = z.enum(["asc", "desc"]);

async function getTrackers({ search, key, order }) {
	return await surreal.query(`
		select
			id,
			created_at,
			scheduled_on,
			stopped_at,
			!!stopped_at as stopped,
			interval,
			duration::millis(interval) as interval_ms,
			milestone,
			video,
			search::highlight('<em>', '</em>', 1) as title,
			math::max(->recorded->records.views) as current_views,
			array::last(array::sort(->recorded->records.created_at)) as recent_views
		from
			trackers
		where
			title @1@ $search
			or video contains $search
		order by
			${key} ${order} -- SQL injection!! Surreal does not support this level of dynamic SQL, make sure to validate them before using them in a query
		fetch stats;
	`, { search });

}

export async function load({ url }) {
	const search = url.searchParams.get('q');
	const rawKey = url.searchParams.get('key') ?? "scheduled_on";
	const rawOrder = url.searchParams.get('order') ?? "desc";

	const key = Key.parse(rawKey);
	const order = Ordering.parse(rawOrder);

	const [trackers = []] = await getTrackers({ search, key, order });

	return {
		form: { search, key, order },
		trackers
	};
}
