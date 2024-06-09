import { surreal } from '$lib/database.js';
import * as z from "zod";

export const prerender = false;

export const actions = {
	default: async () => { }
}

const Key = z.enum(["scheduled_on", "created_at", "recent_views", "interval"]);
const Ordering = z.enum(["asc", "desc"]);

async function getTrackers({ page, pageSize, search, key, order }) {
	const [allItems] = await surreal.query(`select id from trackers where title @1@ $search OR video contains $search;`, { search });

	const count = allItems.length;

	const totalPages = Math.ceil(count / pageSize) + 1;
	const currentPage = Math.min(page, totalPages);

	const start = Math.max((currentPage - 1) * pageSize, 0);

	const [content] = await surreal.query(`
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
			search::highlight('<em>', '</em>', 1) as title
		from
			trackers
		where
			title @1@ $search OR video contains $search
		order by
			${key} ${order} -- SQL injection!! Surreal does not support this level of dynamic SQL, make sure to validate them before using them in a query
		START $start LIMIT $pageSize
		fetch stats;
	`, { search, start, pageSize });

	const isFirstPage = page === 1;
	const isLastPage = page === totalPages;

	return { content, isFirstPage, isLastPage, totalPages, currentPage, pageSize };
}

export async function load({ url }) {
	const search = url.searchParams.get('q') ?? "";
	const rawKey = url.searchParams.get('key') ?? "scheduled_on";
	const rawOrder = url.searchParams.get('order') ?? "desc";

	const rawPage = url.searchParams.get('page') ?? "1";
	const rawPageSize = url.searchParams.get('pageSize') ?? "100";

	const key = Key.parse(rawKey);
	const order = Ordering.parse(rawOrder);
	const page = parseInt(rawPage, 10);
	const pageSize = parseInt(rawPageSize, 10);

	const result = await getTrackers({ page, pageSize, search, key, order });

	return {
		form: { search, key, order },
		trackers: result
	};
}
