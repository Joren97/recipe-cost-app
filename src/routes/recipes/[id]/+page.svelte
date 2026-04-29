<!-- src/routes/recipes/[id]/+page.svelte -->
<script lang="ts">
	let { data } = $props();

	let search = $state('');

	let filteredIngredients = $derived(
		data.ingredients.filter((ingredient) =>
			ingredient.name.toLowerCase().includes(search.toLowerCase())
		)
	);
</script>

<h1>{data.recipe?.name}</h1>

<h2>Add ingredient</h2>

<input bind:value={search} placeholder="Search ingredient..." />

<form method="POST" action="?/addIngredient">
	<select name="ingredientId" required>
		{#each filteredIngredients as ingredient}
			<option value={ingredient.id}>
				{ingredient.name} — €{(ingredient.priceCents / 100).toFixed(2)}
				per {ingredient.amount}{ingredient.unit}
			</option>
		{/each}
	</select>

	<input name="amount" type="number" step="0.01" placeholder="Amount used" required />

	<button>Add</button>
</form>

<h2>Recipe ingredients</h2>

<table>
	<thead>
		<tr>
			<th>Ingredient</th>
			<th>Amount</th>
			<th>Cost</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each data.recipeItems as item}
			<tr>
				<td>{item.ingredientName}</td>
				<td>{item.amount}{item.unit}</td>
				<td>€{(item.lineCostCents / 100).toFixed(2)}</td>
				<td>
					<form method="POST" action="?/removeIngredient">
						<input type="hidden" name="id" value={item.id} />
						<button>Remove</button>
					</form>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<h2>Total: €{(data.totalCents / 100).toFixed(2)}</h2>
