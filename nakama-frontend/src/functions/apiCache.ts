// Module-level cache — lives for the entire browser session.
// Keyed by URL, stores the parsed JSON response so repeat fetches
// (e.g. navigating away and back) are instant and don't hit Jikan's
// rate limits (3 req/sec, 60 req/min).
//
// Cache hits are returned immediately and bypass the request queue.
// Only real network requests go through the queue.

import { enqueue } from "./requestQueue";

const TTL_MS = 5 * 60 * 1000; // Cache entries expire after 5 minutes

interface CacheEntry {
	data: any;
	expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

export const cachedFetch = async (url: string): Promise<any> => {
	const now = Date.now();
	const entry = cache.get(url);

	// Cache hit — return immediately, no queue needed
	if (entry && now < entry.expiresAt) {
		return entry.data;
	}

	// Cache miss — run through the global queue so we don't
	// hammer Jikan with simultaneous requests
	return enqueue(async () => {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Request failed (${response.status})`);

		const data = await response.json();
		cache.set(url, { data, expiresAt: now + TTL_MS });
		return data;
	});
};
