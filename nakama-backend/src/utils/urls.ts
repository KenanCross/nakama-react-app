const TRACKING_PARAMS = new Set([
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_content",
	"utm_term",
	"fbclid",
	"gclid",
]);

export const canonicalizeUrl = (value: string): string => {
	const url = new URL(value);
	url.hostname = url.hostname.toLowerCase();
	url.hash = "";

	for (const key of Array.from(url.searchParams.keys())) {
		if (TRACKING_PARAMS.has(key.toLowerCase())) {
			url.searchParams.delete(key);
		}
	}

	if (url.pathname !== "/" && url.pathname.endsWith("/")) {
		url.pathname = url.pathname.slice(0, -1);
	}

	return url.toString();
};

export const createSlug = (value: string): string =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 120);
