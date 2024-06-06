<script>
	import humannumber from 'human-number';
	import { absoluteDate, relativeDate } from '$lib/timing';
	import Prediction from '$lib/components/Prediction.svelte';
	import Paginator from '$lib/components/Paginator.svelte';

	export let data;

	let { trackers, form } = data;

	function number(text) {
		return humannumber(text, (n) => n.toFixed(2));
	}
</script>

<svelte:head>
	<title>Home - VTuber Music Trackers</title>
</svelte:head>

<section class="search-bar">
	<form method="get" data-sveltekit-reload>
		<select name="key" id="sort-key" value={form.key} required>
			<option value="scheduled_on">Scheduled Time</option>
			<option value="recent_views">Most Recent</option>
			<option value="created_at">Created At</option>
			<option value="interval">Interval</option>
		</select>

		<select name="order" id="sort-order" value={form.order} required>
			<option value="desc">Descending</option>
			<option value="asc">Ascending</option>
		</select>

		<input
			id="search"
			type="search"
			name="q"
			placeholder="Red heart, Stellar Stellar, etc."
			value={form.search}
		/>
		<button type="submit">Search</button>
	</form>

	<div>
		<Paginator pageData={trackers} />
	</div>
</section>

<section>
	<ul class="container">
		{#each trackers.content as tracker (tracker.id)}
			<li>
				<a href="/tracker/{tracker.id}">
					<article class="card" class:stopped={tracker.stopped}>
						<header>
							{@html tracker.title}
						</header>

						<section class="property">
							{#if tracker.milestone}
								{@const views = tracker.current_views ?? 0}

								<div class="milestone">
									<progress value={views} max={tracker.milestone} />

									<div class="subtext">
										<span>{number(views)}</span>
										<span>{number(tracker.milestone)}</span>
									</div>
								</div>
							{/if}

							<div class="timestamp">
								Every <em>{tracker.interval}</em>
								@ <time datetime={tracker.scheduled_on}>{absoluteDate(tracker.scheduled_on)}</time>
							</div>

							{#if tracker.stopped}
								<div>
									Stopped at <time datetime={tracker.stopped_at}
										>{absoluteDate(tracker.stopped_at)}</time
									>
								</div>
							{:else}
								<div class="prediction">
									<Prediction timestamp={tracker.scheduled_on} period={tracker.interval_ms} />
								</div>
							{/if}
						</section>

						<figure class="thumbnail">
							<img loading="lazy" src="https://img.youtube.com/vi/{tracker.video}/0.jpg" alt="" />
						</figure>
					</article>
				</a>
			</li>
		{/each}
	</ul>
</section>

<footer>
	<form action="/submit">
		<input
			type="text"
			name="video"
			id="video"
			placeholder="https://youtu.be/d3UTywBDSW4, qTftVK1M5N0"
			required
		/>
		<button type="submit">Add</button>
	</form>
</footer>

<style>
	.search-bar {
		position: sticky;
		top: 52px;

		background: white;
		display: flex;
		flex-direction: column;
		gap: 15px;
		place-items: center;
		place-content: center;

		padding: 15px;

		& form {
			width: 60%;
			gap: 5px;
			display: grid;
			grid-template-columns: 1fr 1fr 4fr 2fr;
		}

		& #search {
			flex-grow: 1;
		}
	}

	.container {
		list-style: none;
		margin: 15px;
		padding: 0;

		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		grid-auto-rows: 1fr;
		gap: 15px;
	}

	a {
		text-decoration: none;
		color: inherit;
	}

	.card {
		border-radius: 15px;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);

		overflow: hidden;
		margin: 0;
		padding: 0;

		height: 100%;

		display: grid;
		gap: 0 15px;

		grid-template-columns: 150px 1fr;
		grid-template-rows: auto 1fr;

		grid-template-areas:
			'thumbnail title'
			'thumbnail info';

		& em {
			font-style: normal;
			background-color: rgba(145, 188, 236, 0.623);
		}

		& header {
			font-weight: 500;
			margin: 5px;
		}

		&:hover img {
			transform: scale(1.5);
		}
	}

	.thumbnail {
		grid-area: thumbnail;

		margin: 0;
		padding: 0;

		/* aspect-ratio: 1 / 1; */
		object-fit: cover;
		overflow: hidden;
		z-index: -1;

		& img {
			width: 100%;
			height: 100%;
			aspect-ratio: inherit;
			object-fit: inherit;

			transform: scale(1.4);

			transition: 0.2s transform;
		}
	}

	.property {
		display: flex;
		flex-direction: column;

		margin: 15px;
		margin-top: 0;
		gap: 5px;

		font-size: small;
	}

	.timestamp {
		text-align: left;

		& em {
			font-style: italic;
			background-color: initial;
		}
	}

	.milestone {
		display: flex;
		flex-direction: column;

		& progress {
			width: 100%;
		}

		& .subtext {
			display: flex;
			justify-content: space-between;
		}
	}

	footer {
		position: sticky;
		bottom: 0;

		display: flex;
		place-items: center;
		place-content: center;
		padding: 5px;
		background-color: white;

		& form {
			width: 52ch;
			display: flex;
			flex-direction: row;
			gap: 5px;
		}

		& #video {
			flex-grow: 1;
		}
	}

	.stopped {
		filter: grayscale(100%);
		opacity: 0.5;
		pointer-events: none;
	}
	@media (max-width: 600px) {
		.search-bar {
			padding: 5px;
		}

		.search-bar form {
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 1fr 1fr;
			width: 100%;
		}

		.search-bar #search {
			grid-column: 1 / -1;
		}

		.search-bar button {
			display: none;
		}

		.container {
			margin: 0;
			gap: 0;
		}

		.card {
			border-radius: 0;
			gap: 0;
		}
		

	}
</style>
