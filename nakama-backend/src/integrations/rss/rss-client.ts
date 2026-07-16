import { NewsArticleInput } from "../../models/newsArticleInput";
import { RssNewsSource } from "../../modules/news/news.types";

export const rssNewsSources: RssNewsSource[] = [
	{
		id: "anime-news-network",
		name: "Anime News Network",
		feedUrl: "https://www.animenewsnetwork.com/newsroom/rss.xml?ann-edition=us",
		defaultCategories: ["anime"],
		enabled: true,
	},
	{
		id: "myanimelist-news",
		name: "MyAnimeList News",
		feedUrl: "https://myanimelist.net/rss/news.xml",
		defaultCategories: ["anime"],
		enabled: true,
	},
	{
		id: "crunchyroll",
		name: "Crunchyroll",
		feedUrl: "https://feeds.feedburner.com/crunchyroll/rss",
		defaultCategories: ["anime"],
		enabled: true,
	},
	{
		id: "game-informer",
		name: "Game Informer",
		feedUrl: "https://gameinformer.com/rss.xml",
		defaultCategories: ["gaming"],
		enabled: true,
	},
	{
		id: "eurogamer",
		name: "Eurogamer",
		feedUrl: "https://www.eurogamer.net/feed",
		defaultCategories: ["gaming"],
		enabled: true,
	},
	{
		id: "the-verge-games",
		name: "The Verge Games",
		feedUrl: "https://www.theverge.com/rss/games/index.xml",
		defaultCategories: ["gaming"],
		enabled: true,
	},
];

export interface RssFetchResult {
	articles: NewsArticleInput[];
	failedSources: Array<{
		sourceId: string;
		sourceName: string;
		message: string;
	}>;
}

const REQUEST_TIMEOUT_MS = 12000;

export const fetchLatestRssArticles = async (): Promise<RssFetchResult> => {
	const articles: NewsArticleInput[] = [];
	const failedSources: RssFetchResult["failedSources"] = [];

	for (const source of rssNewsSources.filter((item) => item.enabled)) {
		try {
			articles.push(...(await fetchSourceArticles(source)));
		} catch (error) {
			failedSources.push({
				sourceId: source.id,
				sourceName: source.name,
				message: getErrorMessage(error),
			});
		}
	}

	return { articles, failedSources };
};

const fetchSourceArticles = async (source: RssNewsSource): Promise<NewsArticleInput[]> => {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

	try {
		const response = await fetch(source.feedUrl, {
			headers: {
				"User-Agent": "Nakama/1.0 RSS Importer",
				Accept: "application/rss+xml, application/xml, text/xml",
			},
			signal: controller.signal,
		});

		if (!response.ok) {
			throw new Error(`Feed request failed with ${response.status}`);
		}

		const xml = await response.text();
		return parseRssItems(xml, source);
	} finally {
		clearTimeout(timeout);
	}
};

const parseRssItems = (xml: string, source: RssNewsSource): NewsArticleInput[] => {
	const itemMatches = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
	const entryMatches = xml.match(/<entry\b[\s\S]*?<\/entry>/gi) ?? [];

	return [...itemMatches, ...entryMatches]
		.map((itemXml) => parseRssItem(itemXml, source))
		.filter((item): item is NewsArticleInput => item !== null);
};

const parseRssItem = (itemXml: string, source: RssNewsSource): NewsArticleInput | null => {
	const title = readTag(itemXml, "title");
	const articleUrl = readTag(itemXml, "link") ?? readLinkHref(itemXml);
	const publishedAt = parseDate(
		readTag(itemXml, "pubDate") ?? readTag(itemXml, "published") ?? readTag(itemXml, "updated")
	);

	if (!title || !articleUrl || !publishedAt) {
		return null;
	}

	const categories = unique([
		...source.defaultCategories,
		...readCategoryValues(itemXml).map(normalizeCategory).filter(Boolean),
	]);

	return {
		sourceId: source.id,
		sourceName: source.name,
		externalId: readTag(itemXml, "guid") ?? readTag(itemXml, "id") ?? articleUrl,
		title,
		description: stripHtml(
			readTag(itemXml, "description") ??
				readTag(itemXml, "summary") ??
				readTag(itemXml, "content") ??
				readTag(itemXml, "content:encoded") ??
				""
		),
		articleUrl,
		imageUrl: readMediaUrl(itemXml),
		author: readTag(itemXml, "dc:creator") ?? readTag(itemXml, "author"),
		publishedAt,
		categories,
		keywords: categories,
	};
};

const readTag = (xml: string, tagName: string): string | undefined => {
	const escapedTagName = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const match = xml.match(new RegExp(`<${escapedTagName}\\b[^>]*>([\\s\\S]*?)<\\/${escapedTagName}>`, "i"));
	const value = match?.[1];

	if (!value) {
		return undefined;
	}

	return decodeXml(value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "")).trim() || undefined;
};

const readTags = (xml: string, tagName: string): string[] => {
	const escapedTagName = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const matches = xml.matchAll(new RegExp(`<${escapedTagName}\\b[^>]*>([\\s\\S]*?)<\\/${escapedTagName}>`, "gi"));

	return Array.from(matches)
		.map((match) => decodeXml(match[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "")).trim())
		.filter(Boolean);
};

const readLinkHref = (xml: string): string | undefined => {
	const alternateLink =
		xml.match(/<link\b(?=[^>]*\brel=["']alternate["'])(?=[^>]*\bhref=["']([^"']+)["'])[^>]*>/i)?.[1] ??
		xml.match(/<link\b(?=[^>]*\bhref=["']([^"']+)["'])[^>]*>/i)?.[1];

	return alternateLink ? decodeXml(alternateLink).trim() : undefined;
};

const readCategoryValues = (xml: string): string[] => {
	const innerValues = readTags(xml, "category");
	const termMatches = xml.matchAll(/<category\b[^>]*\bterm=["']([^"']+)["'][^>]*>/gi);
	const termValues = Array.from(termMatches).map((match) => decodeXml(match[1]).trim());

	return [...innerValues, ...termValues];
};

const readMediaUrl = (xml: string): string | undefined => {
	const enclosure = xml.match(/<enclosure\b[^>]*\burl=["']([^"']+)["'][^>]*>/i)?.[1];
	const mediaContent = xml.match(/<media:content\b[^>]*\burl=["']([^"']+)["'][^>]*>/i)?.[1];
	const mediaThumbnail = xml.match(/<media:thumbnail\b[^>]*\burl=["']([^"']+)["'][^>]*>/i)?.[1];

	return decodeXml(enclosure ?? mediaContent ?? mediaThumbnail ?? "").trim() || undefined;
};

const parseDate = (value: string | undefined): Date | null => {
	if (!value) {
		return null;
	}

	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
};

const stripHtml = (value: string): string | undefined => {
	const stripped = value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
	return stripped || undefined;
};

const normalizeCategory = (value: string): string =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const unique = (values: string[]): string[] => Array.from(new Set(values.filter(Boolean)));

const decodeXml = (value: string): string =>
	value
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");

const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	}

	return "Unknown RSS fetch error";
};
