import React, { FC } from "react";
import { Link } from "react-router-dom";
import { RecommendationEntry } from "../../models/anime";

interface RecommendationProps {
	data: RecommendationEntry[];
	loading: boolean;
	user?: string;
}

const Recommendation: FC<RecommendationProps> = ({ data, loading, user }) => {
	if (loading) return <span className='loading loading-bars loading-lg'></span>; 
    return (
			<div className='flex flex-row gap-5 w-full'>
				{user
					? data.map((entry, i) => {
							let orderClass =
								i > 0 ? "order-last flex flex-row justify-between w-1/2" : "order-first flex flex-row justify-between w-1/2";
							let orderText = i > 0 ? `Then you might like...` : "If You Liked...";
							return (
								<div key={entry.mal_id} className={orderClass}>
									<div className='grow w-[50%]'>
										<p>{orderText}</p>
										<h5 className='text-2xl'>{entry.title}</h5>
									</div>
									<Link to={`/anime/${entry.mal_id}`}>
									<img src={entry.images.webp.image_url} alt={entry.title} />
									</Link>
								</div>
							);
						})
				: data.map((entry, i) => {
							if(i < 5)
							return (
								<div
									key={entry.mal_id}
									className='border border-gray-500 outline-offset-4 rounded-t-lg flex-1'>
									<Link to={`/anime/${entry.mal_id}`}>
										<img
											className='rounded-t-lg'
											src={entry.images.webp.image_url}
											alt={entry.title}
										/>
									</Link>
									<h5 className='w-4/5 py-2 m-auto text-sm text-center'>{entry.title}</h5>
								</div>
							);
						})}
			</div>
		);
};

export default Recommendation;
