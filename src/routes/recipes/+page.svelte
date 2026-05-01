<script lang="ts">
	let { data } = $props();

	let editingId = $state<number | null>(null);
</script>

<svelte:head>
	<title>Recepten</title>
</svelte:head>

<section class="flex flex-col gap-8">
	<header class="space-y-2">
		<p class="text-sm font-medium tracking-wide uppercase opacity-60">Recept kostprijs</p>
		<h1 class="h1">Recepten</h1>
		<p class="opacity-70">Maak, bewerk, verwijder en open recepten.</p>
	</header>

	<div class="card p-6">
		<form
			method="POST"
			action="?/create"
			class="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,280px)_auto]"
		>
			<label class="label">
				<span>Naam recept</span>
				<input class="input" name="name" placeholder="Bijv.: Chocoladetaart" required />
			</label>

			<label class="label">
				<span>Categorie</span>
				<select class="select" name="categoryId" required>
					{#each data.recipeCategories as category (category.id)}
						<option value={category.id}>{category.name}</option>
					{/each}
				</select>
			</label>

			<div class="flex items-end">
				<button class="btn w-full preset-filled-primary-500 md:w-auto" type="submit">
					Recept toevoegen
				</button>
			</div>
		</form>
	</div>

	<div class="overflow-hidden card">
		<div class="border-surface-200-800-token flex items-center justify-between border-b p-4">
			<div>
				<h2 class="h3">Alle recepten</h2>
				<p class="text-sm opacity-60">Beheer je receptenverzameling.</p>
			</div>

			<span class="preset-tonal-primary-500 badge">
				{data.recipes.length}
				{data.recipes.length === 1 ? 'recept' : 'recepten'}
			</span>
		</div>

		{#if data.recipes.length > 0}
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>Naam</th>
							<th>Categorie</th>
							<th class="text-right">Acties</th>
						</tr>
					</thead>

					<tbody>
						{#each data.recipes as recipe (recipe.id)}
							{#if editingId === recipe.id}
								<tr>
									<td colspan="3">
										<form
											method="POST"
											action="?/update"
											class="rounded-container-token bg-surface-100-900-token grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,280px)_auto]"
										>
											<input type="hidden" name="id" value={recipe.id} />

											<label class="label">
												<span>Naam recept</span>
												<input class="input" name="name" value={recipe.name} required />
											</label>

											<label class="label">
												<span>Categorie</span>
												<select class="select" name="categoryId" required>
													{#each data.recipeCategories as category (category.id)}
														<option
															value={category.id}
															selected={category.id === recipe.categoryId}
														>
															{category.name}
														</option>
													{/each}
												</select>
											</label>

											<div class="flex items-end gap-2">
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
									<td class="font-medium">
										<a class="hover:underline" href={`/recipes/${recipe.id}`}>
											{recipe.name}
										</a>
									</td>

									<td>{recipe.categoryName}</td>

									<td>
										<div class="flex justify-end gap-2">
											<a class="preset-tonal-primary-500 btn" href={`/recipes/${recipe.id}`}>
												Open
											</a>

											<button
												class="preset-tonal-primary-500 btn"
												type="button"
												onclick={() => (editingId = recipe.id)}
											>
												Bewerk
											</button>

											<form method="POST" action="?/remove">
												<input type="hidden" name="id" value={recipe.id} />
												<button class="preset-tonal-error-500 btn" type="submit">
													Verwijder
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
				<p class="font-medium">Nog geen recepten</p>
				<p class="mt-1 text-sm opacity-60">Maak hierboven je eerste recept aan.</p>
			</div>
		{/if}
	</div>
</section>
