import React, { useState, useEffect } from "react";
import itemsList from "../components/itemList/itemsList";
import { AnimeDataArray } from "../components/itemList/itemsList";

const Home: React.FC = () => {
	const [data, setData] = useState<AnimeDataArray | null >(null);
	useEffect(() => {
		fetch(`https://api.jikan.moe/v4/anime/seasons/now`)
			.then((response) => response.json())
			.then((data) => setData(data))
			.catch((error) => console.error("Error fetching anime details", error));
	});
	return (
		<>
			<h1>Anime List</h1>
            {
                itemsList(data!)
            }
		</>
	);
};

export default Home;
