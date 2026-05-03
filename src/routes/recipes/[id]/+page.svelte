<!-- src/routes/recipes/[id]/+page.svelte -->
<script lang="ts">
	let { data } = $props();

	let search = $state('');

	let filteredIngredients = $derived(
		data.ingredients.filter((ingredient) =>
			ingredient.name.toLowerCase().includes(search.toLowerCase())
		)
	);

	function vatPriceCents(priceVatExclusiveCents: number, vatPercentage: number) {
		return Math.round(priceVatExclusiveCents * (vatPercentage / 100));
	}

	function priceVatInclusiveCents(priceVatExclusiveCents: number, vatPercentage: number) {
		return priceVatExclusiveCents + vatPriceCents(priceVatExclusiveCents, vatPercentage);
	}

	function euro(cents: number) {
		return `€${(cents / 100).toFixed(2)}`;
	}
</script>

<svelte:head>
	<title>{data.recipe?.name ?? 'Recept'}</title>
</svelte:head>

<section class="flex flex-col gap-8">
	<header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
		<div class="space-y-2">
			<a href="/recipes" class="text-sm opacity-60 hover:opacity-100">← Terug naar recepten</a>
			<p class="text-sm font-medium tracking-wide uppercase opacity-60">Recept kostprijs</p>
			<h1 class="h1">{data.recipe?.name}</h1>

			{#if data.recipe?.categoryName}
				<span class="preset-tonal-primary-500 badge">{data.recipe.categoryName}</span>
			{/if}
		</div>

		<div class="card p-5 text-right">
			<p class="text-sm opacity-60">Totale kostprijs</p>
			<p class="text-3xl font-bold">{euro(data.totalCents)}</p>
		</div>
	</header>

	<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
		<div class="h-fit card p-6">
			<div class="mb-6 space-y-1">
				<h2 class="h3">Ingrediënt toevoegen</h2>
				<p class="text-sm opacity-60">Zoek een ingrediënt en voeg de gebruikte hoeveelheid toe.</p>
			</div>

			<div class="mb-4">
				<label class="label">
					<span>Zoeken</span>
					<input class="input" bind:value={search} placeholder="Zoek ingrediënt..." />
				</label>
			</div>

			<form method="POST" action="?/addIngredient" class="flex flex-col gap-4">
				<label class="label">
					<span>Ingrediënt</span>
					<select class="select" name="ingredientId" required>
						{#each filteredIngredients as ingredient (ingredient.id)}
							<option value={ingredient.id}>
								{ingredient.name} —
								{euro(
									priceVatInclusiveCents(
										ingredient.priceVatExclusiveCents,
										ingredient.vatPercentage
									)
								)}
								incl. btw per {ingredient.amount}{ingredient.unit}
							</option>
						{/each}
					</select>
				</label>

				<label class="label">
					<span>Gebruikte hoeveelheid</span>
					<input
						class="input"
						name="amount"
						type="number"
						step="0.01"
						placeholder="Bijv.: 250"
						required
					/>
				</label>

				<button class="btn preset-filled-primary-500" type="submit"> Ingrediënt toevoegen </button>
			</form>
		</div>

		<div class="overflow-hidden card">
			<div class="border-surface-200-800-token flex items-center justify-between border-b p-4">
				<div>
					<h2 class="h3">Receptingrediënten</h2>
					<p class="text-sm opacity-60">Ingrediënten die momenteel in dit recept zitten.</p>
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
								<th>Ingrediënt</th>
								<th>Hoeveelheid</th>
								<th>Prijs incl. btw</th>
								<th>Btw %</th>
								<th>Kostprijs</th>
								<th class="text-right">Actie</th>
							</tr>
						</thead>

						<tbody>
							{#each data.recipeItems as item (item.id)}
								<tr>
									<td class="font-medium">{item.ingredientName}</td>
									<td>{item.amount}{item.unit}</td>
									<td>{euro(item.priceVatInclusiveCents)}</td>
									<td>{item.vatPercentage}%</td>
									<td>{euro(item.lineCostCents)}</td>
									<td class="text-right">
										<form method="POST" action="?/removeIngredient">
											<input type="hidden" name="id" value={item.id} />
											<button class="preset-tonal-error-500 btn" type="submit">
												Verwijderen
											</button>
										</form>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<div class="p-8 text-center">
					<p class="font-medium">Nog geen ingrediënten</p>
					<p class="mt-1 text-sm opacity-60">
						Voeg het eerste ingrediënt toe via het formulier links.
					</p>
				</div>
			{/if}

			<div class="border-surface-200-800-token flex items-center justify-end gap-4 border-t p-4">
				<span class="text-sm opacity-60">Totaal</span>
				<span class="text-2xl font-bold">{euro(data.totalCents)}</span>
			</div>
		</div>
	</div>
</section>
