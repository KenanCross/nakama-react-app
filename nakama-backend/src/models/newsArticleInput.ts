export interface NewsArticleInput {
	sourceId: string;
	sourceName: string;
	externalId?: string;
	title: string;
	description?: string;
	articleUrl: string;
	imageUrl?: string;
	author?: string;
	publishedAt: Date;
	categories: string[];
	keywords: string[];
}