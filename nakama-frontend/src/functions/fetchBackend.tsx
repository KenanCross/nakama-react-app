import { useEffect, useState } from "react";
import NewsData, { NewsFeedResponse } from "../models/news";

export const useGetUser = () => {
	const [user, setUser] = useState();
	useEffect(() => {
		fetch(``)
			.then((response) => response.json())
			.then((data) => setUser(data))
			.catch((error) => console.error("Error fetching user details", error));
	}, []);
	return user;
};

export const useGetReview = () => {
	const [review, setReview] = useState();
	useEffect(() => {
		fetch(`http://localhost:3000/api/reviews/allReviews`)
			.then((response) => response.json())
			.then((data) => setReview(data))
			.catch((error) => console.error("Error fetching review", error));
	}, []);
	return review;
};

export const useGetNews = () => {
	const [news, setNews] = useState<NewsData[]>([]);
	useEffect(() => {
		fetch(`http://localhost:3000/api/news`)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`News request failed with ${response.status}`);
				}
				return response.json() as Promise<NewsFeedResponse>;
			})
			.then((data) => setNews(Array.isArray(data.items) ? data.items : []))
			.catch((error) => console.error("Error fetching news", error));
	}, []);
	return news;
};
