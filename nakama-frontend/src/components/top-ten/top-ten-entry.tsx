import { FC } from "react";
import { Link } from "react-router-dom";
import { StarIcon, TrophyIcon } from "@heroicons/react/20/solid";
import AnimeData from "../../models/anime";
import './style/top-ten.css'

interface TopTenEntryProps extends AnimeData {
	showStats?: boolean;
}

const TopTenEntry: FC<TopTenEntryProps> = ({ mal_id, title, title_english, images, index, score, rank, showStats = true }) => {
	const image = images?.["webp"]?.image_url;

	return (
		<Link
			className='flex flex-row mb-1 rounded-lg item'
			to={`/anime/${mal_id}`}>
			<div className='flex flex-row flex-nowrap rounded-lg align-middle overflow-hidden truncate'>
				<div
					className={`w-14 text-4xl text-center rounded-l-lg flex-shrink-0 flex flex-col justify-center rank${index}`}>
					<h6 className='rank font-londrina'>{index}</h6>
				</div>
				<div className='w-14 flex-shrink-0 overflow-hidden'>
					<img className='self-end h-auto' src={image} title={title} alt={title} />
				</div>
				<div className='px-3 flex flex-col flex-shrink-0 justify-center'>
					<h4 className='text-ellipsis overflow-hidden font-oswald text-xs md:text-sm font-medium text-[#fff] sm:text-base'>
						{title_english ? title_english : title}
					</h4>
					{showStats && (
						<div className='flex flex-row flex-nowrap align-middle mt-1 text-yellow'>
							<h6 className='flex flex-row text-xs'>
								<StarIcon className='size-3 my-auto mr-1' />
								<span>{score ?? 'n/a'}</span>&nbsp; &#x2022; &nbsp;
								<TrophyIcon className='size-3 my-auto mr-1' />
								{rank ? `${rank} OVR` : 'unranked'}
							</h6>
						</div>
					)}
				</div>
			</div>
		</Link>
	);
};

export default TopTenEntry;
