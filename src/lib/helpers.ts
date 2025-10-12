export function parseTrackersListString(str: string): string[] {
	return str
		.trim()
		.split(/\n+/g)
		.filter((announceURL) => URL.canParse(announceURL))
		.map((announceURL) => new URL(announceURL))
		.filter((announceURL) => announceURL.protocol === "wss:")
		.map((announceURL) => announceURL.href);
}
