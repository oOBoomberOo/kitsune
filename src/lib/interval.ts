import { DateTime } from 'luxon';
import type { Tracker } from './model';
import type { Timestamp } from './model/timestamp';
import { readable } from 'svelte/store';

export function getNextOffset(start: Timestamp, duration: number) {
	const span = start.diffNow().shiftTo('seconds');

	const n = -Math.floor(span.seconds / duration);

	const nextOffset = n * duration;

	return {
		from: start.plus({ seconds: nextOffset - duration }).toMillis(),
		current: DateTime.now().toMillis(),
		to: start.plus({ seconds: nextOffset }).toMillis(),
		duration: nextOffset + span.seconds
	};
}

export function getInterval(tracker: Tracker) {
	const initial = getNextOffset(tracker.track_at, tracker.track_duration);

	return readable(initial, (set) => {
		function reset() {
			const data = getNextOffset(tracker.track_at, tracker.track_duration);
			set(data);

			timeout = setTimeout(reset, data.duration * 1000);
		}

		let timeout = setTimeout(reset, 1);
		return () => clearTimeout(timeout);
	});
}
