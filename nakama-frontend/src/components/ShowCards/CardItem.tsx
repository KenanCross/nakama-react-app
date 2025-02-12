import {FC} from "react";
import AnimeData from "../../models/anime";
import { Link } from "react-router-dom";

const CardItem: FC<AnimeData> = ({ mal_id, title, title_english, synopsis, images, score, rating }) => {
    const image = images["webp"].image_url;
	return (
		<>
			<div className='card card-side bg-base-100 shadow-sm'>
				<Link to={`/anime/${mal_id}`}></Link>
				<figure>
					<img src={image} alt={title_english ? title_english : title} />
				</figure>
				<div className='card-body w-[100%]'>
					<h2 className='card-title'>
						{title_english ? title_english : title}
					</h2>
					<p className='line-clamp-2 text-wrap text-sm'>{synopsis}</p>
					<div className='flex flex-row'>
						<div>Score: {score}</div>
						<div>{rating}</div>
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