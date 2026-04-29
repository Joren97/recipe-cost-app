<script lang="ts">
	let { data } = $props();

	let editingId = $state<number | null>(null);
</script>

<svelte:head>
	<title>Categories</title>
</svelte:head>

<section class="">
	<header class="space-y-2">
		<p class="text-sm font-medium tracking-wide uppercase opacity-60">Recipe costing</p>
		<h1 class="h1">Categories</h1>
		<p class="opacity-70">
			Manage ingredient categories such as dairy, flour, fruit, or chocolate.
		</p>
	</header>

	<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
		<div class="h-fit card p-6">
			<div class="mb-6 space-y-1">
				<h2 class="h3">Add category</h2>
				<p class="text-sm opacity-60">Create a category to group your ingredients.</p>
			</div>

			<form method="POST" action="?/create" class="flex flex-col gap-4">
				<label class="label">
					<span>Name</span>
					<input class="input" name="name" placeholder="Example: Dairy" required />
				</label>

				<button class="btn preset-filled-primary-500" type="submit"> Add category </button>
			</form>
		</div>

		<div class="overflow-hidden card">
			<div class="border-surface-200-800-token flex items-center justify-between border-b p-4">
				<div>
					<h2 class="h3">All categories</h2>
					<p class="text-sm opacity-60">Edit or remove existing categories.</p>
				</div>

				<span class="preset-tonal-primary-500 badge">
					{data.categories.length}
					{data.categories.length === 1 ? 'category' : 'categories'}
				</span>
			</div>

			{#if data.categories.length > 0}
				<div class="overflow-x-auto">
					<table class="table">
						<thead>
							<tr>
								<th>Name</th>
								<th class="text-right">Actions</th>
							</tr>
						</thead>

						<tbody>
							{#each data.categories as category}
								{#if editingId === category.id}
									<tr>
										<td colspan="2">
											<form
												method="POST"
												action="?/update"
												class="rounded-container-token bg-surface-100-900-token grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto]"
											>
												<input type="hidden" name="id" value={category.id} />

												<label class="label">
													<span>Name</span>
													<input class="input" name="name" value={category.name} required />
												</label>

												<div class="flex items-end gap-2">
													<button class="btn preset-filled-primary-500" type="submit">
														Save
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
										<td class="font-medium">{category.name}</td>
										<td>
											<div class="flex justify-end gap-2">
												<button
													class="preset-tonal-primary-500 btn"
													type="button"
													onclick={() => (editingId = category.id)}
												>
													Edit
												</button>

												<form method="POST" action="?/remove">
													<input type="hidden" name="id" value={category.id} />
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
					<p class="font-medium">No categories yet</p>
					<p class="mt-1 text-sm opacity-60">Add your first category using the form on the left.</p>
				</div>
			{/if}
		</div>
	</div>
</section>
