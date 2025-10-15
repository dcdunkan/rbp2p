<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { DEFAULT_APP_SETTINGS, MessageTypes } from "$lib/constants";
	import { cn } from "$lib/shadcn-utils";
	import type { AppSettings, InternalLog, Message, PeerInfo } from "$lib/types";
	import P2PT, { type TrackerStats } from "p2pt";
	import { onDestroy } from "svelte";
	import { toast } from "svelte-sonner";
	import { slide } from "svelte/transition";
	import PeersDialog from "./PeersDialog.svelte";
	import SettingsDialog from "./SettingsDialog.svelte";
	import SearchMenu from "./SearchMenu.svelte";
	import { SearchIcon } from "@lucide/svelte";

	let settings = $state<AppSettings>(DEFAULT_APP_SETTINGS);

	let roomCode = $state("C310");
	let username = $state("");

	let p2pt = $state<P2PT<Message> | null>(null);
	let joined = $derived(p2pt != null);
	let peers = $state<Record<string, PeerInfo>>({});
	let trackerStats = $state<TrackerStats>({ connected: 0, total: 0 });

	// todo: shared blacklist
	// todo: use indexeddb to store stuff instead of memory

	const MAX_INTERNAL_LOGS = 50;
	let internalLogs = $state<InternalLog[]>([]);
	function ilog(type: InternalLog["type"], message: string) {
		const len = internalLogs.unshift({
			type: type,
			timestamp: new Date(),
			message: message
		});
		if (len > MAX_INTERNAL_LOGS + 1) {
			internalLogs.pop();
		}
	}
	const i = {
		log: ilog.bind(null, "log"),
		error: ilog.bind(null, "error")
	};

	function isValidRoomCode(str: string) {
		if (str.trim().length === 0) return false;
		return true;
	}

	function isValidUsername(str: string) {
		if (str.trim().length === 0) return false;
		if (/[^a-zA-Z1-9]/.test(str)) return false;
		return true;
	}

	async function joinRoom() {
		if (!isValidRoomCode(roomCode)) {
			toast.error("Invalid room code");
			return;
		}
		if (!isValidUsername(username)) {
			toast.error("Invalid username");
			return;
		}

		try {
			trackerStats = { connected: 0, total: 0 };
			peers = {};
			p2pt = new P2PT<Message>(settings.trackerAnnounceURLs, `roombox-${roomCode}`);

			p2pt.on("trackerconnect", (tracker, stats) => {
				i.log("Connected to " + tracker.announceUrl);
				trackerStats = stats;
			});
			p2pt.on("trackerwarning", (error, stats) => {
				if (
					error instanceof Error &&
					typeof error.message === "string" &&
					error.message.trim().length > 0
				) {
					i.error(error.message.trim());
				}
				trackerStats = stats;
			});

			p2pt.on("peerconnect", (peer) => {
				if (peer.id in peers) {
					return;
				}
				i.log("Peer connected: " + peer.id);
				peers[peer.id] = {
					known: false,
					id: peer.id
				};
				p2pt?.send(peer, { type: MessageTypes.WHO_ARE_YOU });
			});
			p2pt.on("peerclose", (peer) => {
				i.log("Peer disconnected: " + peer.id);
				if (peer.id in peers) {
					delete peers[peer.id];
				}
			});

			p2pt.on("msg", (peer, message: Message) => {
				if (message.type === MessageTypes.WHO_ARE_YOU) {
					p2pt?.send(peer, {
						type: MessageTypes.WHO_AM_I,
						username: username
					});
				} else if (message.type === MessageTypes.WHO_AM_I) {
					i.log("I got " + message.username + " as my peer!");
					peers[peer.id] = {
						known: true,
						id: peer.id,
						username: message.username
					};
				} else if (message.type === MessageTypes.REQUEST_STATE) {
				} else {
					i.error("Unknown type of message recieved. Check console");
					console.error(message);
				}
			});

			p2pt.start();
			i.log("Starting p2pt");
			toast.info("Joined room");
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong");
		}
	}

	async function leaveRoom() {
		if (p2pt == null) {
			toast.error("Can't leave a room if you are not in it");
			return;
		}
		p2pt.destroy();
		p2pt = null;
		peers = {};
		roomCode = "";
		toast.info("Left the room");
	}

	onDestroy(() => {
		if (p2pt != null) {
			p2pt.destroy();
			peers = {};
			p2pt = null;
			roomCode = "";
		}
	});

	let showSearchMenu = $state(false);
</script>

<svelte:head>
	<title>Roombox Revived</title>
</svelte:head>

<div class="mx-auto max-w-prose space-y-4 p-8 **:transition-all **:duration-200">
	<div class="text-center text-2xl font-semibold">Roombox 2</div>

	<div class="flex place-items-center gap-2">
		<Input placeholder="Room code" bind:value={roomCode} disabled={joined} />
		<Input placeholder="Username" bind:value={username} disabled={joined} />

		<Button
			disabled={!joined && (!isValidRoomCode(roomCode) || !isValidUsername(username))}
			variant={joined ? "destructive" : "default"}
			onclick={joined ? leaveRoom : joinRoom}
		>
			{joined ? "Leave" : "Join"}
		</Button>

		<SettingsDialog bind:settings />
	</div>

	{#if joined}
		<div transition:slide class="space-y-4">
			<div class="flex place-items-center justify-between gap-2">
				<div>
					Trackers: {trackerStats.connected} / {trackerStats.total}
				</div>

				<PeersDialog bind:peers />
			</div>

			<div class="flex place-items-center justify-between gap-4">
				<div class="text-bold text-xl">Queue</div>
				<div>
					<Button variant="outline" size="icon" onclick={() => (showSearchMenu = true)}>
						<SearchIcon />
					</Button>
				</div>
			</div>

			<SearchMenu bind:open={showSearchMenu} />
		</div>
	{/if}

	<div class="h-48 max-h-48 divide-y overflow-scroll rounded-sm border text-xs">
		{#each internalLogs as { type, message, timestamp }}
			<div
				class={cn("p-2", {
					"bg-destructive": type === "error"
				})}
			>
				<div class="text-muted-foreground">{timestamp.toLocaleString()}</div>
				<div>{message}</div>
			</div>
		{:else}
			<div
				class="w-full h-full text-muted-foreground text-center justify-center items-center flex flex-col"
			>
				Logs will appear here
			</div>
		{/each}
	</div>
</div>
