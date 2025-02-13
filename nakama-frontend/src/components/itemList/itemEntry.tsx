import {FC} from "react";
import { Link } from "react-router-dom";
import AnimeData from "../../models/anime";
import './style/item.css'

const ItemEntry: FC<AnimeData> = ({mal_id,
	title, title_english, images }) => {
	const image = images["webp"].image_url
	return (
		<div className='box-border sm:flex-[0_1_49%] md:basis-60 shrink-1 filter-item'>
			<Link to={`/anime/${mal_id}`}>
				<img src={image} title={title_english ? title_english : title} />
			</Link>
			<div className='p-2 text-xs md:text-sm font-opensans font-medium uppercase'>
				<p>{title_english ? title_english : title}</p>
			</div>
		</div>
	);
};

export default ItemEntry