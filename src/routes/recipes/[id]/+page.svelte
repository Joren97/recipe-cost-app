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

<svelte:head>
	<title>{data.recipe?.name ?? 'Recipe'}</title>
</svelte:head>

<section class="">
	<header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
		<div class="space-y-2">
			<a href="/recipes" class="text-sm opacity-60 hover:opacity-100">← Back to recipes</a>
			<p class="text-sm font-medium tracking-wide uppercase opacity-60">Recipe costing</p>
			<h1 class="h1">{data.recipe?.name}</h1>
		</div>

		<div class="card p-5 text-right">
			<p class="text-sm opacity-60">Total cost</p>
			<p class="text-3xl font-bold">€{(data.totalCents / 100).toFixed(2)}</p>
		</div>
	</header>

	<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
		<div class="h-fit card p-6">
			<div class="mb-6 space-y-1">
				<h2 class="h3">Add ingredient</h2>
				<p class="text-sm opacity-60">Search for an ingredient and add the amount used.</p>
			</div>

			<div class="mb-4">
				<label class="label">
					<span>Search</span>
					<input class="input" bind:value={search} placeholder="Search ingredient..." />
				</label>
			</div>

			<form method="POST" action="?/addIngredient" class="flex flex-col gap-4">
				<label class="label">
					<span>Ingredient</span>
					<select class="select" name="ingredientId" required>
						{#each filteredIngredients as ingredient}
							<option value={ingredient.id}>
								{ingredient.name} — €{(ingredient.priceCents / 100).toFixed(2)}
								per {ingredient.amount}{ingredient.unit}
							</option>
						{/each}
					</select>
				</label>

				<label class="label">
					<span>Amount used</span>
					<input
						class="input"
						name="amount"
						type="number"
						step="0.01"
						placeholder="Example: 250"
						required
					/>
				</label>

				<button class="btn preset-filled-primary-500" type="submit"> Add ingredient </button>
			</form>
		</div>

		<div class="overflow-hidden card">
			<div class="border-surface-200-800-token flex items-center justify-between border-b p-4">
				<div>
					<h2 class="h3">Recipe ingredients</h2>
					<p class="text-sm opacity-60">Ingredients currently used in this recipe.</p>
				</div>

				<span class="preset-tonal-primary-500 badge">
					{data.recipeItems.length}
					{data.recipeItems.length === 1 ? 'item' : 'items'}
				</span>
			</div>

			{#if data.recipeItems.length > 0}
				<div class="overflow-x-auto">
					<table class="table">
						<thead>
							<tr>
								<th>Ingredient</th>
								<th>Amount</th>
								<th>Cost</th>
								<th class="text-right">Action</th>
							</tr>
						</thead>
						<tbody>
							{#each data.recipeItems as item}
								<tr>
									<td class="font-medium">{item.ingredientName}</td>
									<td>{item.amount}{item.unit}</td>
									<td>€{(item.lineCostCents / 100).toFixed(2)}</td>
									<td class="text-right">
										<form method="POST" action="?/removeIngredient">
											<input type="hidden" name="id" value={item.id} />
											<button class="preset-tonal-error-500 btn" type="submit"> Remove </button>
										</form>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<div class="p-8 text-center">
					<p class="font-medium">No ingredients yet</p>
					<p class="mt-1 text-sm opacity-60">
						Add the first ingredient using the form on the left.
					</p>
				</div>
			{/if}

			<div class="border-surface-200-800-token flex items-center justify-end gap-4 border-t p-4">
				<span class="text-sm opacity-60">Total</span>
				<span class="text-2xl font-bold">€{(data.totalCents / 100).toFixed(2)}</span>
			</div>
		</div>
	</div>
</section>
