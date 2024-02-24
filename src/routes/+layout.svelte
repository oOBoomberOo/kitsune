<script>
	import './styles.css';
</script>

<nav>
	<a data-sveltekit-reload href="/">Home</a>
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
	}

	a {
		color: whitesmoke;
		text-decoration: dashed;

		&:hover {
			text-decoration: underline;
		}
	}
</style>