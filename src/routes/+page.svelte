<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import P2PT, { type TrackerStats } from "p2pt";
	import { toast } from "svelte-sonner";

	let roomCode = $state("");
	let joined = $state(false);

	// Find public WebTorrent tracker URLs here : https://github.com/ngosang/trackerslist/blob/master/trackers_all_ws.txt
	let trackersAnnounceURLs = $state([
		"wss://tracker.openwebtorrent.com",
		"wss://tracker.btorrent.xyz",
		"wss://tracker.webtorrent.dev",
		"wss://tracker.ghostchu-services.top:443/announce",
		"wss://tracker.files.fm:7073/announce",
		"ws://tracker.ghostchu-services.top:80/announce",
		"ws://tracker.files.fm:7072/announce"
		// "ws://localhost:5000",
		// "ws://localhost:5001"
	]);

	let p2pt = $state<P2PT | null>(null);

	// const p2pt = new P2PT(trackersAnnounceURLs, "roombox-32314");

	let logs = $state<string[]>([]);

	let trackerStats = $state<TrackerStats>({
		connected: 0,
		total: 0
	});

	async function joinRoom() {
		if (roomCode.trim() === "") {
			toast.error("Invalid room code");
			return;
		}

		try {
			joined = true;
			trackerStats = {
				connected: 0,
				total: 0
			};
			p2pt = new P2PT(trackersAnnounceURLs, `roombox-${roomCode}`);

			p2pt.on("trackerconnect", (tracker, stats) => {
				logs.push("Connected to " + tracker.announceUrl);
				trackerStats = stats;
			});
			p2pt.on("trackerwarning", (error, stats) => {
				if (
					error instanceof Error &&
					typeof error.message === "string" &&
					error.message.trim().length > 0
				) {
					logs.push(error.message.trim());
				}
				trackerStats = stats;
			});

			// p2pt.on("")

			p2pt.on("peerconnect", (peer) => {
				console.log("peer came");
				console.log(peer);
			});

			p2pt.on("peerclose", (peer) => {
				console.log("Peer gone");
			});

			p2pt.start();
			toast.info("Joined room");
		} catch (error) {
			toast.error("Something went wrong");
			joined = false;
		}
	}

	async function leaveRoom() {
		if (p2pt == null) {
			toast.error("Can't leave a room if you are not in it");
			return;
		}
		p2pt.destroy();
		toast.info("Left the room");
		roomCode = "";
		joined = false;
	}
</script>

<div class="mx-auto max-w-prose space-y-4 p-8">
	<div class="flex place-items-center gap-2">
		<Input placeholder="Room code" bind:value={roomCode} disabled={joined} />

		<Button variant={joined ? "destructive" : "default"} onclick={joined ? leaveRoom : joinRoom}>
			{joined ? "Leave" : "Join"}</Button
		>
	</div>

	{#if joined}
		<div>Connected to {trackerStats.connected} out of {trackerStats.total} trackers</div>

		<div class="flex place-items-center gap-2">
			<!-- <SearchIcon /> -->
			<Input placeholder="Search" />
			<Button size="icon"></Button>
			<Button size="icon"></Button>
		</div>
	{:else}
		<div>Roombox</div>
	{/if}

	<div class="font-mono text-xs text-muted-foreground">
		{#each logs.toReversed() as log}
			<p>{log}</p>
		{/each}
	</div>
</div>
