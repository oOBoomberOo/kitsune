import { trackers } from '$lib/api';
import { Tracker } from '$lib/model';
import { encoder, toEncode } from '$lib/model/helper';

export const prerender = false;

export async function load() {
	return {
		trackers: await trackers().then(toEncode(encoder.array(Tracker)))
	};
}
