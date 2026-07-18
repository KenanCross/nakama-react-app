import { ObjectId } from "mongodb";
import { NewsArticle } from "../../models/newsArticle";

export interface RssNewsSource {
	id: string;
	name: string;
	feedUrl: string;
	defaultCategories: string[];
	enabled: boolean;
}

export interface StoredNewsArticle extends Omit<NewsArticle, "_id"> {
	_id?: ObjectId;
	externalId?: string;
}

export interface NewsArticleListItem {
	id: string;
	sourceName: string;
	title: string;
	description?: string;
	articleUrl: string;
	imageUrl?: string;
	author?: string;
	publishedAt: string;
	categories: string[];
	featured: boolean;
}

export interface NewsListResponse {
	items: NewsArticleListItem[];
	nextCursor: string | null;
}

export interface NewsImportResult {
	fetched: number;
	saved: number;
	imageBackfilled: number;
	duplicates: number;
	rejected: number;
	failedSources: Array<{
		sourceId: string;
		sourceName: string;
		message: string;
	}>;
}

export interface NewsImportJobResult extends NewsImportResult {
	startedAt: string;
	finishedAt: string;
	durationMs: number;
	status: "completed" | "failed";
}

export interface NewsCursor {
	publishedAt: Date;
	id: ObjectId;
}
