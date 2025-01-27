import React, { useState, useEffect } from "react";
import { AnimeDataArray } from "../models/anime";

const RATE_LIMIT = {
	perSecond: 3,
	perMinute: 60,
};

let requestCount = {
	second: 0,
	minute: 0,
};

setInterval(() => {
	requestCount.second = 0;
}, 1000);

setInterval(() => {
	requestCount.minute = 0;
}, 60000);

export const getFilteredData = (type: number, continueFlag: boolean) => {
    const [data, setData] = useState<AnimeDataArray | null>(null);
    let ongoing = '';
	continueFlag ? ongoing = '&continuing' : ''

	enum filter {
		tv,
		movie,
		ona,
		ova,
		special
	}

	useEffect(() => {
		const fetchAnimeData = async () => {
			if (requestCount.second >= RATE_LIMIT.perSecond) {
				return console.log("Rate limit exceeded (3 requests per second).");
			}

			if (requestCount.minute >= RATE_LIMIT.perMinute) {
				return console.log("Rate limit exceeded (60 requests per minute).");
			}

			requestCount.second++;
			requestCount.minute++;

			await fetch(`https://api.jikan.moe/v4/seasons/now?filter=${Object.values(filter)[type]}&continuing`)
				.then((response) => response.json())
				.then((data) => setData(data))
				.catch((error) => console.error("Error fetching anime details", error));
		};
		fetchAnimeData();
	}, [data]);
	return data;
};

export const getCurrentSeason = () => {
    const [data, setData] = useState<AnimeDataArray | null>(null);
    useEffect(() => {
		const fetchAnimeData = async () => {
				if (requestCount.second >= RATE_LIMIT.perSecond) {
					return console.log("Rate limit exceeded (3 requests per second).");
				}

				if (requestCount.minute >= RATE_LIMIT.perMinute) {
					return console.log("Rate limit exceeded (60 requests per minute).");
				}

				requestCount.second++;
				requestCount.minute++;

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
    const dayIndex = today.getDay(); // Returns a number 0-6 representing Sunday-Saturday
    
	useEffect(() => {
		const fetchAnimeData = async () => {
			if (requestCount.second >= RATE_LIMIT.perSecond) {
				return console.log("Rate limit exceeded (3 requests per second).");
			}

			if (requestCount.minute >= RATE_LIMIT.perMinute) {
				return console.log("Rate limit exceeded (60 requests per minute).");
			}

			requestCount.second++;
			requestCount.minute++;
			await fetch(
				`https://api.jikan.moe/v4/schedules?sfw=true&kids=false&page=1&filter=${Object.values(Days)[dayIndex]}`
			)
				.then((response) => response.json())
				.then((data) => setData(data))
				.catch((error) => console.error("Error fetching anime details", error));
		};
		fetchAnimeData();
	}, [loading]);
	return data;
}
