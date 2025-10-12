import type { AppSettings } from "./types";

export const DEFAULT_APP_SETTINGS: AppSettings = {
	trackerAnnounceURLs: []
};

export const STORAGE_KEYS = {
	trackersAnnounceURLs: "trackers-announce-urls"
};

export enum MessageTypes {
	WHO_ARE_YOU,
	WHO_AM_I
}
