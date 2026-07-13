import React from "react";
import SeasonFilter from "../components/seasonFilter/seasonFilter";
import AiringToday from "../components/airingToday/airingToday";
import Top10 from "../components/top-ten/top-ten";
import RandomRecommendations from "../components/recommendations/RandomRecommendations";
import GetAllReviews from "../components/Reviews/feedAll";

const Home: React.FC = () => {
	return (
		<div className='container mx-auto'>
			<div className='mb-6'>
				<AiringToday />
			</div>
			<div className='flex flex-col gap-4 justify-center md:flex-row'>
				<Top10 type="airing tv" />
				<Top10 type="upcoming tv" />
			</div>
			<div>
				<RandomRecommendations />
			</div>
			<div>
				<GetAllReviews />
			</div>
			<div>
				<SeasonFilter />
			</div>
		</div>
	);
};

export default Home;
