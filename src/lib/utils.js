

export function fromLocalTime(input) {
	return new Date(`${input}+09:00`);
}

export function parseMilestone(milestone) {
	if (milestone === '') {
		return undefined;
	}

	return parseInt(milestone);
}