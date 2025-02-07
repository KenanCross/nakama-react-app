import React from "react";
import seasonFilter from "../components/seasonFilter/seasonFilter";
import airingToday from "../components/airingToday/airingToday";
import Top10 from "../components/top-ten/top-ten";
import Reccomendations from "../components/recommendations/Recommendations";


const Home: React.FC = () => {
	return (
	  <div className="container mx-auto">
		<div className="mb-6">
		  <h4 className="mb-3">Airing Today</h4>
		  {airingToday()}
		</div>
		<div className="w-1/2">
		  {Top10("airing tv")}
		</div>
		<div>
		  {/* Pass a valid anime ID here (replace "1" with a real ID if needed) */}
		  <Reccomendations animeId="1" />
		</div>
		<div>
		  {seasonFilter()}
		</div>
	  </div>
	);
  };
  
  export default Home;