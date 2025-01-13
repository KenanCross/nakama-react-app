import { FC, useEffect, useState } from "react";
import { AnimeDataArray } from "../../models/anime";
import ItemEntry from "../itemList/itemEntry";

const itemFilter: FC<AnimeDataArray> = ({}) => {
	const [data, setData] = useState<AnimeDataArray | null>(null);
	useEffect(() => {
		const fetchAnimeData = async () => {
			await fetch(`https://api.jikan.moe/v4/seasons/now`)
				.then((response) => response.json())
				.then((data) => setData(data))
				.catch((error) => console.error("Error fetching anime details", error));
		};
		fetchAnimeData();
	}, []);

	const today = new Date();
	const dayIndex = today.getDay(); // Returns a number 0-6 representing Sunday-Saturday

	const daysOfWeek = [
		"Sundays",
		"Mondays",
		"Tuesdays",
		"Wednesdays",
		"Thursdays",
		"Fridays",
		"Saturdays",
	];
	const dayName = daysOfWeek[dayIndex];
	// handleFilter(dayName);
	const filteredShows = data.filter(
		(shows) => shows!.broadcast!.day! === dayName
	);
	// console.log(filteredShows);
	return (
		<div className='flex flex-col justify-evenly gap-1 md:flex-row'>
			{
				//.entries(animeList).map();
				filteredShows.map((data) => (
					<ItemEntry
						key={data.mal_id}
						mal_id={data.mal_id}
						title={data.title_english}
						images={data.images}
					/>
				))
			}
		</div>
	);
};
export default itemFilter;
