import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import  AnimeData  from "../models/anime";
import AnimeDetails from "../components/animeDetails";

const Anime: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [anime, setAnime] = useState<AnimeData | null>(null);
	useEffect(() => {
		fetch(`https://api.jikan.moe/v4/anime/${id}`)
			.then((response) => response.json())
			.then((data) => setAnime(data))
			.catch((error) => console.error("Error fetching anime details", error));
	}, [id]);
	return (
		<>
			<AnimeDetails {...anime!} />
		</>
	);
};

export default Anime;
