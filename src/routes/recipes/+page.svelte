<!-- src/routes/recipes/+page.svelte -->
<script lang="ts">
	let { data } = $props();
</script>

<h1>Recipes</h1>

<form method="POST" action="?/create">
	<input name="name" placeholder="Recipe name" required />
	<button>Create recipe</button>
</form>

<ul>
	{#each data.recipes as recipe}
		<li>
			<a href={`/recipes/${recipe.id}`}>{recipe.name}</a>
		</li>
	{/each}
</ul>
