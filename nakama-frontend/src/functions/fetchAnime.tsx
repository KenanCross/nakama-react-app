import { useState, useEffect, useCallback } from "react";
import AnimeData, {
	AnimeDataArray,
	AnimeRecommendationComparison,
	RecommendationEntry,
} from "../models/anime";
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
const CURRENT_SEASON_URL = "https://api.jikan.moe/v4/seasons/now?sfw=true&limit=25";
const MAX_SCHEDULE_PAGES = 4;

interface JikanAnimeResponse {
	data?: AnimeData[];
	pagination?: {
		has_next_page?: boolean;
	};
	index?: number;
}

interface JikanRecommendation {
	entry: RecommendationEntry | RecommendationEntry[];
	content?: string;
	date?: string;
	user?: {
		url?: string;
		username?: string;
	};
}

interface JikanRecommendationResponse {
	data?: JikanRecommendation[];
}

const getTodaySchedule = () => {
	const today = new Date();
	const scheduleDay = DAYS[today.getDay()];
	const broadcastDay = `${today.toLocaleDateString("en-US", { weekday: "long" })}s`;

	return { scheduleDay, broadcastDay };
};

const hasAnimeData = (response: JikanAnimeResponse): response is JikanAnimeResponse & { data: AnimeData[] } => {
	return Array.isArray(response.data);
};

const fetchAnimePage = async (url: string) => {
	const response = await cachedFetch(url) as JikanAnimeResponse;
	if (!hasAnimeData(response)) throw new Error("No anime data found");
	return response;
};

const fetchSchedulePages = async (scheduleDay: string) => {
	const pages: AnimeData[] = [];
	let latestResponse: JikanAnimeResponse | null = null;

	for (let page = 1; page <= MAX_SCHEDULE_PAGES; page += 1) {
		const response = await fetchAnimePage(
			`https://api.jikan.moe/v4/schedules/${scheduleDay}?sfw=true&limit=25&page=${page}`,
		);

		pages.push(...response.data);
		latestResponse = response;

		if (!response.pagination?.has_next_page) break;
	}

	return {
		...(latestResponse ?? {}),
		data: pages,
	};
};

const getShowsBroadcastingOn = (shows: AnimeData[], broadcastDay: string) => {
	return shows.filter((anime) => anime.broadcast?.day === broadcastDay);
};

const getScoreValue = (score: AnimeData["score"]) => {
	if (typeof score === "number") return score;
	if (typeof score === "string") return Number(score) || 0;
	return 0;
};

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
		let isMounted = true;

		setLoading(true);
		setError(null);

		const loadTodaysShows = async () => {
			const { scheduleDay, broadcastDay } = getTodaySchedule();

			try {
				const [scheduleResult, seasonResult] = await Promise.allSettled([
					fetchSchedulePages(scheduleDay),
					fetchAnimePage(CURRENT_SEASON_URL),
				]);
				const scheduleResponse = scheduleResult.status === "fulfilled"
					? scheduleResult.value
					: { data: [], index: 0 };
				const seasonResponse = seasonResult.status === "fulfilled"
					? seasonResult.value
					: { data: [], index: 0 };
				const currentSeasonShows = getShowsBroadcastingOn(seasonResponse.data, broadcastDay);
				const combinedShows = getUniqueObjects(
					[...scheduleResponse.data, ...currentSeasonShows],
					"mal_id",
				);
				const finalData = combinedShows.length > 0 ? combinedShows : seasonResponse.data;
				if (finalData.length === 0) throw new Error("No anime data found");

				if (!isMounted) return;
				setData({ ...scheduleResponse, data: finalData, index: scheduleResponse.index ?? 0 });
			} catch (err) {
				console.error("[useTodaysShows] error:", err);
				if (!isMounted) return;
				setError((err as Error).message ?? "Failed to load today's shows.");
			} finally {
				if (isMounted) setLoading(false);
			}
		};

		loadTodaysShows();

		return () => {
			isMounted = false;
		};
	}, [retryCount]);

	return { data, loading, error, refetch };
};

export const useContinuingShows = () => {
	const [data, setData] = useState<AnimeDataArray | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [retryCount, setRetryCount] = useState(0);

	const refetch = useCallback(() => setRetryCount((c) => c + 1), []);

	useEffect(() => {
		let isMounted = true;

		setLoading(true);
		setError(null);

		const loadContinuingShows = async () => {
			const { scheduleDay } = getTodaySchedule();

			try {
				const scheduleResponse = await fetchSchedulePages(scheduleDay);
				const currentSeasonResponse = await fetchAnimePage(CURRENT_SEASON_URL);
				const currentSeasonIds = new Set(currentSeasonResponse.data.map((anime) => anime.mal_id));
				const continuingShows = scheduleResponse.data.filter((anime) => !currentSeasonIds.has(anime.mal_id));

				if (!isMounted) return;
				setData({
					...scheduleResponse,
					data: getUniqueObjects(continuingShows, "mal_id"),
					index: scheduleResponse.index ?? 0,
				});
			} catch (err) {
				console.error("[useContinuingShows] error:", err);
				if (!isMounted) return;
				setError((err as Error).message ?? "Failed to load continuing shows.");
			} finally {
				if (isMounted) setLoading(false);
			}
		};

		loadContinuingShows();

		return () => {
			isMounted = false;
		};
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
		const url = filter === 1
			? `https://api.jikan.moe/v4/seasons/upcoming`
			: CURRENT_SEASON_URL;

		console.log("[useTopTen] starting fetch:", url);

		fetch(url)
			.then((res) => {
				console.log("[useTopTen] HTTP status:", res.status);
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return res.json();
			})
			.then((json: JikanAnimeResponse) => {
				if (!json.data) throw new Error("No anime data found");
				console.log("[useTopTen] raw count:", json.data.length);
				console.log("[useTopTen] distinct types in response:", [...new Set(json.data.map((anime) => anime.type))]);

				// Filter by media type client-side
				let filtered = json.data.filter(
					(anime) => anime.type?.toLowerCase() === MEDIA_TYPES[type].toLowerCase()
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
					.sort((a, b) => getScoreValue(b.score) - getScoreValue(a.score))
					.slice(0, 10);
				console.log("[useTopTen] after sort+slice:", sorted.length);
				console.log("[useTopTen] scores:", sorted.map((anime) => `${anime.title}: ${anime.score}`));

				setData({ ...json, data: sorted, index: json.index ?? 0 });
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
			.then((json: JikanRecommendationResponse) => {
				console.log("[useGetRecommendations] response:", json);
				if (!json.data || json.data.length === 0) {
					setData([]);
					setError("No recommendations available.");
					return;
				}
				const formattedData: AnimeRecommendationComparison[] = json.data.flatMap((rec) => {
					const entry = Array.isArray(rec.entry) ? rec.entry : [rec.entry];
					const firstEntry = entry[0];
					if (!firstEntry) return [];

					return [{
						mal_id: String(firstEntry.mal_id),
						entry,
						content: rec.content || "",
						date: rec.date || "",
						user: {
							url: rec.user?.url ?? "",
							username: rec.user?.username ?? "Unknown",
						},
					}];
				});
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
