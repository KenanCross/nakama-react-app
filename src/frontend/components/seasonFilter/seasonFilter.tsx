import { FC, useState, useEffect } from "react";
import itemsList from "../itemList/itemsList";
import { getFilteredData } from "../../functions/fetchAnime";

const seasonFilter = () => {
	const [seasonFilter, setSeasonFilter] = useState(0); //Add Filtering Functionality to itemList/itemFilter component.
	const [continueFlag, setContinueFlag] = useState(false);
	const [seasonData, setSeasonData] = useState(null);
	const [loading, setLoading] = useState(true);

	enum filter {
		tv,
		movie,
		ona,
		ova,
		special,
	}

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			await fetch(
				`https://api.jikan.moe/v4/seasons/now?filter=${Object.values(filter)[seasonFilter]}&continuing`
			)
				.then((response) => response.json())
				.then((data) => setSeasonData(data))
				.then(() => setLoading(false))
				.catch((error) => console.error("Error fetching anime details", error));
		}
		fetchData();
	}, [seasonFilter]);

	const handleSeasonClick = (filter: number) => {
		setSeasonFilter(filter);
	};

	return (
		<div className='mb-6'>
			<h4 className='mb-3'>Anime Airing This Season</h4>
			<div>
				<button className='btn btn-ghost' onClick={() => handleSeasonClick(1)}>
					TV
				</button>
				<button className='btn btn-ghost' onClick={() => handleSeasonClick(3)}>
					ONA
				</button>
				<button className='btn btn-ghost' onClick={() => handleSeasonClick(2)}>
					MOVIE
				</button>
			</div>
			{loading ? <p>Loading Data...</p> : itemsList(seasonData!)}
		</div>
	);
};

export default seasonFilter;
