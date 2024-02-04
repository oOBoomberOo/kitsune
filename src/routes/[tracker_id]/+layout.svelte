<main>
	<nav>
		<a href="/">Home</a>
	</nav>
	
	<div class="container">
		<slot></slot>
	</div>
</main>


<style>
	main {
		display: flex;
		flex-direction: column;
	}
	
	nav {
		display: flex;
	
		padding: 0.5rem;
		border-bottom: 1px solid var(--secondary-background-color);

		place-content: space-between;
	}

	a {
		color: var(--text-color);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
		cursor: pointer;
	}

	.container {
		display: flex;
		flex-direction: column;
		place-content: center;
		flex-grow: 0;
	}
</style>