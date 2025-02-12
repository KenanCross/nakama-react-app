import React, { FC, useEffect, useState } from "react";
import { useGetRecommendations } from "../../functions/fetchAnime";
import {
	AnimeRecommendationComparison,
	RecommendationEntry,
} from "../../models/anime";
import Recommendation from "./Recommendation";

const RandomRecommendations: FC = () => {
	const { data, loading, error } = useGetRecommendations();
    const [recData, setRecData] =
			useState<AnimeRecommendationComparison | null>(null);
    const [entries, setEntries] = useState<RecommendationEntry[] | null>(null);

	const random = (data: AnimeRecommendationComparison[]) =>
		data.length > 0 ? data[Math.floor(Math.random() * data.length)] : null;

	useEffect(() => {
		if (!loading && data && data.length > 0) {
            const recommendation = random(data);
            // console.log(recommendation)
            if (recommendation) { setRecData(recommendation); setEntries(recommendation.entry); }
		}
	}, [loading, data]);

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<>
			{loading ? (
				<span className='loading loading-bars loading-lg'></span>
			) : recData ? (
				<div className='flex flex-col gap-10 p-4 my-20 mx-auto'>
					<div className='flex flex-row w-full grow'>
						<Recommendation
							data={entries}
							loading={loading}
							user={recData.user.username}
						/>
					</div>
					<div>
						<p className='mb-3 uppercase'>{recData.user.username} Says:</p>
						<p className='text-lg/7 ml-5'>"{recData.content}"</p>
					</div>
				</div>
			) : (
				<p>No recommendations available.</p>
			)}
		</>
	);
};

export default RandomRecommendations;
