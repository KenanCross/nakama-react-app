import React, { useState, useEffect } from "react";
import {AnimeDataArray} from "../models/anime";

export const getFilteredData = (type: string, continueFlag: boolean) => {
    const [data, setData] = useState<AnimeDataArray | null>(null);
    let ongoing = '';
    if(continueFlag ? ongoing = '&continuing' : '')
	useEffect(() => {
		const fetchAnimeData = async () => {
			await fetch(
				`https://api.jikan.moe/v4/seasons/now`
			)
				.then((response) => response.json())
				.then((data) => setData(data))
				.catch((error) => console.error("Error fetching anime details", error));
		};
		fetchAnimeData();
	}, []);
	console.log(data);
	return {data};
};

export const getCurrentSeason = () => {
    const [data, setData] = useState<AnimeDataArray | null>(null);
    useEffect(() => {
            const fetchAnimeData = async () => {
                await fetch(`https://api.jikan.moe/v4/seasons/now`)
                    .then((response) => response.json())
                    .then((data) => setData(data))
                    .catch((error) => console.error("Error fetching anime details", error));
            };
            fetchAnimeData();
    }, []);
    return data;
}
export const getTodaysShows = () => {
	const [data, setData] = useState<AnimeDataArray | null>(null);
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
				.then((data) => setData(data))
				.catch((error) => console.error("Error fetching anime details", error));
		};
		fetchAnimeData();
	}, []);
	return data;
}
