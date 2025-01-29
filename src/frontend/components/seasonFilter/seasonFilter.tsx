import { useState, useEffect } from "react";
import itemsList from "../itemList/itemsList";
import { useFilteredData } from "../../functions/fetchAnime";

const seasonFilter = () => {
	const [seasonFilter, setSeasonFilter] = useState(0); //Add Filtering Functionality to itemList/itemFilter component.
	const [continueFlag, setContinueFlag] = useState(false);
	const { data, loading } = useFilteredData(seasonFilter, continueFlag);


	const handleSeasonClick = (filter: number) => {
		setSeasonFilter(filter);
	};


	return (
		<div className='mb-6'>
			<h4 className='mb-3'>Anime Airing This Season</h4>
			<div>
				<button className='btn btn-ghost' onClick={() => handleSeasonClick(0)}>
					TV
				</button>
				<button className='btn btn-ghost' onClick={() => handleSeasonClick(2)}>
					ONA
				</button>
				<button className='btn btn-ghost' onClick={() => handleSeasonClick(1)}>
					MOVIE
				</button>
			</div>
			{loading ? <p>Loading Data...</p> : itemsList(data!)}
		</div>
	);
};

export default seasonFilter;
