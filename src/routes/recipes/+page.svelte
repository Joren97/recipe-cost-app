<script lang="ts">
	let { data } = $props();

	let editingId = $state<number | null>(null);
</script>

<svelte:head>
	<title>Recipes</title>
</svelte:head>

<section class="flex flex-col gap-8">
	<header class="space-y-2">
		<p class="text-sm font-medium tracking-wide uppercase opacity-60">Recipe costing</p>
		<h1 class="h1">Recipes</h1>
		<p class="opacity-70">Create, edit, remove, and open recipes.</p>
	</header>

	<div class="card p-6">
		<form method="POST" action="?/create" class="flex flex-col gap-4 sm:flex-row">
			<label class="label flex-1">
				<span>Recipe name</span>
				<input class="input" name="name" placeholder="Example: Chocolate cake" required />
			</label>

			<div class="flex items-end">
				<button class="btn w-full preset-filled-primary-500 sm:w-auto" type="submit">
					Create recipe
				</button>
			</div>
		</form>
	</div>

	<div class="overflow-hidden card">
		<div class="border-surface-200-800-token flex items-center justify-between border-b p-4">
			<div>
				<h2 class="h3">All recipes</h2>
				<p class="text-sm opacity-60">Manage your recipe collection.</p>
			</div>

			<span class="preset-tonal-primary-500 badge">
				{data.recipes.length}
				{data.recipes.length === 1 ? 'recipe' : 'recipes'}
			</span>
		</div>

		{#if data.recipes.length > 0}
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>Name</th>
							<th class="text-right">Actions</th>
						</tr>
					</thead>

					<tbody>
						{#each data.recipes as recipe}
							{#if editingId === recipe.id}
								<tr>
									<td colspan="2">
										<form
											method="POST"
											action="?/update"
											class="rounded-container-token bg-surface-100-900-token grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto]"
										>
											<input type="hidden" name="id" value={recipe.id} />

											<label class="label">
												<span>Recipe name</span>
												<input class="input" name="name" value={recipe.name} required />
											</label>

											<div class="flex items-end gap-2">
												<button class="btn preset-filled-primary-500" type="submit"> Save </button>

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
									<td class="font-medium">
										<a class="hover:underline" href={`/recipes/${recipe.id}`}>
											{recipe.name}
										</a>
									</td>

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
												Edit
											</button>

											<form method="POST" action="?/remove">
												<input type="hidden" name="id" value={recipe.id} />
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
				<p class="font-medium">No recipes yet</p>
				<p class="mt-1 text-sm opacity-60">Create your first recipe above.</p>
			</div>
		{/if}
	</div>
</section>
