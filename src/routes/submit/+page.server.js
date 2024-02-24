import { surreal } from '$lib/database.js';
import { fillInVideoInfo, parseVideoId } from '$lib/holodex.js';
import { fromLocalTime, parseMilestone } from '$lib/utils.js';
import { error, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const video = formData.get('video');
		const title = formData.get('title');
		const local_scheduled_on = formData.get('scheduled-on');
		const interval = formData.get('interval');
		const milestone_str = formData.get('milestone');

		const scheduled_on = fromLocalTime(local_scheduled_on);
		const milestone = parseMilestone(milestone_str);

		await surreal.query(`
			create only trackers set
				title = $title,
				video = $video,
				scheduled_on = <datetime> $scheduled_on,
				interval = <duration> $interval,
				milestone = <option<int>> $milestone
			return id;
		`, { title, video, scheduled_on, interval, milestone });

		return redirect(308, `/`);
	}
}

export async function load({ url }) {
	const video = url.searchParams.get('video');

	if (!video) {
		error(400, 'Invalid request');
	}

	const video_id = parseVideoId(video);
	const info = fillInVideoInfo(video_id);

	return info;
}