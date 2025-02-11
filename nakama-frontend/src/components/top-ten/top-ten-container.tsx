import React, { FC, useState } from "react";
import { getUniqueObjects } from "../../functions/fetchAnime";
import TopTenEntry from "./top-ten-entry";
import { AnimeDataArray } from "../../models/anime";

const TopTen: FC<AnimeDataArray> = ({ data }) => {

    return (
			<div className="flex flex-col">
            {data.map((data, index) => (
					<TopTenEntry
						key={data.mal_id}
						mal_id={data.mal_id}
						title={data.title_english}
                    images={data.images}
					index={index + 1}
					score={data.score}
					rank={data.rank}
					/>
				))}
			</div>
		);
}

export default TopTen