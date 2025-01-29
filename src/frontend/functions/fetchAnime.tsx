import { useState, useEffect } from "react";
import { AnimeDataArray } from "../models/anime";

export const useFilteredData = (type: number, continueFlag?: boolean, page?: number) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [lastPage, setLastPage] = useState(null);
	let ongoing = continueFlag ? '&continuing' : '';
	let pageRef = page ? `&page=${page}` : ''
	
	enum filter {
		tv,
		movie,
		ona,
		ova,
		special
	}

	useEffect(() => {		
		const fetchAnimeData = async () => {
			console.log("request Season shows");
			setLoading(true)
			await fetch(
				`https://api.jikan.moe/v4/seasons/now?filter=${Object.values(filter)[type]}${ongoing}${pageRef}&sfw`
			)
				.then((response) => response.json())
				.then((data) => { setData(data);  setLastPage(data.pagination.has_next_page)})
				.catch((error) => console.error("Error fetching anime details", error))
				.finally(() => setLoading(false));
		};
		fetchAnimeData();
	}, [type, page, continueFlag]);
	return {data, lastPage, loading}
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
	const dayIndex = today.getDay(); // Returns a number 0-6 representing Sunday-Saturday

	useEffect(() => {
		console.log('request Today shows')
		const fetchAnimeData = async () => {
			await fetch(
				`https://api.jikan.moe/v4/schedules?sfw=true&kids=false&page=1&filter=${Object.values(Days)[dayIndex]}`
			)
				.then((response) => response.json())
				.then((data) => setData(data))
				.catch((error) => console.error("Error fetching anime details", error));
		};
		fetchAnimeData();
	}, []);
};
