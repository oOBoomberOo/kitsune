import { surreal } from '$lib/database.js';

export async function load({ params }) {
	const trackerId = params.id;

	const [tracker = null] = await surreal.query(`
		select
			id,
			title,
			video,
			milestone,
			stopped_at,
			!!stopped_at as stopped,
			scheduled_on,
			interval,
			duration::millis(interval) as period,
			math::max(->recorded->records.views) as views
		from only
			trackers
		where
			id = $tracker
		limit 1
		fetch records;
	`, { tracker: trackerId });

	if (!tracker) {
		return {
			status: 404,
			error: 'Tracker not found'
		}
	}

	return {
		tracker,
	}
}