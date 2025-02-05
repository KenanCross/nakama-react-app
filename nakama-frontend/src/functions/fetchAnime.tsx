import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AnimeDataArray, AnimeRecommendationComparison } from "../models/anime";


export function getUniqueObjects(array: [], property: string) {
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

export const useFilteredData = (
	type: number,
	continueFlag?: boolean,
	page?: number
) => {
	const [data, setData] = useState<AnimeDataArray | null>(null);
	const [loading, setLoading] = useState(true);
	const [lastPage, setLastPage] = useState(null);
	let ongoing = continueFlag ? "&continuing" : "";
	let pageRef = page ? `&page=${page}` : "";

	enum filter {
		tv,
		movie,
		ona,
		ova,
		special,
	}

	useEffect(() => {
		const fetchAnimeData = async () => {
			console.log("request Season shows");
			setLoading(true);
			await fetch(
				`https://api.jikan.moe/v4/seasons/now?filter=${Object.values(filter)[type]}${ongoing}${pageRef}&sfw`
			)
				.then((response) => response.json())
				.then((data) => {
					data.data = getUniqueObjects(data.data, "mal_id");
					setData(data);
					setLastPage(data.pagination.has_next_page);
				})
				.catch((error) => console.error("Error fetching anime details", error))
				.finally(() => setLoading(false));
		};
		fetchAnimeData();
	}, [type, page, continueFlag]);
	return { data, lastPage, loading };
};

export const useTodaysShows = (
	setData: (data: AnimeDataArray | null) => void
) => {
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
	const dayIndex = today.getDay(); // Returns a number 0-6 representing Sunday-Saturday

	useEffect(() => {
		const fetchAnimeData = async () => {
			await fetch(
				`https://api.jikan.moe/v4/schedules?sfw=true&kids=false&page=1&filter=${Object.values(Days)[dayIndex]}`
			)
				.then((response) => response.json())
				.then((data) => {
					data.data = getUniqueObjects(data.data, "mal_id");
					setData(data);
				})
				.catch((error) => console.error("Error fetching anime details", error));
		};
		fetchAnimeData();
	}, []);
};

export const useTopTen = (type: number, filter: number) => {
	const [data, setData] = useState(null);
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
			setLoading(true);
			await fetch(
				`https://api.jikan.moe/v4/top/anime?limit=15&type=${Object.values(medium)[type]}&filter=${Object.values(period)[filter]}&sfw`
			)
				.then((response) => response.json())
				.then((data) => {
					data.data = getUniqueObjects(data.data, "mal_id");
					setData(data);
				})
				.catch((error) => console.error("Error fetching anime details", error))
				.finally(() => setLoading(false));
		};
		fetchAnimeData();
	}, []);

	return { data, loading };
};

export const useGetRecommendations = () => {
	const { id } = useParams<{ id: string }>();
	const [data, setData] = useState<AnimeRecommendationComparison | null>(null);	
	const [loading, setLoading] = useState(true);
	let fetchUrl = id 
		? `https://api.jikan.moe/v4/anime/${id}/recommendations/`
		: `https://api.jikan.moe/v4/recommendations/anime`;

	useEffect(() => {
		const fetchAnimeData = async () => {
			setLoading(true);
			await fetch(fetchUrl)
				.then((response) => response.json())
				.then((data) => {
					setData(data.data);
				})
				.catch((error) => console.error("Error fetching anime details", error))
				.finally(() => setLoading(false));
		};
		fetchAnimeData();
	}, []);
	return {data, loading};
};
