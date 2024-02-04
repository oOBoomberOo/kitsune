<script lang="ts">
	export let checked: boolean = false;
</script>

<label>
	<slot></slot>
	
	<div class="button">
		<input type="checkbox" bind:checked class:checked={checked}>
		<div class="notch"></div>
	</div>
</label>

<style>
	/* pill toggle button */
	label {
		display: inline-block;
		position: relative;
	
		user-select: none;
		cursor: pointer;

		display: flex;
		gap: 5px;
		place-items: center;

		--button-size: 16px;
		font-size: 12px;
	}

	.button {
		display: inline-block;
		position: relative;
		padding: 4px 4px;
		border-radius: 999px;
		background-color: var(--secondary-background-color);
		color: var(--text-color);
		box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
		cursor: pointer;

		aspect-ratio: 2 / 1;
		height: var(--button-size);
	}

	.button .notch {
		display: block;
		position: absolute;
		width: var(--button-size);
		height: var(--button-size);
		border-radius: 50%;
		background-color: var(--text-color);
		transition: transform 0.1s;
	}

	input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
	}

	label:has(input.checked) {
		& .button {
			background-color: var(--primary-color);
		}

		& .notch {
			transform: translateX(var(--button-size));
		}
	}
	
</style>