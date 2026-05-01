<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	import { MilkIcon, BookOpenTextIcon, FolderKanbanIcon } from '@lucide/svelte';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	const links = [
		{ label: 'Ingredienten', href: '/ingredients', icon: MilkIcon },
		{ label: 'Recepten', href: '/recipes', icon: BookOpenTextIcon },
		{ label: 'Categorieën', href: '/categories', icon: FolderKanbanIcon }
	];
	import { Toast } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/components/toaster';
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>

<div class="grid h-dvh w-full grid-cols-[auto_1fr] border border-surface-200-800">
	<!-- --- -->
	<Navigation layout="rail">
		<Navigation.Header>
			<!-- <Navigation.TriggerAnchor href="/#" title="View Homepage" aria-label="View Homepage">
				<SkullIcon class="size-8" />
			</Navigation.TriggerAnchor> -->
		</Navigation.Header>
		<Navigation.Content>
			<Navigation.Menu>
				{#each links as link (link)}
					{@const Icon = link.icon}
					<Navigation.TriggerAnchor href={link.href}>
						<Icon class="size-5" />
						<Navigation.TriggerText>{link.label}</Navigation.TriggerText>
					</Navigation.TriggerAnchor>
				{/each}
			</Navigation.Menu>
		</Navigation.Content>
		<Navigation.Footer>
			<!-- <Navigation.TriggerAnchor href="/#" title="Settings" aria-label="Settings">
				<SettingsIcon class="size-5" />
			</Navigation.TriggerAnchor> -->
		</Navigation.Footer>
	</Navigation>
	<!-- --- -->
	<div class="p-6">
		{@render children()}
	</div>
</div>
