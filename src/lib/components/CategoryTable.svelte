<script lang="ts">
	let {
		type,
		categories,
		editingId,
		editingType,
		onEdit,
		onCancel
	}: {
		type: 'ingredient' | 'recipe';
		categories: { id: number; name: string }[];
		editingId: number | null;
		editingType: 'ingredient' | 'recipe' | null;
		onEdit: (type: 'ingredient' | 'recipe', id: number) => void;
		onCancel: () => void;
	} = $props();
</script>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>Naam</th>
				<th class="text-right">Acties</th>
			</tr>
		</thead>

		<tbody>
			{#each categories as category (category.id)}
				{#if editingId === category.id && editingType === type}
					<tr>
						<td colspan="2">
							<form
								method="POST"
								action="?/update"
								class="rounded-container-token bg-surface-100-900-token grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto]"
							>
								<input type="hidden" name="type" value={type} />
								<input type="hidden" name="id" value={category.id} />

								<label class="label">
									<span>Naam</span>
									<input class="input" name="name" value={category.name} required />
								</label>

								<div class="flex items-end gap-2">
									<button class="btn preset-filled-primary-500" type="submit"> Opslaan </button>

									<button class="preset-tonal-surface-500 btn" type="button" onclick={onCancel}>
										Annuleren
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
									onclick={() => onEdit(type, category.id)}
								>
									Bewerk
								</button>

								<form method="POST" action="?/remove">
									<input type="hidden" name="type" value={type} />
									<input type="hidden" name="id" value={category.id} />

									<button class="preset-tonal-error-500 btn" type="submit"> Verwijder </button>
								</form>
							</div>
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>
