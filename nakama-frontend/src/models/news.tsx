export default interface NewsData {
	sourceName: string;
	id: string;
	title: string;
	description?: string;
	articleUrl: string;
	imageUrl?: string;
	author?: string;
	categories: string[];
	publishedAt: string;
	featured: boolean;
}

export interface NewsFeedResponse {
	items: NewsData[];
	nextCursor: string | null;
}
