<script lang="ts">
	let ingredients = [];
	let recipeName = '';
	let description = '';
	let search = '';

	let selectedIngredients = [];

	async function load() {
		ingredients = await window.api.listIngredients();
	}

	$: filteredIngredients = ingredients.filter((ingredient) =>
		ingredient.name.toLowerCase().includes(search.toLowerCase())
	);

	$: totalPrice = selectedIngredients.reduce((sum, item) => {
		return sum + item.amount * item.price_per_unit;
	}, 0);

	function addIngredient(ingredient) {
		selectedIngredients = [
			...selectedIngredients,
			{
				ingredient_id: ingredient.id,
				name: ingredient.name,
				amount: 0,
				unit: ingredient.package_unit,
				price_per_unit: ingredient.price_per_unit
			}
		];
	}

	function removeIngredient(index) {
		selectedIngredients = selectedIngredients.filter((_, i) => i !== index);
	}

	async function saveRecipe() {
		await window.api.createRecipe({
			name: recipeName,
			description,
			ingredients: selectedIngredients.map((item) => ({
				ingredient_id: item.ingredient_id,
				amount: item.amount,
				unit: item.unit
			}))
		});

		recipeName = '';
		description = '';
		selectedIngredients = [];
	}

	load();
</script>

<h1>New recipe</h1>

<input bind:value={recipeName} placeholder="Recipe name" />
<textarea bind:value={description} placeholder="Description"></textarea>

<h2>Add ingredients</h2>

<input bind:value={search} placeholder="Search ingredient" />

<ul>
	{#each filteredIngredients as ingredient}
		<li>
			{ingredient.name}
			<button on:click={() => addIngredient(ingredient)}>Add</button>
		</li>
	{/each}
</ul>

<h2>Recipe ingredients</h2>

{#each selectedIngredients as item, index}
	<div>
		<strong>{item.name}</strong>

		<input type="number" bind:value={item.amount} placeholder="Amount" />

		<span>{item.unit}</span>

		<span>
			€{(item.amount * item.price_per_unit).toFixed(2)}
		</span>

		<button on:click={() => removeIngredient(index)}>Remove</button>
	</div>
{/each}

<h2>Total: €{totalPrice.toFixed(2)}</h2>

<button on:click={saveRecipe}>Save recipe</button>
