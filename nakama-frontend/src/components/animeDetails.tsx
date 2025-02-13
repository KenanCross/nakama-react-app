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
	genres,
	episodes,
	type,
	source,
	year,
	synopsis,
	background,
	rank,
	rating,
	season,
	broadcast,
	aired,
	status
}) => {
	const { id } = useParams<{ id: string }>();
	let statusClass;
	let airInfo;
	switch (status) {
		case "Currently Airing":
			statusClass = "bg-green text-neutral-800";
			airInfo = season + ' ' +  year
			break;
		case "Finished Airing":
			statusClass = "bg-gray text-neutral-800";
			airInfo = 'Airdate: ' + aired?.string
			break;
		case "Not yet aired":
			statusClass = "bg-blue text-neutral-800";
			airInfo = "Tentatively Scheduled " + aired?.string.slice(0,4)
			break;
	}
	return (
		<>
			<div className='animeDetails container flex flex-col mx-auto w-[70vw] max-w-[1440px] min-h-[100vh] bg-neutral-900 p-8'>
				<div className='titleContainer flex flex-row gap-5'>
					<div className='basis-1/4 relative inline-block'>
						<img className='w-full' src={images["webp"].large_image_url} />
						<div
							className={`absolute top-0 right-0 text-xs font-semibold uppercase p-2 ${statusClass}`}>
							{status}
						</div>
					</div>
					<div className='animeMeta basis-3/4 flex flex-col gap-2'>
						<h1 className='text-4xl font-bold font-oswald'>
							{title_english ? title_english : title}
						</h1>
						<h3 className='text-lg font-semibold'>
							JPN: {title} | {title_japanese}
						</h3>
						<div className='flex flex-row gap-2'>
							{genres?.map((genre, index) => (
								<div className='p-0.5 uppercase' key={index}>
									{genre.name}
								</div>
							))}
						</div>
						<div className='' id='information'>
							<div className='uppercase text-xl'>{airInfo}</div>
						</div>
						<div className='subMeta'>
							<div>Rank: {rank} OVR</div>
							<div></div>
						</div>
						<div>
							<p>{synopsis}</p>
						</div>
					</div>
				</div>

				<div>
					<Recommendations animeId={id} />
				</div>
				<div>
					<FeedInput />
				</div>
			</div>
		</>
	);
};

export default AnimeDetails;
