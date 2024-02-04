import { Duration } from 'luxon';
import type { Tracker } from './model';
import type { Timestamp } from './model/timestamp';

const num = Intl.NumberFormat();

export function formatTracker(tracker: Tracker) {
	return {
		thumbnail_url: `http://i3.ytimg.com/vi/${tracker.video_id}/maxresdefault.jpg`,
		video_url: `https://www.youtube.com/watch?v=${tracker.video_id}`,
		interval: getInterval(tracker.track_duration),
		scheduled_at: getTimestamp(tracker.track_at),
		milestone: getMilestone(tracker.track_target)
	};
}

function getInterval(seconds: number) {
	return Duration.fromObject({ seconds }).rescale().toHuman();
}

export function getTimestamp(timestamp: Timestamp) {
	return timestamp.toLocal().toFormat('yyyy-MM-dd HH:mm');
}

export function getNumber(value: number) {
	return num.format(value);
}

function getMilestone(target: number | null) {
	return target ? num.format(target) : 'None';
}
