import React from "react";
import seasonFilter from "../components/seasonFilter/seasonFilter";
import airingToday from "../components/airingToday/airingToday";
import Top10 from "../components/top-ten/top-ten";
import RandomRecommendations from "../components/recommendations/RandomRecommendations";

const Home: React.FC = () => {
	return (
		<div className='container mx-auto'>
			<div className='mb-6'>{airingToday()}</div>
			<div className='w-full md:w-1/2'>{Top10("airing tv")}</div>
			<div>
				<RandomRecommendations />
			</div>
			<div>{seasonFilter()}</div>
		</div>
	);
};

export default Home;
