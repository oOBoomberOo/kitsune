<script>
	import { relativeDate } from "$lib/timing";

	export let timestamp;
	export let period;

	const target = predictTimestamp(timestamp, period);

	export function predictTimestamp(start, interval) {
		const now = new Date();
		const scheduled_on = new Date(start);

		if (scheduled_on > now) {
			return scheduled_on;
		}

		const timeLeft = interval - (now.valueOf() - scheduled_on.valueOf()) % interval;

		return new Date(now.valueOf() + timeLeft);
	}
</script>

<span>
	Next track <time datetime="{target}">{relativeDate(target)}</time>
</span>
