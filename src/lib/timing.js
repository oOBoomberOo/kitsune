
const relativeDateFormatter = new Intl.RelativeTimeFormat('en', {
	numeric: 'auto'
});

const dateFormatter = new Intl.DateTimeFormat('en', {
	hour12: false,
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit'
});

export function absoluteDate(text) {
	return dateFormatter.format(new Date(text));
}

export function relativeDate(date) {
	function getUnit(secs) {
		if (secs < 60 * 2) {
			return relativeDateFormatter.format(secs, 'second');
		}

		if (secs < 3600) {
			return relativeDateFormatter.format(Math.round(secs / 60), 'minute');
		}

		if (secs < 86400) {
			return relativeDateFormatter.format(Math.round(secs / 3600), 'hour');
		}

		if (secs < 604800) {
			return relativeDateFormatter.format(Math.round(secs / 86400), 'day');
		}

		if (secs < 2419200) {
			return relativeDateFormatter.format(Math.round(secs / 604800), 'week');
		}

		if (secs < 29030400) {
			return relativeDateFormatter.format(Math.round(secs / 2419200), 'month');
		}

		return relativeDateFormatter.format(Math.round(secs / 29030400), 'year');
	}

	const now = new Date();

	const diff = Math.round((date - now) / 1000);

	return getUnit(diff);
}
export function localTime(input) {
	const date = new Date(input);

	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const hour = date.getHours().toString().padStart(2, '0');
	const minute = date.getMinutes().toString().padStart(2, '0');

	return `${year}-${month}-${day}T${hour}:${minute}`
}