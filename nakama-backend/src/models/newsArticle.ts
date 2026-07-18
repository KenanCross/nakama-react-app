import { ObjectId } from "mongodb";

export interface NewsArticle {
	_id: ObjectId;
	sourceId: string;
	sourceName: string;

	title: string;
	slug: string;
	description?: string;

	articleUrl: string;
	canonicalUrl: string;
	imageUrl?: string;
	author?: string;

	categories: string[];
	keywords: string[];

	publishedAt: Date;
	importedAt: Date;

	status: "published" | "hidden" | "review";
	featured: boolean;

	fingerprint: string;
}
