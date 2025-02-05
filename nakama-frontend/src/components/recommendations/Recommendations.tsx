import { FC, useEffect, useState } from "react";
import { useGetRecommendations } from "../../functions/fetchAnime";
import {
	AnimeRecommendationComparison,
	RecommendationEntry,
} from "../../models/anime";
import Recommendation from "./Recommendation";

export const CompareRecommendations = () => {
	const { data, loading } = useGetRecommendations();
	const [recData, setRecData] = useState<RecommendationEntry[] | null>(null);
	let recommendation: AnimeRecommendationComparison = {};
	const random = function (data: any) {
		return data[Math.floor(Math.random() * data.length)];
	};
	const entries = (data: RecommendationEntry[]) => {
		return data.map((entry, i) => {
			let orderClass = i > 0 ? "order-last" : "order-first";
			<div className={orderClass}>
				<img src={entry.images["webp"].image_url} />
			</div>;
		});
	};
	useEffect(() => {
		// Code to run only once after the initial render
		console.log("Component mounted");
		recommendation = loading ? "" : random(data!);
		console.log(recommendation);
		setRecData(recommendation.entry);
		// Optional: Cleanup function (runs on unmount)
		return () => {
			console.log("Component unmounted");
		};
	}, [loading]); // Empty dependency array ensures the effect runs only once
	console.log();

	return (
		<>
			{loading ? (
				""
			) : (
				<div className='flex flex-col'>
					<div className='flex flex-row'>
						{entries(recData!)}
						<div className=''></div>
					</div>
					<div></div>
				</div>
			)}
		</>
	);
};
