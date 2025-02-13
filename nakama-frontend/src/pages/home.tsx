import React from "react";
import seasonFilter from "../components/seasonFilter/seasonFilter";
import airingToday from "../components/airingToday/airingToday";
import Top10 from "../components/top-ten/top-ten";
import RandomRecommendations from "../components/recommendations/RandomRecommendations";

const Home: React.FC = () => {
	return (
		<div className='container mx-auto'>
			<div className='mb-6'>{airingToday()}</div>
			<div className='flex flex-col gap-4 justify-center md:flex-row'>
				{Top10("airing tv")}
				{Top10("upcoming tv")}
			</div>
			<div>
				<RandomRecommendations />
			</div>
			<div>{seasonFilter()}</div>
		</div>
	);
};

export default Home;
