<script lang="ts">
	let { data } = $props();

	let editingId = $state<number | null>(null);
</script>

<svelte:head>
	<title>Ingredients</title>
</svelte:head>

<section class="">
	<header class="space-y-2">
		<p class="text-sm font-medium tracking-wide uppercase opacity-60">Recipe costing</p>
		<h1 class="h1">Ingredients</h1>
		<p class="opacity-70">Manage your ingredient prices, package amounts, and units.</p>
	</header>

	<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
		<div class="h-fit card p-6">
			<div class="mb-6 space-y-1">
				<h2 class="h3">Add ingredient</h2>
				<p class="text-sm opacity-60">Create a priced ingredient linked to a category.</p>
			</div>

			<form method="POST" action="?/create" class="flex flex-col gap-4">
				<label class="label">
					<span>Name</span>
					<input class="input" name="name" placeholder="Example: Flour" required />
				</label>

				<label class="label">
					<span>Category</span>
					<select class="select" name="categoryId" required>
						{#each data.categories as category}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
				</label>

				<div class="grid gap-4 sm:grid-cols-2">
					<label class="label">
						<span>Price in euro</span>
						<input class="input" name="priceEuro" type="number" step="0.01" required />
					</label>

					<label class="label">
						<span>Package amount</span>
						<input class="input" name="amount" type="number" step="0.01" required />
					</label>
				</div>

				<label class="label">
					<span>Unit</span>
					<select class="select" name="unit" required>
						<option value="g">g</option>
						<option value="kg">kg</option>
						<option value="ml">ml</option>
						<option value="l">l</option>
						<option value="piece">piece</option>
					</select>
				</label>

				<button class="btn preset-filled-primary-500" type="submit"> Add ingredient </button>
			</form>
		</div>

		<div class="overflow-hidden card">
			<div class="border-surface-200-800-token flex items-center justify-between border-b p-4">
				<div>
					<h2 class="h3">All ingredients</h2>
					<p class="text-sm opacity-60">Edit or remove existing ingredients.</p>
				</div>

				<span class="preset-tonal-primary-500 badge">
					{data.ingredients.length}
					{data.ingredients.length === 1 ? 'ingredient' : 'ingredients'}
				</span>
			</div>

			{#if data.ingredients.length > 0}
				<div class="overflow-x-auto">
					<table class="table">
						<thead>
							<tr>
								<th>Ingredient</th>
								<th>Price</th>
								<th>Package</th>
								<th>Unit price</th>
								<th class="text-right">Actions</th>
							</tr>
						</thead>

						<tbody>
							{#each data.ingredients as ingredient}
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
													<span>Name</span>
													<input class="input" name="name" value={ingredient.name} required />
												</label>

												<label class="label">
													<span>Category</span>
													<select class="select" name="categoryId" required>
														{#each data.categories as category}
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
													<span>Price</span>
													<input
														class="input"
														name="priceEuro"
														type="number"
														step="0.01"
														value={(ingredient.priceCents / 100).toFixed(2)}
														required
													/>
												</label>

												<label class="label">
													<span>Amount</span>
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
													<span>Unit</span>
													<select class="select" name="unit" required>
														<option value="g" selected={ingredient.unit === 'g'}>g</option>
														<option value="kg" selected={ingredient.unit === 'kg'}>kg</option>
														<option value="ml" selected={ingredient.unit === 'ml'}>ml</option>
														<option value="l" selected={ingredient.unit === 'l'}>l</option>
														<option value="piece" selected={ingredient.unit === 'piece'}>
															piece
														</option>
													</select>
												</label>

												<div class="flex items-end gap-2 lg:col-span-6">
													<button class="btn preset-filled-primary-500" type="submit">
														Save changes
													</button>

													<button
														class="preset-tonal-surface-500 btn"
														type="button"
														onclick={() => (editingId = null)}
													>
														Cancel
													</button>
												</div>
											</form>
										</td>
									</tr>
								{:else}
									<tr>
										<td class="font-medium">{ingredient.name}</td>
										<td>€{(ingredient.priceCents / 100).toFixed(2)}</td>
										<td>{ingredient.amount}{ingredient.unit}</td>
										<td>
											€{(ingredient.priceCents / ingredient.amount / 100).toFixed(4)}
											/ {ingredient.unit}
										</td>
										<td>
											<div class="flex justify-end gap-2">
												<button
													class="preset-tonal-primary-500 btn"
													type="button"
													onclick={() => (editingId = ingredient.id)}
												>
													Edit
												</button>

												<form method="POST" action="?/remove">
													<input type="hidden" name="id" value={ingredient.id} />
													<button class="preset-tonal-error-500 btn" type="submit"> Remove </button>
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
					<p class="font-medium">No ingredients yet</p>
					<p class="mt-1 text-sm opacity-60">
						Add your first ingredient using the form on the left.
					</p>
				</div>
			{/if}
		</div>
	</div>
</section>
