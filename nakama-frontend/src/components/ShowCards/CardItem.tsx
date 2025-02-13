import {FC} from "react";
import AnimeData from "../../models/anime";
import { Link } from "react-router-dom";

const CardItem: FC<AnimeData> = ({ mal_id, title, title_english, synopsis, images, score, rank, genres }) => {
    const image = images["webp"].image_url;
	return (
		<>
			<div className='embla__slide card card-side bg-base-100 shadow-sm'>
				<Link to={`/anime/${mal_id}`}></Link>
				<figure>
					<img src={image} alt={title_english ? title_english : title} />
				</figure>
				<div className='card-body w-[65%]'>
					<h2 className='card-title'>
						{title_english ? title_english : title}
					</h2>
					<p className='line-clamp-5 truncate text-wrap text-xs sm:text-sm'>
						{synopsis}
					</p>
					<div className='flex flex-row gap-2'>
						{genres?.map((genre, index) => (
							<div className='p-0.5 text-gray text-sm' key={index}>
								{genre.name}
							</div>
						))}
					</div>

					<div className='flex flex-row gap-1'>
						<div className='p-0.5 bg-yellow text-sm text-gray-dark'>
							Score: {score}
						</div>
						<div className='p-0.5 bg-green text-sm text-gray-dark'>
							{rank} OVR
						</div>
					</div>
					<div className='card-actions justify-end'>
						{/* <button className='btn btn-primary'>Watch</button> */}
					</div>
				</div>
			</div>
		</>
	);
};

export default CardItem