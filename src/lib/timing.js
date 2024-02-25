import { DateTime } from "luxon";

const TIMEZONE = 'Asia/Tokyo';

export function absoluteDate(text) {
	const time = DateTime.fromISO(text, { zone: TIMEZONE });
	return time.toFormat('yyyy-MM-dd HH:mm');
}

export function relativeDate(date) {
	return DateTime.fromISO(date)
		.toRelative({ style: 'short' })
}

export function localTime(input) {
	return DateTime.fromISO(input, { zone: TIMEZONE }).toFormat("yyyy-MM-dd'T'HH:mm");
}
