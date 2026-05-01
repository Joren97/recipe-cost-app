<script lang="ts">
	let { data } = $props();

	let editingId = $state<number | null>(null);
	import { PencilIcon, Trash2Icon } from '@lucide/svelte';

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
	<title>Ingrediënten</title>
</svelte:head>

<section class="">
	<header class="space-y-2">
		<p class="text-sm font-medium tracking-wide uppercase opacity-60">Recept kostprijs</p>
		<h1 class="h1">Ingrediënten</h1>
		<p class="opacity-70">Beheer je ingrediëntprijzen, verpakkingshoeveelheden en eenheden.</p>
	</header>

	<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
		<div class="h-fit card p-6">
			<div class="mb-6 space-y-1">
				<h2 class="h3">Ingrediënt toevoegen</h2>
				<p class="text-sm opacity-60">
					Maak een ingrediënt met prijs en koppel het aan een categorie.
				</p>
			</div>

			<form method="POST" action="?/create" class="flex flex-col gap-4">
				<label class="label">
					<span>Naam</span>
					<input class="input" name="name" placeholder="Bijv.: Bloem" required />
				</label>

				<label class="label">
					<span>Categorie</span>
					<select class="select" name="categoryId" required>
						{#each data.categories as category (category.id)}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
				</label>

				<div class="grid gap-4 sm:grid-cols-2">
					<label class="label">
						<span>Prijs excl. btw</span>
						<input class="input" name="priceVatExclusiveEuro" type="number" step="0.01" required />
					</label>

					<label class="label">
						<span>Btw-percentage</span>
						<input
							class="input"
							name="vatPercentage"
							type="number"
							step="0.01"
							value="6"
							required
						/>
					</label>

					<label class="label">
						<span>Verpakkingshoeveelheid</span>
						<input class="input" name="amount" type="number" step="0.01" required />
					</label>
				</div>

				<label class="label">
					<span>Eenheid</span>
					<select class="select" name="unit" required>
						<option value="g">g</option>
						<option value="kg">kg</option>
						<option value="ml">ml</option>
						<option value="l">l</option>
						<option value="piece">stuk</option>
					</select>
				</label>

				<button class="btn preset-filled-primary-500" type="submit"> Ingrediënt toevoegen </button>
			</form>
		</div>

		<div class="overflow-hidden card">
			<div class="border-surface-200-800-token flex items-center justify-between border-b p-4">
				<div>
					<h2 class="h3">Alle ingrediënten</h2>
					<p class="text-sm opacity-60">Bewerk of verwijder bestaande ingrediënten.</p>
				</div>

				<span class="preset-tonal-primary-500 badge">
					{data.ingredients.length}
					{data.ingredients.length === 1 ? 'ingrediënt' : 'ingrediënten'}
				</span>
			</div>

			{#if data.ingredients.length > 0}
				<div class="overflow-x-auto">
					<table class="table">
						<thead>
							<tr>
								<th>Naam</th>
								<th>Prijs excl. btw</th>
								<th>Btw %</th>
								<th>Btw-bedrag</th>
								<th>Prijs incl. btw</th>
								<th>Verpakking</th>
								<th>Eenheidsprijs incl. btw</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{#each data.ingredients as ingredient (ingredient.id)}
								{#if editingId === ingredient.id}
									<tr>
										<td colspan="5">
											<form
												method="POST"
												action="?/update"
												class="rounded-container-token bg-surface-100-900-token grid gap-4 p-4 lg:grid-cols-6"
											>
												<input type="hidden" name="id" value={ingredient.id} />

												<label class="label lg:col-span-2">
													<span>Naam</span>
													<input class="input" name="name" value={ingredient.name} required />
												</label>

												<label class="label">
													<span>Categorie</span>
													<select class="select" name="categoryId" required>
														{#each data.categories as category (category.id)}
															<option
																value={category.id}
																selected={category.id === ingredient.categoryId}
															>
																{category.name}
															</option>
														{/each}
													</select>
												</label>

												<label class="label">
													<span>Prijs excl. btw</span>
													<input
														class="input"
														name="priceVatExclusiveEuro"
														type="number"
														step="0.01"
														value={(ingredient.priceVatExclusiveCents / 100).toFixed(2)}
														required
													/>
												</label>

												<label class="label">
													<span>Btw %</span>
													<input
														class="input"
														name="vatPercentage"
														type="number"
														step="0.01"
														value={ingredient.vatPercentage}
														required
													/>
												</label>

												<label class="label">
													<span>Hoeveelheid</span>
													<input
														class="input"
														name="amount"
														type="number"
														step="0.01"
														value={ingredient.amount}
														required
													/>
												</label>

												<label class="label">
													<span>Eenheid</span>
													<select class="select" name="unit" required>
														<option value="g" selected={ingredient.unit === 'g'}>g</option>
														<option value="kg" selected={ingredient.unit === 'kg'}>kg</option>
														<option value="ml" selected={ingredient.unit === 'ml'}>ml</option>
														<option value="l" selected={ingredient.unit === 'l'}>l</option>
														<option value="piece" selected={ingredient.unit === 'piece'}>
															stuk
														</option>
													</select>
												</label>

												<div class="flex items-end gap-2 lg:col-span-6">
													<button class="btn preset-filled-primary-500" type="submit">
														Opslaan
													</button>

													<button
														class="preset-tonal-surface-500 btn"
														type="button"
														onclick={() => (editingId = null)}
													>
														Annuleren
													</button>
												</div>
											</form>
										</td>
									</tr>
								{:else}
									<tr>
										<td class="font-medium">{ingredient.name}</td>
										<td>{euro(ingredient.priceVatExclusiveCents)}</td>
										<td>{ingredient.vatPercentage}%</td>
										<td
											>{euro(
												vatPriceCents(ingredient.priceVatExclusiveCents, ingredient.vatPercentage)
											)}</td
										>
										<td
											>{euro(
												priceVatInclusiveCents(
													ingredient.priceVatExclusiveCents,
													ingredient.vatPercentage
												)
											)}</td
										>
										<td>{ingredient.amount}{ingredient.unit}</td>
										<td>
											€{(
												priceVatInclusiveCents(
													ingredient.priceVatExclusiveCents,
													ingredient.vatPercentage
												) /
												ingredient.amount /
												100
											).toFixed(4)}
											/ {ingredient.unit}
										</td>
										<td>
											<div class="flex justify-end gap-2">
												<button
													type="button"
													class="btn-icon preset-filled-warning-500"
													title="Bewerken"
													aria-label="Bewerken"
													onclick={() => (editingId = ingredient.id)}
												>
													<PencilIcon />
												</button>

												<form method="POST" action="?/remove">
													<input type="hidden" name="id" value={ingredient.id} />
													<button
														type="submit"
														class="btn-icon preset-filled-error-500"
														title="Verwijderen"
														aria-label="Verwijderen"
													>
														<Trash2Icon />
													</button>
												</form>
											</div>
										</td>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<div class="p-8 text-center">
					<p class="font-medium">Nog geen ingrediënten</p>
					<p class="mt-1 text-sm opacity-60">
						Voeg je eerste ingrediënt toe via het formulier links.
					</p>
				</div>
			{/if}
		</div>
	</div>
</section>
