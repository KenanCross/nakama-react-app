import React, { useState, useEffect } from "react";
import itemsList from "../components/itemList/itemsList";
import itemFilter from "../components/itemFilter/itemFilter";
import { AnimeDataArray } from "../models/anime";

const Home: React.FC = () => {
	const [seasonFilter, setSeasonFilter] = useState("TV"); //Add Filtering Functionality to itemList/itemFilter component.
	const [continueFlag, setContinueFlag] = useState("");
	const getData = (season: string, continueFlag: string) => {
		const [data, setData] = useState<AnimeDataArray | null>(null);
		
		useEffect(() => {
			const fetchAnimeData = async () => {
				await fetch(
					`https://api.jikan.moe/v4/seasons/now?${season}${continueFlag}`
				)
					.then((response) => response.json())
					.then((data) => setData(data))
					.catch((error) =>
						console.error("Error fetching anime details", error)
					);
			};
			fetchAnimeData();
		}, []);
		console.log(data!.data)
		return data;
	};
	
	const handleSeasonClick = (filterText: string) => { 
		setSeasonFilter(filterText)
	};
	
	
	const season = getData(seasonFilter, continueFlag)

	return (
		<div className='container mx-auto'>
			<div className='mb-6'>
				<h4 className='mb-3'>Airing Today</h4>
				{/* {today ? itemFilter(today!) : <p>Loading Data...</p>} */}
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
				{season ? itemsList(season!) : <p>Loading Data...</p>}
			</div>
		</div>
	);
};

export default Home;
