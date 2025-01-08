import React, { useState, useEffect } from "react";
import itemsList from "../components/itemList/itemsList";
import { AnimeDataArray } from "../components/itemList/itemsList";

const Home: React.FC = () => {
	const [data, setData] = useState<AnimeDataArray | null>(null);
	useEffect(() => {
		const fetchAnimeData = async () => {
			await fetch(`https://api.jikan.moe/v4/seasons/now`)
				.then((response) => response.json())
				.then((data)=>setData(data))
				.catch((error) => console.error("Error fetching anime details", error));
		}
		fetchAnimeData();
		
	}, []);
	return (
		<div>
			<h1>Anime List</h1>
			{data ?(
				itemsList(data!)
			) : (
					<p>Loading Data...</p>
			)
			}
		</div>
	);
};

export default Home;
