<script>
	import { relativeDate } from "$lib/timing";
	import { DateTime } from "luxon";

	export let timestamp;
	export let period;

	const target = predictTimestamp(timestamp, period);

	export function predictTimestamp(start, interval) {
		const now = DateTime.now();
		const scheduled_on = DateTime.fromISO(start);

		if (scheduled_on > now) {
			return scheduled_on;
		}

		const timeLeft = interval - (now.valueOf() - scheduled_on.valueOf()) % interval;

		return DateTime.fromMillis(now.valueOf() + timeLeft);
	}
</script>

<span>
	Next track <time datetime="{target}">{relativeDate(target)}</time>
</span>
