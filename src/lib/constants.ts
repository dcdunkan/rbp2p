import type { AppSettings } from "./types";

export const DEFAULT_APP_SETTINGS: AppSettings = {
	trackerAnnounceURLs: []
};

export const STORAGE_KEYS = {
	trackersAnnounceURLs: "trackers-announce-urls"
};

export enum MessageTypes {
	// peer discovery
	WHO_ARE_YOU,
	WHO_AM_I,

	//
	REQUEST_STATE,
	STATE_RESPONSE
}

// request -> (maps) -> response
export const MESSAGE_MAPPING = {
	[MessageTypes.WHO_ARE_YOU]: MessageTypes.WHO_AM_I,
	[MessageTypes.REQUEST_STATE]: MessageTypes.STATE_RESPONSE
};
