import { useState, useEffect } from "react";
import { AnimeDataArray, AnimeRecommendationComparison } from "../models/anime";

export function getUniqueObjects<T>(array: T[], property: keyof T) {
  const seenValues = new Set();
  return array.filter((obj) => {
    const value = obj[property];
    if (seenValues.has(value)) {
      return false;
    }
    seenValues.add(value);
    return true;
  });
}

export const useFilteredData = (type: number, continueFlag?: boolean, page?: number) => {
  const [data, setData] = useState<AnimeDataArray | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastPage, setLastPage] = useState<boolean | null>(null);
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
    const fetchAnimeData = async () => {
      try {
        console.log("Fetching seasonal anime...");
        setLoading(true);
        const response = await fetch(
          `https://api.jikan.moe/v4/seasons/now?filter=${Object.values(filter)[type]}${ongoing}${pageRef}&sfw`
        );
        const json = await response.json();
        if (!json.data) throw new Error("No anime data found");

        json.data = getUniqueObjects(json.data, "mal_id");
        setData(json);
        setLastPage(json.pagination?.has_next_page ?? null);
      } catch (error) {
        console.error("Error fetching anime details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimeData();
  }, [type, page, continueFlag]);

  return { data, lastPage, loading };
};

export const useTodaysShows = (setData: (data: AnimeDataArray | null) => void) => {
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
      try {
        const response = await fetch(
          `https://api.jikan.moe/v4/schedules?sfw=true&kids=false&page=1&filter=${Object.values(Days)[dayIndex]}`
        );
        const json = await response.json();
        if (!json.data) throw new Error("No anime data found");

        json.data = getUniqueObjects(json.data, "mal_id");
        setData(json);
      } catch (error) {
        console.error("Error fetching anime details", error);
      }
    };
    fetchAnimeData();
  }, [dayIndex]);
};

export const useTopTen = (type: number, filter: number) => {
  const [data, setData] = useState<AnimeDataArray | null>(null);
  const [loading, setLoading] = useState(true);

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
    const fetchAnimeData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.jikan.moe/v4/top/anime?limit=15&type=${Object.values(medium)[type]}&filter=${Object.values(period)[filter]}&sfw`
        );
        const json = await response.json();
        if (!json.data) throw new Error("No anime data found");

        json.data = getUniqueObjects(json.data, "mal_id");
        setData(json);
      } catch (error) {
        console.error("Error fetching anime details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimeData();
  }, [type, filter]);

  return { data, loading };
};

export const useGetRecommendations = (animeId?: string) => {
	const [data, setData] = useState<AnimeRecommendationComparison[]>([]);
	const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(animeId)
	// NOTE: No trailing slash to avoid 301 redirect and CORS issues.
	let fetchUrl = `https://api.jikan.moe/v4/anime/${animeId}/recommendations`;

	useEffect(() => {
		if (!animeId) {
			// console.warn("🚨 No anime ID provided!");
			// setError("No anime ID provided.");
			// setLoading(false);
			// return;
			// NOTE: No trailing slash to avoid 301 redirect and CORS issues.
			fetchUrl = `https://api.jikan.moe/v4/recommendations/anime`;
		}

		console.log(`🔍 Fetching recommendations from: ${fetchUrl}`);

		const fetchAnimeData = async () => {
			try {
				setLoading(true);
				const response = await fetch(fetchUrl);
				if (!response.ok) {
					throw new Error(`HTTP Error: ${response.status}`);
				}
				const json = await response.json();
				if (!json.data || json.data.length === 0) {
					console.warn("⚠️ No recommendations found.");
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
				console.log("✅ Extracted Recommendations:", formattedData);
				setData(formattedData);
				setError(null);
			} catch (error) {
				console.error("❌ Error fetching recommendations:", error);
				setError("Failed to load recommendations. Try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchAnimeData();
	}, [animeId]);

	return { data, loading, error };
};
