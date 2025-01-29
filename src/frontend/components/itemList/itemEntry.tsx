import {FC} from "react";
import { Link } from "react-router-dom";
import AnimeData from "../../models/anime";

const ItemEntry: FC<AnimeData> = ({mal_id,
	title, images }) => {
	const image = images["webp"].image_url
	return (
		<div className='box-border flex: calc(1/5 * 100%) shrink'>
			<Link to={`/anime/${mal_id}`}>
				<img src={image} title={title} />
				{/* <div className='p-2 text-sm uppercase'><p>{title}</p></div> */}
			</Link>
		</div>
	);
};

export default ItemEntry