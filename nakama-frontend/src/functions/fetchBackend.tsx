import { useCallback, useEffect, useState } from "react";
import type NewsData from "../models/news";
import type { NewsFeedResponse } from "../models/news";

export const useGetUser = () => {
	const [user, setUser] = useState();
	useEffect(() => {
		fetch(``)
			.then((response) => response.json())
			.then((data) => setUser(data))
			.catch((error) => console.error("Error fetching user details", error));
	}, []);
	return user;
};

export const useGetReview = () => {
	const [review, setReview] = useState();
	useEffect(() => {
		fetch(`http://localhost:3000/api/reviews/allReviews`)
			.then((response) => response.json())
			.then((data) => setReview(data))
			.catch((error) => console.error("Error fetching review", error));
	}, []);
	return review;
};

interface UseGetNewsOptions {
	category?: string;
	limit?: number;
}

export const useGetNews = ({ category, limit = 20 }: UseGetNewsOptions = {}) => {
	const [news, setNews] = useState<NewsData[]>([]);
	const [nextCursor, setNextCursor] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [loadingMore, setLoadingMore] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchNews = useCallback(
		async ({ cursor, append }: { cursor?: string; append: boolean }) => {
			append ? setLoadingMore(true) : setLoading(true);
			setError(null);

			try {
				const params = new URLSearchParams({ limit: String(limit) });
				if (category) params.set("category", category);
				if (cursor) params.set("cursor", cursor);

				const response = await fetch(`http://localhost:3000/api/news?${params.toString()}`);

				if (!response.ok) {
					throw new Error(`News request failed with ${response.status}`);
				}

				const data = (await response.json()) as NewsFeedResponse;
				const items = Array.isArray(data.items) ? data.items : [];

				setNews((currentNews) => (append ? [...currentNews, ...items] : items));
				setNextCursor(data.nextCursor ?? null);
			} catch (fetchError) {
				setError(fetchError instanceof Error ? fetchError.message : "Error fetching news");
			} finally {
				append ? setLoadingMore(false) : setLoading(false);
			}
		},
		[category, limit]
	);

	useEffect(() => {
		fetchNews({ append: false });
	}, [fetchNews]);

	const loadMore = () => {
		if (!nextCursor || loadingMore) {
			return;
		}

		fetchNews({ cursor: nextCursor, append: true });
	};

	return { news, nextCursor, loading, loadingMore, error, loadMore };
};
