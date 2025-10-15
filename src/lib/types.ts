import { MessageTypes } from "./constants";

// helpers
export type InternalLog = {
	type: "error" | "log";
	timestamp: Date;
	message: string;
};

// p2p stuff
export interface BasePeerInfo {
	id: string;

	// ping: number;
	// lastSentMessage: {
	// 	type: MessageTypes;
	// 	timestamp: Date;
	// };
}
export interface UnknownPeerInfo extends BasePeerInfo {
	known: false;
}
export interface KnownPeerInfo extends BasePeerInfo {
	known: true;
	username: string;
}

export type PeerInfo = UnknownPeerInfo | KnownPeerInfo;

// messages
export type Message =
	| { type: MessageTypes.WHO_ARE_YOU }
	| { type: MessageTypes.WHO_AM_I; username: string }
	| { type: MessageTypes.REQUEST_STATE }
	| { type: MessageTypes.STATE_RESPONSE; state: AppState };

// app specific stuff
export type AppSettings = {
	trackerAnnounceURLs: string[];
};

// export type QueueItem = {
// 	id: string;
// 	title: string;
// 	thumbnail_url: string;
// 	song_url: string;
// 	duration: number;
// 	artists: string[];
// };

// export type PlaybackState = "loading" | "playing" | "paused" | "finished";

export type AppState = {
	// playbackState: PlaybackState;
	// queue: QueueItem[];
	// currentItem: string;
};

export type SearchResultSong = {
	type: "song";
	id: string;
	title: string;
	artists: string[];
	year: string;
	perma_url: string;
	image_url: string;
};

export type SearchResult = SearchResultSong;
