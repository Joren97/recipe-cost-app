<script lang="ts">
	let recipes = [];

	// async function load() {
	//   recipes = await window.api.listRecipes();
	// }

	// load();

	import { onMount } from 'svelte';

	onMount(async () => {
		console.log('window.api:', window.api);

		if (!window.api) {
			console.error('Electron preload API is missing');
			return;
		}

		const recipes = await window.api.listRecipes();
		console.log(recipes);
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<h1>Recipes</h1>

<a href="/recipes/new">Create recipe</a>

<ul>
	{#each recipes as recipe}
		<li>
			<a href={`/recipes/${recipe.id}`}>
				{recipe.name} — €{recipe.total_price.toFixed(2)}
			</a>
		</li>
	{/each}
</ul>
