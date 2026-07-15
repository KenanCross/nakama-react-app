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
const MEDIA_TYPES = ["tv", "movie", "ona", "ova", "special"];
const SEASON_FILTERS = ["tv", "movie", "ona", "ova", "special"];
const CURRENT_SEASON_URL = "https://api.jikan.moe/v4/seasons/now?sfw=true&limit=25";
const CONTINUING_SEASON_URL = "https://api.jikan.moe/v4/seasons/now?continuing=true&sfw=true&limit=25";
const MAX_SEASON_PAGES = 4;
const ANILIST_GRAPHQL_URL = "https://graphql.anilist.co";
const ANILIST_AIRING_TODAY_QUERY = `
	query AiringToday($start: Int, $end: Int) {
		Page(page: 1, perPage: 50) {
			airingSchedules(
				airingAt_greater: $start
				airingAt_lesser: $end
				sort: TIME
			) {
				airingAt
				episode
				media {
					id
					idMal
					title {
						romaji
						english
						native
					}
					description(asHtml: false)
					averageScore
					meanScore
					genres
					status
					type
					format
					season
					seasonYear
					coverImage {
						large
						medium
					}
					rankings {
						rank
						type
						allTime
					}
				}
			}
		}
	}
`;

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

interface AniListTitle {
	romaji?: string | null;
	english?: string | null;
	native?: string | null;
}

interface AniListRanking {
	rank: number;
	type: "RATED" | "POPULAR";
	allTime: boolean;
}

interface AniListMedia {
	id: number;
	idMal?: number | null;
	title: AniListTitle;
	description?: string | null;
	averageScore?: number | null;
	meanScore?: number | null;
	genres?: string[] | null;
	status?: string | null;
	type?: string | null;
	format?: string | null;
	season?: string | null;
	seasonYear?: number | null;
	coverImage?: {
		large?: string | null;
		medium?: string | null;
	} | null;
	rankings?: AniListRanking[] | null;
}

interface AniListAiringSchedule {
	airingAt: number;
	episode?: number | null;
	media?: AniListMedia | null;
}

interface AniListAiringTodayResponse {
	data?: {
		Page?: {
			airingSchedules?: AniListAiringSchedule[] | null;
		} | null;
	};
	errors?: {
		message: string;
		status?: number;
	}[];
}

const getTodayTimeRange = () => {
	const start = new Date();
	start.setHours(0, 0, 0, 0);

	const end = new Date(start);
	end.setHours(23, 59, 59, 999);

	return {
		start: Math.floor(start.getTime() / 1000),
		end: Math.floor(end.getTime() / 1000),
	};
};

const hasAnimeData = (response: JikanAnimeResponse): response is JikanAnimeResponse & { data: AnimeData[] } => {
	return Array.isArray(response.data);
};

const fetchAnimePage = async (url: string) => {
	const response = await cachedFetch(url) as JikanAnimeResponse;
	if (!hasAnimeData(response)) throw new Error("No anime data found");
	return response;
};

const fetchSeasonPages = async (baseUrl: string) => {
	const pages: AnimeData[] = [];
	let latestResponse: JikanAnimeResponse | null = null;

	for (let page = 1; page <= MAX_SEASON_PAGES; page += 1) {
		const response = await fetchAnimePage(`${baseUrl}&page=${page}`);

		pages.push(...response.data);
		latestResponse = response;

		if (!response.pagination?.has_next_page) break;
	}

	return {
		...(latestResponse ?? {}),
		data: pages,
	};
};

const getScoreValue = (score: AnimeData["score"]) => {
	if (typeof score === "number") return score;
	if (typeof score === "string") return Number(score) || 0;
	return 0;
};

const stripHtml = (value?: string | null) => {
	if (!value) return "";
	return value.replace(/<[^>]*>/g, "").trim();
};

const getPreferredAniListRank = (rankings?: AniListRanking[] | null) => {
	return rankings?.find((ranking) => ranking.type === "RATED" && ranking.allTime)?.rank
		?? rankings?.find((ranking) => ranking.type === "RATED")?.rank
		?? rankings?.find((ranking) => ranking.type === "POPULAR")?.rank;
};

