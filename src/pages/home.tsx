import React, { useState, useEffect } from "react";
import itemsList from "../components/itemList/itemsList";
import itemFilter from "../components/itemFilter/itemFilter";
import { getFilteredData } from "../functions/fetchAnime";
import { getCurrentSeason } from "../functions/fetchAnime";
import { getTodaysShows } from "../functions/fetchAnime";

const Home: React.FC = () => {
	const [seasonFilter, setSeasonFilter] = useState("TV"); //Add Filtering Functionality to itemList/itemFilter component.
	const [continueFlag, setContinueFlag] = useState(false);
	
	const handleSeasonClick = (filterText: string) => { 
		setSeasonFilter(filterText)
	};
	
	const season = getCurrentSeason()
	const today = getTodaysShows()

	return (
		<div className='container mx-auto'>
			<div className='mb-6'>
				<h4 className='mb-3'>Airing Today</h4>
				{today ? itemFilter(today!) : <p>Loading Data...</p>}
			</div>

			<div className='mb-6'>
				<h4 className='mb-3'>Anime Airing This Season</h4>
				<div>
					<button className='btn-ghost' onClick={() => handleSeasonClick("TV")}>
						TV
					</button>
					<button onClick={() => handleSeasonClick("ONA")}>ONA</button>
					<button onClick={() => handleSeasonClick("MOVIE")}>MOVIE</button>
				</div>
				{/* {season ? itemsList(season!) : <p>Loading Data...</p>} */}
			</div>
		</div>
	);
};

export default Home;
