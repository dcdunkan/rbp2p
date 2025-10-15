<script lang="ts">
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import type { PeerInfo } from "$lib/types";
	import { LoaderCircleIcon, UsersIcon } from "@lucide/svelte";

	let open = $state(false);

	let {
		peers = $bindable({})
	}: {
		peers: Record<string, PeerInfo>;
	} = $props();

	// todo: ping
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>
				<UsersIcon /> Peers: {Object.keys(peers).length}
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content
		class="flex h-[60vh] max-w-[90vw] flex-col rounded-md transition-all duration-150 sm:max-w-lg"
	>
		<Dialog.Header>
			<Dialog.Title>Peers</Dialog.Title>
		</Dialog.Header>

		<div class="flex-grow divide-y overflow-y-scroll rounded border">
			{#each Object.values(peers) as peer}
				<div class="flex place-items-center justify-between gap-2 px-4 py-2">
					<div class="space-y-1 truncate">
						{#if peer.known}
							<div class="text-sm">{peer.username}</div>
						{:else}
							<div class="animate-pulse text-sm">Connecting...</div>
						{/if}
						<div class="truncate text-xs text-muted-foreground">{peer.id}</div>
					</div>
					{#if !peer.known}
						<LoaderCircleIcon class="size-5 animate-spin" />
					{/if}
				</div>
			{:else}
				<div class="flex flex-col justify-center items-center h-full text-muted-foreground text-sm">
					You have no one.
				</div>
			{/each}
		</div>

		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: "outline" })}>
				Close
				<!-- <Button variant="outline">Close</Button> -->
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
