import { HOLODEX_API_KEY } from "$env/dynamic/private";
import { HolodexApiClient } from "holodex.js";

const client = new HolodexApiClient({
	apiKey: HOLODEX_API_KEY
})

export async function fillInVideoInfo(id) {
	try {
		const video = await client.getVideo(id);

		return {
			video: id,
			title: video.title,
			available_at: video.availableAt,
			interval: "15m",
		}
	} catch {
		return {
			video: id,
			title: "",
			available_at: new Date().toDateString(),
			interval: "15m",
		}
	}
}

export function parseVideoId(text) {
	if (!URL.canParse(text)) {
		return text;
	}

	const url = new URL(text);

	if (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
		return url.searchParams.get("v");
	}

	if (url.hostname === "youtu.be") {
		return url.pathname.slice(1);
	}

	throw new Error(`Invalid URL: ${text}`);
}