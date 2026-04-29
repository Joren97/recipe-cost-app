<!-- src/routes/ingredients/+page.svelte -->
<script lang="ts">
	let { data } = $props();
</script>

<h1>Ingredients</h1>

<form method="POST" action="?/create">
	<input name="name" placeholder="Ingredient name" required />

	<select name="categoryId" required>
		{#each data.categories as category}
			<option value={category.id}>{category.name}</option>
		{/each}
	</select>

	<input name="priceEuro" type="number" step="0.01" placeholder="Price in euro" required />
	<input name="amount" type="number" step="0.01" placeholder="Package amount" required />

	<select name="unit" required>
		<option value="g">g</option>
		<option value="kg">kg</option>
		<option value="ml">ml</option>
		<option value="l">l</option>
		<option value="piece">piece</option>
	</select>

	<button>Add ingredient</button>
</form>

<ul>
	{#each data.ingredients as ingredient}
		<li>
			{ingredient.name} — €{(ingredient.priceCents / 100).toFixed(2)}
			per {ingredient.amount}{ingredient.unit}
		</li>
	{/each}
</ul>
