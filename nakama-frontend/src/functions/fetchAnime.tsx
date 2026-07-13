import { useState, useEffect, useRef, useCallback } from "react";
import { AnimeDataArray, AnimeRecommendationComparison } from "../models/anime";
import { cachedFetch } from "./apiCache";

const DELAY = 2000;

// Shared utility: runs fetchFn immediately if enough time has passed since
// lastExecuted, otherwise waits out the remaining delay before running it.
const fetchWithDelay = (
	lastExecuted: React.MutableRefObject<number>,
	fetchFn: () => Promise<void>
) => {
	const elapsed = Date.now() - lastExecuted.current;
	if (elapsed >= DELAY) {
		lastExecuted.current = Date.now();
		fetchFn();
	} else {
		setTimeout(() => {
			lastExecuted.current = Date.now();
			fetchFn();
		}, DELAY - elapsed);
	}
};

export function getUniqueObjects<T>(array: T[], property: keyof T) {
	const seenValues = new Set();
	return array.filter((obj) => {
		const value = obj[property];
		if (seenValues.has(value)) return false;
		seenValues.add(value);
		return true;
	});
}

export const useFilteredData = (type: number, continueFlag?: boolean, page?: number) => {
	const [data, setData] = useState<AnimeDataArray | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [lastPage, setLastPage] = useState<boolean | null>(null);
	// retryCount is incremented by refetch() to re-trigger the useEffect.
	const [retryCount, setRetryCount] = useState(0);
	const lastExecuted = useRef(Date.now());
	const ongoing = continueFlag ? "&continuing" : "";
	const pageRef = page ? `&page=${page}` : "";

	enum filter {
		tv,
		movie,
		ona,
		ova,
		special,
	}

	const refetch = useCallback(() => setRetryCount((c) => c + 1), []);

	useEffect(() => {
		setLoading(true);
		setError(null);

		const fetchAnimeData = async () => {
			try {
				const json = await cachedFetch(
					`https://api.jikan.moe/v4/seasons/now?filter=${Object.values(filter)[type]}${ongoing}${pageRef}&sfw`
				);
				if (!json.data) throw new Error("No anime data found");
				json.data = getUniqueObjects(json.data, "mal_id");
				setData(json);
				setLastPage(json.pagination?.has_next_page ?? null);
			} catch (err) {
				setError((err as Error).message ?? "Failed to load seasonal anime.");
			} finally {
				setLoading(false);
			}
		};

		fetchWithDelay(lastExecuted, fetchAnimeData);
	}, [type, page, continueFlag, retryCount]);

	return { data, lastPage, loading, error, refetch };
};

export const useTodaysShows = () => {
	const [data, setData] = useState<AnimeDataArray | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [retryCount, setRetryCount] = useState(0);

	enum Days {
		Sunday,
		Monday,
		Tuesday,
		Wednesday,
		Thursday,
		Friday,
		Saturday,
	}

	const today = new Date();
	const dayIndex = today.getDay();
	const refetch = useCallback(() => setRetryCount((c) => c + 1), []);

	useEffect(() => {
		const fetchAnimeData = async () => {
			setLoading(true);
			setError(null);
			try {
				const json = await cachedFetch(
					`https://api.jikan.moe/v4/schedules?sfw=true&kids=false&page=1&filter=${Object.values(Days)[dayIndex]}`
				);
				if (!json.data) throw new Error("No anime data found");
				json.data = getUniqueObjects(json.data, "mal_id");
				setData(json);
			} catch (err) {
				setError((err as Error).message ?? "Failed to load today's shows.");
			} finally {
				setLoading(false);
			}
		};

		fetchAnimeData();
	}, [dayIndex, retryCount]);

	return { data, loading, error, refetch };
};

export const useTopTen = (type: number, filter: number) => {
	const [data, setData] = useState<AnimeDataArray | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [retryCount, setRetryCount] = useState(0);
	const lastExecuted = useRef(Date.now());

	enum medium {
		tv,
		movie,
		ona,
		ova,
		special,
	}

	enum period {
		airing,
		upcoming,
		bypopularity,
		favorite,
	}

	const refetch = useCallback(() => setRetryCount((c) => c + 1), []);

	useEffect(() => {
		setLoading(true);
		setError(null);

		const fetchAnimeData = async () => {
			try {
				const json = await cachedFetch(
					`https://api.jikan.moe/v4/top/anime?limit=15&type=${Object.values(medium)[type]}&filter=${Object.values(period)[filter]}&sfw`
				);
				if (!json.data) throw new Error("No anime data found");
				json.data = getUniqueObjects(json.data, "mal_id");
				setData(json);
			} catch (err) {
				setError((err as Error).message ?? "Failed to load top anime.");
			} finally {
				setLoading(false);
			}
		};

		fetchWithDelay(lastExecuted, fetchAnimeData);
	}, [type, filter, retryCount]);

	return { data, loading, error, refetch };
};

export const useGetRecommendations = (animeId?: string) => {
	const [data, setData] = useState<AnimeRecommendationComparison[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [retryCount, setRetryCount] = useState(0);

	const refetch = useCallback(() => setRetryCount((c) => c + 1), []);

	useEffect(() => {
		// Derive the URL inside the effect so it's always fresh and in sync.
		const fetchUrl = animeId
			? `https://api.jikan.moe/v4/anime/${animeId}/recommendations`
			: `https://api.jikan.moe/v4/recommendations/anime`;

		const fetchAnimeData = async () => {
			try {
				setLoading(true);
				setError(null);
				const json = await cachedFetch(fetchUrl);
				if (!json.data || json.data.length === 0) {
					setData([]);
					setError("No recommendations available for this anime.");
					return;
				}

				const formattedData: AnimeRecommendationComparison[] = json.data.map(
					(rec: any) => ({
						mal_id: rec.entry.mal_id,
						entry: Array.isArray(rec.entry) ? rec.entry : [rec.entry],
						content: rec.content || "",
						date: rec.date || "",
						user: rec.user || { url: "", username: "Unknown" },
					})
				);

				setData(formattedData);
			} catch (err) {
				setError((err as Error).message ?? "Failed to load recommendations.");
			} finally {
				setLoading(false);
			}
		};

		fetchAnimeData();
	}, [animeId, retryCount]);

	return { data, loading, error, refetch };
};
