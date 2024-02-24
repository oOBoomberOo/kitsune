<script>
	import { page } from "$app/stores"
</script>

<main>
	<h1>{$page.status}</h1>
	<p>{$page.error.message}</p>
</main>

<style>
	main {
		margin: 15px 2em;
	}
</style>