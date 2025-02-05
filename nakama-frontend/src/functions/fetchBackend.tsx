import React, { useState, useEffect } from "react";
import User from "../models/user";
import Review from "../models/review";

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

export const useGetReview = (userId: string) => {
	const [review, setReview] = useState();
	useEffect(() => {
		fetch(`fetchURL:${userId}`)
			.then((response) => response.json())
			.then((data) => setReview(data))
			.catch((error) => console.error("Error fetching review", error));
	}, []);
	return review;
};