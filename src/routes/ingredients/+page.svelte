<script lang="ts">
	let ingredients = [];
	let categories = [];

	let name = '';
	let category_id = '';
	let package_amount = 1000;
	let package_unit = 'g';
	let package_price = 0;

	async function load() {
		ingredients = await window.api.listIngredients();
		categories = await window.api.listCategories();
	}

	async function saveIngredient() {
		await window.api.createIngredient({
			name,
			category_id: Number(category_id),
			package_amount,
			package_unit,
			package_price
		});

		name = '';
		package_price = 0;
		await load();
	}

	load();
</script>

<h1>Ingredients</h1>

<input bind:value={name} placeholder="Ingredient name" />

<select bind:value={category_id}>
	<option value="">Choose category</option>
	{#each categories as category}
		<option value={category.id}>{category.name}</option>
	{/each}
</select>

<input type="number" bind:value={package_amount} />
<input bind:value={package_unit} />
<input type="number" step="0.01" bind:value={package_price} />

<button on:click={saveIngredient}>Save ingredient</button>

<ul>
	{#each ingredients as ingredient}
		<li>
			{ingredient.name} — €{ingredient.package_price} /
			{ingredient.package_amount}{ingredient.package_unit}
		</li>
	{/each}
</ul>
