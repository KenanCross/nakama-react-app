import { ObjectId } from "mongodb";
import { db } from "../../db";
import { NewsCursor, StoredNewsArticle } from "./news.types";

const collection = () => db().collection<StoredNewsArticle>("news");

export const ensureNewsIndexes = async (): Promise<void> => {
	await collection().createIndexes([
		{
			key: { canonicalUrl: 1 },
			name: "news_canonicalUrl_unique",
			unique: true,
		},
		{
			key: { fingerprint: 1 },
			name: "news_fingerprint_unique",
			unique: true,
		},
		{
			key: { publishedAt: -1 },
			name: "news_publishedAt_desc",
		},
		{
			key: { categories: 1, publishedAt: -1 },
			name: "news_categories_publishedAt_desc",
		},
		{
			key: { status: 1, publishedAt: -1 },
			name: "news_status_publishedAt_desc",
		},
	]);
};

export const upsertNewsArticle = async (
	article: Omit<StoredNewsArticle, "_id">
): Promise<"saved" | "imageBackfilled" | "duplicate"> => {
	const existing = await collection().findOne({
		$or: [{ canonicalUrl: article.canonicalUrl }, { fingerprint: article.fingerprint }],
	});

	if (existing) {
		if (!existing.imageUrl && article.imageUrl) {
			await collection().updateOne(
				{ _id: existing._id },
				{ $set: { imageUrl: article.imageUrl } }
			);
			return "imageBackfilled";
		}

		return "duplicate";
	}

	await collection().insertOne(article);
	return "saved";
};

export const findPublishedNewsArticles = async ({
	category,
	cursor,
	limit,
}: {
	category?: string;
	cursor?: NewsCursor;
	limit: number;
}): Promise<StoredNewsArticle[]> => {
	const cursorFilter = cursor
		? {
				$or: [
					{ publishedAt: { $lt: cursor.publishedAt } },
					{
						publishedAt: cursor.publishedAt,
						_id: { $lt: cursor.id },
					},
				],
		  }
		: {};

	const categoryFilter = category ? { categories: category } : {};

	return collection()
		.find({
			status: "published",
			...categoryFilter,
			...cursorFilter,
		})
		.sort({ featured: -1, publishedAt: -1, _id: -1 })
		.limit(limit)
		.toArray();
};

export const isValidObjectId = (value: string): boolean => ObjectId.isValid(value);
