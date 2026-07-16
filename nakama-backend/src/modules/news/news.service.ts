import { ObjectId } from "mongodb";
import { fetchLatestRssArticles } from "../../integrations/rss/rss-client";
import { NewsArticleInput } from "../../models/newsArticleInput";
import { createArticleFingerprint } from "../../utils/fingerprints";
import { canonicalizeUrl, createSlug } from "../../utils/urls";
import {
	findPublishedNewsArticles,
	isValidObjectId,
	upsertNewsArticle,
} from "./news.repository";
import {
	NewsCursor,
	NewsImportResult,
	NewsListResponse,
	StoredNewsArticle,
} from "./news.types";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export const importLatestNewsArticles = async (): Promise<NewsImportResult> => {
	const result = await fetchLatestRssArticles();
	const importResult: NewsImportResult = {
		fetched: result.articles.length,
		saved: 0,
		duplicates: 0,
		rejected: 0,
		failedSources: result.failedSources,
	};

	for (const input of result.articles) {
		const article = toStoredArticle(input);

		if (!article) {
			importResult.rejected += 1;
			continue;
		}

		const status = await upsertNewsArticle(article);

		if (status === "saved") {
			importResult.saved += 1;
		} else {
			importResult.duplicates += 1;
		}
	}

	return importResult;
};

export const getNewsArticles = async ({
	category,
	cursor,
	limit,
}: {
	category?: string;
	cursor?: string;
	limit?: number;
}): Promise<NewsListResponse> => {
	const requestedLimit = normalizeLimit(limit);
	const parsedCursor = cursor ? decodeCursor(cursor) : undefined;
	const articles = await findPublishedNewsArticles({
		category,
		cursor: parsedCursor,
		limit: requestedLimit + 1,
	});
	const hasNextPage = articles.length > requestedLimit;
	const items = hasNextPage ? articles.slice(0, requestedLimit) : articles;
	const nextCursor = hasNextPage ? encodeCursor(items[items.length - 1]) : null;

	return {
		items: items.map((article) => ({
			id: article._id?.toHexString() ?? "",
			sourceName: article.sourceName,
			title: article.title,
			description: article.description,
			articleUrl: article.articleUrl,
			imageUrl: article.imageUrl,
			author: article.author,
			publishedAt: article.publishedAt.toISOString(),
			categories: article.categories,
			featured: article.featured,
		})),
		nextCursor,
	};
};

const toStoredArticle = (input: NewsArticleInput): Omit<StoredNewsArticle, "_id"> | null => {
	try {
		const canonicalUrl = canonicalizeUrl(input.articleUrl);

		return {
			sourceId: input.sourceId,
			sourceName: input.sourceName,
			externalId: input.externalId,
			title: input.title.trim(),
			slug: createSlug(input.title),
			description: input.description,
			articleUrl: input.articleUrl,
			canonicalUrl,
			imageUrl: input.imageUrl,
			author: input.author,
			categories: input.categories,
			keywords: input.keywords,
			publishedAt: input.publishedAt,
			importedAt: new Date(),
			status: "published",
			featured: false,
			fingerprint: createArticleFingerprint(input.title, input.sourceName),
		};
	} catch {
		return null;
	}
};

const normalizeLimit = (limit: number | undefined): number => {
	if (!limit || !Number.isFinite(limit)) {
		return DEFAULT_LIMIT;
	}

	return Math.min(Math.max(Math.floor(limit), 1), MAX_LIMIT);
};

const encodeCursor = (article: StoredNewsArticle): string | null => {
	if (!article._id) {
		return null;
	}

	return `${article.publishedAt.toISOString()}_${article._id.toHexString()}`;
};

const decodeCursor = (cursor: string): NewsCursor => {
	const [publishedAtValue, idValue] = cursor.split("_");

	if (!publishedAtValue || !idValue || !isValidObjectId(idValue)) {
		throw new Error("Invalid news cursor");
	}

	const publishedAt = new Date(publishedAtValue);

	if (Number.isNaN(publishedAt.getTime())) {
		throw new Error("Invalid news cursor");
	}

	return {
		publishedAt,
		id: new ObjectId(idValue),
	};
};
