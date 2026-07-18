import React, { useState, useEffect } from "react";
import SeasonFilter from "../components/seasonFilter/seasonFilter";
import AiringToday from "../components/airingToday/airingToday";
import Top10 from "../components/top-ten/top-ten";
import RandomRecommendations from "../components/recommendations/RandomRecommendations";
import GetAllReviews from "../components/Reviews/feedAll";
import NewsFeed from "../components/newsFeed/feed";

const Home: React.FC = () => {
	const [airingReady, setAiringReady] = useState(false);
	const [top10Ready, setTop10Ready] = useState(false);
	const [restReady, setRestReady] = useState(false);

	// Give Jikan a 1 second breather after the Top10 fetches
	// before firing Recommendations — prevents 429 rate limit hits.
	useEffect(() => {
		if (top10Ready) {
			const timer = setTimeout(() => setRestReady(true), 1000);
			return () => clearTimeout(timer);
		}
	}, [top10Ready]);

	return (
		<div className='container mx-auto'>
			<div className='mb-6'>
				<AiringToday onLoaded={() => setAiringReady(true)} />
			</div>

			{airingReady && (
				<div className='flex flex-col gap-4 justify-center md:flex-row'>
					<Top10 type="airing tv" onLoaded={() => setTop10Ready(true)} showStats={true} />
					{top10Ready && <Top10 type="upcoming tv" showStats={false} />}
				</div>
			)}

			{restReady && (
				<>
					<div>
						<RandomRecommendations />
					</div>
					<div>
						<NewsFeed />
					</div>
					<div>
						<GetAllReviews />
					</div>
					{/* <div>
						<SeasonFilter />
					</div> */}
				</>
			)}
		</div>
	);
};

export default Home;
