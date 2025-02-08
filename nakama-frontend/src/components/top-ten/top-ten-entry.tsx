import { FC } from "react";
import { Link } from "react-router-dom";
import AnimeData from "../../models/anime";

const TopTenEntry: FC<AnimeData> = ({ mal_id, title, title_english, images, index}) => {
	const image = images["webp"].image_url;
	if (index! <= 10) {
		return (
			<Link to={`/anime/${mal_id}`}>
				<div className='flex flex-row mb-2 justify-between items-center'>
					<div className='w-10 text-4xl'>{index}</div>

					<h4 className='truncate text-sm font-medium text-gray-900 sm:text-base dark:text-gray-200'>
						{title_english ? title_english : title}
					</h4>
					<img
						className='self-end max-w-20 max-h-auto'
						src={image}
						title={title}
					/>
				</div>
			</Link>
		);
	}
	
};

export default TopTenEntry;
