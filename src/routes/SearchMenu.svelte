<script lang="ts">
	import * as Command from "$lib/components/ui/command/index.js";

	let { open = $bindable(false) }: { open: boolean } = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}

	let searchQuery = $state("");
	// let results = $state<LoadedData<SearchDocument[]>>({
	// 	state: "resolved",
	// 	data: []
	// });
	// let abortController: AbortController | null = null;

	// async function performSearch(query: string) {
	// 	if (query == null || query.trim().length == 0) {
	// 		results = { state: "resolved", data: [] };
	// 		return;
	// 	}
	// 	if (abortController != null) {
	// 		abortController.abort();
	// 	}
	// 	abortController = new AbortController();
	// 	try {
	// 		results = { state: "pending", message: "One moment..." };
	// 		// const response = await fetch(`${YT_SERVER_URL}/search?q=${encodeURIComponent(query)}`, {
	// 		// 	signal: abortController.signal
	// 		// });
	// 		// if (response.ok) {
	// 		// 	const results = (await response.json()) as SearchDocument[];
	// 		// 	results = { state: "resolved", data: results };
	// 		// } else {
	// 		// 	results = { state: "failed", message: "Failed to get search results" };
	// 		// }
	// 	} catch (error) {
	// 		if ((error as Error).name === "AbortError") {
	// 			return;
	// 		}
	// 		results = { state: "failed", message: "Something went wrong" };
	// 	} finally {
	// 		abortController = null;
	// 	}
	// }

	// let debounceTimer: NodeJS.Timeout;

	// function debouncedSearch(query: string) {
	// 	clearTimeout(debounceTimer);
	// 	debounceTimer = setTimeout(() => {
	// 		performSearch(query);
	// 	}, 400);
	// }

	// $effect(() => {
	// 	debouncedSearch(searchQuery);
	// });
</script>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog bind:open>
	<Command.Input placeholder="What do you wanna play?" bind:value={searchQuery} />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Suggestions">
			<Command.Item>Calendar</Command.Item>
			<Command.Item>Search Emoji</Command.Item>
			<Command.Item>Calculator</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
