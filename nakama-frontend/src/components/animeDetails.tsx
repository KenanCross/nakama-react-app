import React from "react";
import AnimeData from "../models/anime";
import { useParams } from "react-router-dom";
import Recommendations from "./recommendations/Recommendations";
import FeedInput from "./Reviews/feedInput";

const AnimeDetails: React.FC<AnimeData> = ({
	title,
	title_english,
	title_japanese,
	images,
	episodes,
	type,
	source,
	synopsis,
	background,
	rank,
	rating,
	season,
}) => {
	const { id } = useParams<{ id: string }>();
	return (
		<>
			<div className='animeDetails'>
				<div className='titleContainer'>
					<img src={images["webp"].large_image_url} />
					<div className='animeMeta'>
						<h1>{title_english}</h1>
						<h3>
							JPN: {title_japanese} | {title}
						</h3>
						<div className='subMeta'>
							<div>{rank}</div><div></div>
						</div>
					</div>
				</div>
				<div>
					<p>{synopsis}</p>
				</div>
				<div>
				<Recommendations animeId={id} />
				</div>
				<div><FeedInput /></div>
			</div>
		</>
	);
};

export default AnimeDetails;
