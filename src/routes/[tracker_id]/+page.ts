import { stats, tracker } from '$lib/api';
import { Stats, Tracker } from '$lib/model.js';
import { toEncode, toEncodeList } from '$lib/model/helper.js';

export const prerender = false;

export async function load({ params }) {
	return {
		tracker: await tracker(params.tracker_id).then(toEncode(Tracker)),
		stats: await stats(params.tracker_id).then(toEncodeList(Stats))
	};
}
