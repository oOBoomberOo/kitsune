<script>
	import './styles.css';
</script>

<nav>
	<a data-sveltekit-reload href="/">Home</a>
	<a data-sveltekit-reload href="/error">Errors</a>
</nav>

<slot></slot>

<style>
	nav {
		position: sticky;
		top: 0;
		left: 0;
		background-color: #333;
		color: white;
		padding: 1rem;

		z-index: 5;

		display: flex;
		gap: 15px;
	}

	a {
		color: whitesmoke;
		text-decoration: dashed;

		&:hover {
			text-decoration: underline;
		}
	}
</style>