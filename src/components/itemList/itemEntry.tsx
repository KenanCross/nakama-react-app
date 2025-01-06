import {FC} from "react";
import { Link } from "react-router-dom";
import AnimeData from "../../models/anime";

const ItemEntry: FC<AnimeData> = ({mal_id,
	title,images}) => {
	return (
		<div className='itemContainer'>
			<Link to={`/anime:${mal_id}`}>
				<img src={images["webp"].small_image_url} title={title} />
				<div className='itemTitle'>{title}</div>
			</Link>
		</div>
	);
};

export default ItemEntry