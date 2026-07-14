import React, { FC } from "react";
import TopTenEntry from "./top-ten-entry";
import { AnimeDataArray } from "../../models/anime";

interface TopTenProps extends AnimeDataArray {
	showStats?: boolean;
}

const TopTen: FC<TopTenProps> = ({ data, showStats = true }) => {
	return (
		<div className="flex flex-col">
			{data.map((item, index) => (
				<TopTenEntry
					key={`${item.mal_id}-${index}`}
					mal_id={item.mal_id}
					title={item.title}
					title_english={item.title_english}
					images={item.images}
					index={index + 1}
					score={item.score}
					rank={item.rank}
					showStats={showStats}
				/>
			))}
		</div>
	);
};

export default TopTen;
