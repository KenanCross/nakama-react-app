import React, { useState, useEffect, useRef } from "react";
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

const delay = 1000;

export const useFilteredData = (setData:  (data: AnimeDataArray | null) => void, type: number, continueFlag?: boolean) => {
    const lastExecuted = useRef(Date.now());
	let ongoing = continueFlag ? '&continuing' : ''
	
	
	enum filter {
		tv,
		movie,
		ona,
		ova,
		special
	}

	useEffect(() => {
		
		const fetchAnimeData = async () => {
			if (Date.now() - lastExecuted.current >= delay) {
				lastExecuted.current = Date.now();
				await fetch(
					`https://api.jikan.moe/v4/seasons/now?filter=${Object.values(filter)[type]}&${ongoing}`
				)
					.then((response) => response.json())
					.then((data) => setData(data))
					.catch((error) =>
						console.error("Error fetching anime details", error)
					);
			} else {
				setTimeout(async() => {
					lastExecuted.current = Date.now();
					await fetch(
						`https://api.jikan.moe/v4/seasons/now?filter=${Object.values(filter)[type]}&${ongoing}`
					)
						.then((response) => response.json())
						.then((data) => setData(data))
						.catch((error) =>
							console.error("Error fetching anime details", error)
						);

				}, delay)
			}
		};
		fetchAnimeData();
	}, []);
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
	}, []);
};
