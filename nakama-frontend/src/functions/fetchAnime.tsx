import { useState, useEffect, useCallback } from "react";
import { AnimeDataArray, AnimeRecommendationComparison } from "../models/anime";
import { cachedFetch } from "./apiCache";

export function getUniqueObjects<T>(array: T[], property: keyof T) {
	const seenValues = new Set();
	return array.filter((obj) => {
		const value = obj[property];
		if (seenValues.has(value)) return false;
		seenValues.add(value);
		return true;
	});
}

// Plain arrays instead of TypeScript numeric enums.
// Object.values() on a numeric enum returns [0,1,2,...,"Name1","Name2",...]
// which means index lookups silently return numbers instead of the strings
// Jikan expects. Plain arrays are unambiguous.
const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MEDIA_TYPES = ["tv", "movie", "ona", "ova", "special"];
const SEASON_FILTERS = ["tv", "movie", "ona", "ova", "special"];
const TOP_PERIODS = ["airing", "upcoming", "bypopularity", "favorite"];

export const useFilteredData = (type: number, continueFlag?: boolean, page?: number) => {
	const [data, setData] = useState<AnimeDataArray | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [lastPage, setLastPage] = useState<boolean | null>(null);
	const [retryCount, setRetryCount] = useState(0);

	const refetch = useCallback(() => setRetryCount((c) => c + 1), []);

	useEffect(() => {
		setLoading(true);
		setError(null);

		const ongoing = continueFlag ? "&continuing" : "";
		const pageRef = page ? `&page=${page}` : "";
		const url = `https://api.jikan.moe/v4/seasons/now?filter=${SEASON_FILTERS[type]}${ongoing}${pageRef}&sfw`;

		console.log("[useFilteredData] fetching:", url);

		cachedFetch(url)
			.then((json) => {
				console.log("[useFilteredData] response:", json);
				if (!json.data) throw new Error("No anime data found");
				json.data = getUniqueObjects(json.data, "mal_id");
				setData(json);
				setLastPage(json.pagination?.has_next_page ?? null);
			})
			.catch((err) => {
				console.error("[useFilteredData] error:", err);
				setError((err as Error).message ?? "Failed to load seasonal anime.");
			})
			.finally(() => setLoading(false));
	}, [type, page, continueFlag, retryCount]);

	return { data, lastPage, loading, error, refetch };
};

export const useTodaysShows = () => {
	const [data, setData] = useState<AnimeDataArray | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [retryCount, setRetryCount] = useState(0);

	const refetch = useCallback(() => setRetryCount((c) => c + 1), []);

	useEffect(() => {
		setLoading(true);
		setError(null);

		const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" }) + "s";

		fetch(`https://api.jikan.moe/v4/seasons/now?sfw=true&limit=25`)
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return res.json();
			})
			.then((json) => {
				if (!json.data) throw new Error("No data in response");
				const todaysShows = json.data.filter((anime: any) => anime.broadcast?.day === todayName);
				const finalData = todaysShows.length > 0 ? todaysShows : json.data;
				setData({ ...json, data: getUniqueObjects(finalData, "mal_id") });
			})
			.catch((err) => {
				console.error("[useTodaysShows] error:", err.message);
				setError(err.message ?? "Failed to load today's shows.");
			})
			.finally(() => setLoading(false));
	}, [retryCount]);

	return { data, loading, error, refetch };
};

export const useTopTen = (type: number, filter: number) => {
	const [data, setData] = useState<AnimeDataArray | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [retryCount, setRetryCount] = useState(0);

	const refetch = useCallback(() => setRetryCount((c) => c + 1), []);

	useEffect(() => {
		setLoading(true);
		setError(null);

		// /top/anime 504s when type or filter params are added.
		// /seasons/now is reliable and returns currently airing shows
		// with score data — we sort client-side to build a meaningful top 10.
		// For upcoming (filter=1) we use /seasons/upcoming instead.
		const STATUS_MAP: Record<number, string> = {
			0: "Currently Airing",
			1: "Not yet aired",
		};

		const url = filter === 1
			? `https://api.jikan.moe/v4/seasons/upcoming`
			: `https://api.jikan.moe/v4/seasons/now?sfw=true&limit=25`;

		console.log("[useTopTen] starting fetch:", url);

		fetch(url)
			.then((res) => {
				console.log("[useTopTen] HTTP status:", res.status);
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return res.json();
			})
			.then((json) => {
				if (!json.data) throw new Error("No anime data found");
				console.log("[useTopTen] raw count:", json.data.length);
				console.log("[useTopTen] distinct types in response:", [...new Set(json.data.map((a: any) => a.type))]);

				// Filter by media type client-side
				let filtered = json.data.filter(
					(anime: any) => anime.type?.toLowerCase() === MEDIA_TYPES[type].toLowerCase()
				);
				console.log("[useTopTen] after type filter:", filtered.length, "looking for type:", MEDIA_TYPES[type]);

				// Fall back to full list if type filter is too narrow
				if (filtered.length < 5) filtered = json.data;
				console.log("[useTopTen] after fallback check:", filtered.length);

				// Deduplicate first so the pool is clean before sorting
				const unique = getUniqueObjects(filtered, "mal_id");
				console.log("[useTopTen] after dedup:", unique.length);

				// Sort by score descending, unscored shows go to the bottom.
				const sorted = [...unique]
					.sort((a: any, b: any) => (b.score ?? 0) - (a.score ?? 0))
					.slice(0, 10);
				console.log("[useTopTen] after sort+slice:", sorted.length);
				console.log("[useTopTen] scores:", sorted.map((a: any) => `${a.title}: ${a.score}`));

				json.data = sorted;
				setData(json);
			})
			.catch((err) => {
				console.error("[useTopTen] error:", err.message);
				setError(err.message ?? "Failed to load top anime.");
			})
			.finally(() => {
				console.log("[useTopTen] fetch complete");
				setLoading(false);
			});
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
		setLoading(true);
		setError(null);

		const fetchUrl = animeId
			? `https://api.jikan.moe/v4/anime/${animeId}/recommendations`
			: `https://api.jikan.moe/v4/recommendations/anime`;

		console.log("[useGetRecommendations] fetching:", fetchUrl);

		cachedFetch(fetchUrl)
			.then((json) => {
				console.log("[useGetRecommendations] response:", json);
				if (!json.data || json.data.length === 0) {
					setData([]);
					setError("No recommendations available.");
					return;
				}
				const formattedData: AnimeRecommendationComparison[] = json.data.map((rec: any) => ({
					mal_id: rec.entry.mal_id,
					entry: Array.isArray(rec.entry) ? rec.entry : [rec.entry],
					content: rec.content || "",
					date: rec.date || "",
					user: rec.user || { url: "", username: "Unknown" },
				}));
				setData(formattedData);
			})
			.catch((err) => {
				console.error("[useGetRecommendations] error:", err);
				setError((err as Error).message ?? "Failed to load recommendations.");
			})
			.finally(() => setLoading(false));
	}, [animeId, retryCount]);

	return { data, loading, error, refetch };
};
