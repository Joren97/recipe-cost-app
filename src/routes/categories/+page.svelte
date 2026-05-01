<script lang="ts">
	import { enhance } from '$app/forms';
	import { toaster } from '$lib/components/toaster';

	let { data } = $props();

	let editingId = $state<number | null>(null);
	let editingType = $state<'ingredient' | 'recipe' | null>(null);

	let newCategoryType = $state<'ingredient' | 'recipe'>('ingredient');
	import CategoryTable from '$lib/components/CategoryTable.svelte';
</script>

<svelte:head>
	<title>Categorieën</title>
</svelte:head>

<section class="flex flex-col gap-8">
	<header class="space-y-2">
		<p class="text-sm font-medium tracking-wide uppercase opacity-60">Recept kostprijs</p>
		<h1 class="h1">Categorieën</h1>
		<p class="opacity-70">Beheer categorieën voor ingrediënten en recepten.</p>
	</header>

	<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
		<div class="h-fit card p-6">
			<div class="mb-6 space-y-1">
				<h2 class="h3">Categorie toevoegen</h2>
				<p class="text-sm opacity-60">Maak een categorie voor ingrediënten of recepten.</p>
			</div>

			<form
				method="POST"
				action="?/create"
				class="flex flex-col gap-4"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();

						if (result.type === 'success') {
							console.log(result);
							toaster.success({
								title: 'Categorie toegevoegd',
								description: `${result.data} werd toegevoegd.`
							});
						}

						if (result.type === 'failure') {
							toaster.error(result.data?.message ?? 'Categorie toevoegen mislukt.');
						}
					};
				}}
			>
				<label class="label">
					<span>Type</span>
					<select class="select" name="type" bind:value={newCategoryType} required>
						<option value="ingredient">Ingrediëntcategorie</option>
						<option value="recipe">Receptcategorie</option>
					</select>
				</label>

				<label class="label">
					<span>Naam</span>
					<input
						class="input"
						name="name"
						placeholder={newCategoryType === 'ingredient' ? 'Bijv.: Zuivel' : 'Bijv.: Dessert'}
						required
					/>
				</label>

				<button class="btn preset-filled-primary-500" type="submit"> Categorie toevoegen </button>
			</form>
		</div>

		<div class="flex flex-col gap-8">
			<div class="overflow-hidden card">
				<div class="border-surface-200-800-token flex items-center justify-between border-b p-4">
					<div>
						<h2 class="h3">Ingrediëntcategorieën</h2>
						<p class="text-sm opacity-60">
							Categorieën voor ingrediënten zoals zuivel, fruit of chocolade.
						</p>
					</div>

					<span class="preset-tonal-primary-500 badge">
						{data.ingredientCategories.length}
						{data.ingredientCategories.length === 1 ? 'categorie' : 'categorieën'}
					</span>
				</div>

				{#if data.ingredientCategories.length > 0}
					<CategoryTable
						type="ingredient"
						categories={data.ingredientCategories}
						{editingId}
						{editingType}
						onEdit={(type, id) => {
							editingType = type;
							editingId = id;
						}}
						onCancel={() => {
							editingType = null;
							editingId = null;
						}}
					/>
				{:else}
					<div class="p-8 text-center">
						<p class="font-medium">Nog geen ingrediëntcategorieën</p>
						<p class="mt-1 text-sm opacity-60">
							Voeg je eerste categorie toe via het formulier links.
						</p>
					</div>
				{/if}
			</div>

			<div class="overflow-hidden card">
				<div class="border-surface-200-800-token flex items-center justify-between border-b p-4">
					<div>
						<h2 class="h3">Receptcategorieën</h2>
						<p class="text-sm opacity-60">
							Categorieën voor recepten zoals ontbijt, gebak of dessert.
						</p>
					</div>

					<span class="preset-tonal-primary-500 badge">
						{data.recipeCategories.length}
						{data.recipeCategories.length === 1 ? 'categorie' : 'categorieën'}
					</span>
				</div>

				{#if data.recipeCategories.length > 0}
					<CategoryTable
						type="recipe"
						categories={data.recipeCategories}
						{editingId}
						{editingType}
						onEdit={(type, id) => {
							editingType = type;
							editingId = id;
						}}
						onCancel={() => {
							editingType = null;
							editingId = null;
						}}
					/>
				{:else}
					<div class="p-8 text-center">
						<p class="font-medium">Nog geen receptcategorieën</p>
						<p class="mt-1 text-sm opacity-60">
							Voeg je eerste categorie toe via het formulier links.
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
