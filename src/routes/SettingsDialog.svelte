<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Label } from "$lib/components/ui/label";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";
	import { DEFAULT_APP_SETTINGS, STORAGE_KEYS } from "$lib/constants";
	import { parseTrackersListString } from "$lib/helpers";
	import type { AppSettings } from "$lib/types";
	import { SettingsIcon } from "@lucide/svelte";
	import { onMount } from "svelte";

	let open = $state(false);

	let {
		settings = $bindable(DEFAULT_APP_SETTINGS)
	}: {
		settings: AppSettings;
	} = $props();

	let trackersAnnounceURLsString = $state("");

	onMount(() => {
		const storedTrackersList = localStorage.getItem(STORAGE_KEYS.trackersAnnounceURLs);
		if (typeof storedTrackersList === "string") {
			trackersAnnounceURLsString = storedTrackersList;
		}
	});

	$effect(() => {
		settings.trackerAnnounceURLs = parseTrackersListString(trackersAnnounceURLsString);
		localStorage.setItem(STORAGE_KEYS.trackersAnnounceURLs, trackersAnnounceURLsString);
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button size="icon" variant="outline" {...props}>
				<SettingsIcon />
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Settings</Dialog.Title>
		</Dialog.Header>

		<div class="space-y-1.5">
			<Label for="trackers-list">Trackers</Label>

			<Textarea
				id="trackers-list"
				placeholder="Paste your trackers here"
				rows={4}
				bind:value={trackersAnnounceURLsString}
			/>

			<p class="text-sm text-amber-200">
				{parseTrackersListString(trackersAnnounceURLsString).length} valid trackers out of {trackersAnnounceURLsString
					.split("\n")
					.filter((line) => line.trim().length > 0).length} inputs
			</p>

			<p class="text-sm text-muted-foreground">
				This is the list of trackers you will be connecting through. Only secure websocket trackers
				are supported at the moment. Check out <a
					target="_blank"
					class="text-accent-foreground"
					href="https://ngosang.github.io/trackerslist/trackers_all_ws.txt">this</a
				> for public WS trackers.
			</p>
		</div>
	</Dialog.Content>
</Dialog.Root>
