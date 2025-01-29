import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AnimeData from "../models/anime";
import AnimeDetails from "../components/animeDetails";

const Anime: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [anime, setAnime] = useState<AnimeData | null>(null);
	useEffect(() => {
		const fetchAnimeData = async () => {
			const data = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
			const json = await data.json();
			console.log(json.data)
			setAnime(json.data);
		};
		fetchAnimeData().catch((error) =>
			console.error("Error fetching anime details", error)
		);
	}, [id]);

	return (
		<>{anime ? <AnimeDetails {...anime!} /> : <p>Loading Requested Anime</p>}</>
	);
};

export default Anime;
