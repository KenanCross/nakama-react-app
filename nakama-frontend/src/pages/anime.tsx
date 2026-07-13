import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AnimeData from "../models/anime";
import AnimeDetails from "../components/animeDetails";
import ErrorMessage from "../components/ErrorMessage";

const Anime: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [anime, setAnime] = useState<AnimeData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchAnimeData = async () => {
		setError(null);
		setLoading(true);
		try {
			const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
			if (!response.ok) throw new Error(`Request failed (${response.status})`);
			const json = await response.json();
			setAnime(json.data);
		} catch (err) {
			setError((err as Error).message ?? "Failed to load anime details.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAnimeData();
	}, [id]);

	if (loading) return <p className="p-8">Loading Requested Anime...</p>;
	if (error) return <ErrorMessage message={error} onRetry={fetchAnimeData} />;

	return <>{anime && <AnimeDetails {...anime} />}</>;
};

export default Anime;