const getAniListScore = (media: AniListMedia) => {
	const score = media.averageScore ?? media.meanScore;
	return score ? Number((score / 10).toFixed(1)) : undefined;
};

const mapAniListScheduleToAnimeData = (schedule: AniListAiringSchedule): AnimeData | null => {
	const media = schedule.media;
	if (!media?.idMal) return null;

	const imageUrl = media.coverImage?.large ?? media.coverImage?.medium ?? "";
	const title = media.title.romaji ?? media.title.english ?? media.title.native ?? "Untitled";

	return {
		mal_id: media.idMal,
		title,
		title_english: media.title.english ?? undefined,
		images: {
			jpg: {
				image_url: imageUrl,
				small_image_url: media.coverImage?.medium ?? imageUrl,
				large_image_url: imageUrl,
			},
			webp: {
				image_url: imageUrl,
				small_image_url: media.coverImage?.medium ?? imageUrl,
				large_image_url: imageUrl,
			},
		},
		episodes: schedule.episode ?? undefined,
		type: media.format ?? media.type ?? undefined,
		score: getAniListScore(media),
		synopsis: stripHtml(media.description),
		rank: getPreferredAniListRank(media.rankings),
		season: media.season?.toLowerCase(),
		year: media.seasonYear ?? undefined,
		airing: media.status === "RELEASING",
		broadcast: {
			time: new Date(schedule.airingAt * 1000).toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
			}),
			string: `Episode ${schedule.episode ?? "?"}`,
		},
		status: media.status ?? undefined,
		genres: media.genres?.map((genre) => ({
			name: genre,
		})) as AnimeData["genres"],
	};
};

const fetchAniListAiringToday = async () => {
	const { start, end } = getTodayTimeRange();
	const response = await fetch(ANILIST_GRAPHQL_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			query: ANILIST_AIRING_TODAY_QUERY,
			variables: { start, end },
		}),
	});

	const json = await response.json() as AniListAiringTodayResponse;
	if (!response.ok || json.errors?.length) {
		throw new Error(json.errors?.[0]?.message ?? `AniList request failed (${response.status})`);
	}

	const schedules = json.data?.Page?.airingSchedules ?? [];
	const mappedData = getUniqueObjects(
		schedules.flatMap((schedule) => {
			const anime = mapAniListScheduleToAnimeData(schedule);
			return anime ? [anime] : [];
		}),
		"mal_id",
	);

	return {
		raw: json,
		schedules,
		data: mappedData,
		index: 0,
	};
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
			try {
				const airingToday = await fetchAniListAiringToday();
				if (airingToday.data.length === 0) throw new Error("No anime data found");

				if (!isMounted) return;
				console.groupCollapsed("[useTodaysShows] AniList airing today");
				console.log("raw response:", airingToday.raw);
				console.log("airing schedule count:", airingToday.schedules.length);
				console.log("mapped carousel count:", airingToday.data.length);
				console.table(airingToday.data.map((anime) => ({
					mal_id: anime.mal_id,
					title: anime.title,
					broadcastTime: anime.broadcast?.time,
					season: anime.season,
					year: anime.year,
					status: anime.status,
					score: anime.score,
				})));
				console.log("final data:", airingToday.data);
				console.groupEnd();
				setData({ data: airingToday.data, index: airingToday.index });
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
			try {
				const continuingResponse = await fetchSeasonPages(CONTINUING_SEASON_URL);
				const currentSeasonResponse = await fetchSeasonPages(CURRENT_SEASON_URL);
				const currentSeasonIds = new Set(currentSeasonResponse.data.map((anime) => anime.mal_id));
				const continuingShows = continuingResponse.data.filter((anime) => !currentSeasonIds.has(anime.mal_id));

				if (!isMounted) return;
				setData({
					...continuingResponse,
					data: getUniqueObjects(continuingShows, "mal_id"),
					index: continuingResponse.index ?? 0,
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
