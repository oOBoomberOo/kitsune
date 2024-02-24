<script>
	import { localTime } from '$lib/timing';

	export let data;

	let local_scheduled_on = localTime(data.available_at);
</script>

<form method="post">
	<input type="hidden" name="video" value="{data.video}">

	<section>
		<label for="title">Title</label>
		<input type="text" name="title" id="title" value="{data.title}" required>
	</section>

	<section>
		<label for="scheduled-on">Scheduled On</label>
		<input type="datetime-local" name="scheduled-on" id="scheduled-on" value="{local_scheduled_on}" required>
	</section>

	<section>
		<label for="interval">Interval</label>
		<input type="text" name="interval" id="interval" value="{data.interval}" required>
	</section>

	<section>
		<label for="milestone">Milestone</label>
		<input type="number" name="milestone" id="milestone" value="{data.milestone}">
	</section>

	<section>
		<button type="submit">Add Tracker</button>
	</section>

</form>

<style>
	form {
		max-width: 400px;
		margin: 15px auto;
	}

	section {
		margin-bottom: 1em;
	}

	label {
		display: block;
		font-weight: bold;
		font-size: large;
	}

	section:has(input:required) {
		& label::after {
			content: "*";
			color: chocolate;
		}
	}

	input {
		width: 100%;
	}
</style>