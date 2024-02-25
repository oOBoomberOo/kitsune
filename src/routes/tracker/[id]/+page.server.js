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

export async function load({ params }) {
	const trackerId = params.id;

	const [records, logs] = await surreal.query(`
		select
			id, created_at, views, likes
		from
			records
		where
			tracker = $tracker
		order by
			created_at desc;

		select
			*
		from
			logs
		where
			<-wrote<-trackers contains $tracker;
	`, { tracker: trackerId });

	return {
		id: trackerId,
		records,
		logs,
	}
}