<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

	interface Page {
	currentPage: number;
	totalPages: number;
	isFirstPage: boolean;
	isLastPage: boolean;
	}

	export let pageData: Page;
	

	async function changePage(target: number) {
		const n = Math.min(Math.max(target, 1), pageData.totalPages);

		const query = $page.url.searchParams;
		query.set("page", n.toString());

		await goto(`?${query}`, { invalidateAll: true });
		location.reload();
	}
</script>

<div class="paginate">
	<button on:click={() => changePage(1)}>1</button>
	<button disabled={pageData.isFirstPage} on:click={() => changePage(pageData.currentPage - 1)}> {"<<"} </button>
	
	<span>{pageData.currentPage}</span>
	
	<button disabled={pageData.isLastPage} on:click={() => changePage(pageData.currentPage + 1)}> {">>"} </button>
	<button on:click={() => changePage(pageData.totalPages)}>{pageData.totalPages}</button>
</div>

<style>
	.paginate {
		margin: 15px;
		place-self: center;
	}
</style>