import { useState, useEffect, useRef } from "react";
import { AnimeDataArray, AnimeRecommendationComparison } from "../models/anime";

const DELAY = 2000;

// Shared utility: runs fetchFn immediately if enough time has passed since
// lastExecuted, otherwise waits and runs it after the remaining delay.
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
	const [lastPage, setLastPage] = useState<boolean | null>(null);
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

	useEffect(() => {
		setLoading(true);

		const fetchAnimeData = async () => {
			try {
				const response = await fetch(
					`https://api.jikan.moe/v4/seasons/now?filter=${Object.values(filter)[type]}${ongoing}${pageRef}&sfw`
				);
				const json = await response.json();
				if (!json.data) throw new Error("No anime data found");
				json.data = getUniqueObjects(json.data, "mal_id");
				setData(json);
				setLastPage(json.pagination?.has_next_page ?? null);
			} catch (error) {
				console.error("Error fetching seasonal anime:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchWithDelay(lastExecuted, fetchAnimeData);
	}, [type, page, continueFlag]);

	return { data, lastPage, loading };
};

export const useTodaysShows = () => {
	const [data, setData] = useState<AnimeDataArray | null>(null);
	const [loading, setLoading] = useState(true);

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

	useEffect(() => {
		const fetchAnimeData = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`https://api.jikan.moe/v4/schedules?sfw=true&kids=false&page=1&filter=${Object.values(Days)[dayIndex]}`
				);
				const json = await response.json();
				if (!json.data) throw new Error("No anime data found");
				json.data = getUniqueObjects(json.data, "mal_id");
				setData(json);
			} catch (error) {
				console.error("Error fetching today's shows:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAnimeData();
	}, [dayIndex]);

	return { data, loading };
};

export const useTopTen = (type: number, filter: number) => {
	const [data, setData] = useState<AnimeDataArray | null>(null);
	const [loading, setLoading] = useState(true);
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

	useEffect(() => {
		setLoading(true);

		const fetchAnimeData = async () => {
			try {
				const response = await fetch(
					`https://api.jikan.moe/v4/top/anime?limit=15&type=${Object.values(medium)[type]}&filter=${Object.values(period)[filter]}&sfw`
				);
				const json = await response.json();
				if (!json.data) throw new Error("No anime data found");
				json.data = getUniqueObjects(json.data, "mal_id");
				setData(json);
			} catch (error) {
				console.error("Error fetching top anime:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchWithDelay(lastExecuted, fetchAnimeData);
	}, [type, filter]);

	return { data, loading };
};

export const useGetRecommendations = (animeId?: string) => {
	const [data, setData] = useState<AnimeRecommendationComparison[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Derive the URL inside the effect so it's always fresh and in sync
		const fetchUrl = animeId
			? `https://api.jikan.moe/v4/anime/${animeId}/recommendations`
			: `https://api.jikan.moe/v4/recommendations/anime`;

		const fetchAnimeData = async () => {
			try {
				setLoading(true);
				const response = await fetch(fetchUrl);
				if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

				const json = await response.json();
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
				setError(null);
			} catch (error) {
				console.error("Error fetching recommendations:", error);
				setError("Failed to load recommendations. Try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchAnimeData();
	}, [animeId]);

	return { data, loading, error };
};
