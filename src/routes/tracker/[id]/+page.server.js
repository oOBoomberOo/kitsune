import { surreal } from '$lib/database.js';
import { fromLocalTime, parseMilestone } from '$lib/utils.js';

export const prerender = false;

export const actions = {
	update: async ({ request }) => {
		const formData = await request.formData();

		// hidden data
		const tracker = formData.get('tracker');
		const video = formData.get('video');

		// form data
		const title = formData.get('title');
		const local_scheduled_on = formData.get('scheduled_on');
		const interval = formData.get('interval');
		const milestone_str = formData.get('milestone');

		const scheduled_on = fromLocalTime(local_scheduled_on);
		const milestone = parseMilestone(milestone_str);

		await surreal.query(`
			update $tracker set
				title = $title,
				video = $video,
				scheduled_on = <datetime> $scheduled_on,
				interval = <duration> $interval,
				milestone = <option<int>> $milestone;
		`, { tracker, title, video, scheduled_on, interval, milestone });
	},

	stop: async ({ request }) => {
		const formData = await request.formData();
		const tracker = formData.get('tracker');
		await surreal.query(`update $tracker set stopped_at = time::now();`, { tracker })
	},
}

function parseNumber(input, fallback) {
	if (!input) {
		return fallback;
	}

	const number = parseInt(input);
	return isNaN(number) ? fallback : number;
}

export async function load({ params, url }) {
	const trackerId = params.id;

	const page = parseNumber(url.searchParams.get('page'), 1);
	const pageSize = parseNumber(url.searchParams.get('pageSize'), 100);

	const [allRecords] = await surreal.query(`select id from records where tracker = $tracker;`, { tracker: trackerId });
	const count = allRecords.length;

	const totalPages = Math.ceil(count / pageSize);
	const currentPage = Math.min(page, totalPages);

	const start = (currentPage - 1) * pageSize;
	const isFirstPage = page === 1;
	const isLastPage = page === totalPages;

	const [records] = await surreal.query(`
		select
			id, created_at, views, likes
		from
			records
		where
			tracker = $tracker
		order by
			created_at desc
		start $start limit $pageSize;
	`, { tracker: trackerId, start, pageSize });

	return {
		id: trackerId,
		records,
		isFirstPage,
		isLastPage,
		currentPage,
		totalPages,
	}
}