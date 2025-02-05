import React, { FC } from "react";
import { AnimeRecommendationComparison, AnimeRecommendationProps } from "../../models/anime";

const Recommendation: FC<AnimeRecommendationComparison> = ( data ) => {
	console.log(data)
	return (
		<div className='flex flex-col'>
			<div className='flex flex-row'>
				<div>
					<img src='' />
				</div>
				<div></div>
				<div>
					<img src='' />
				</div>
			</div>
			<div></div>
		</div>
	);
};
export default Recommendation