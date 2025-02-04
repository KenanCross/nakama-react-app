import { FC, useEffect, useState } from "react";
import { AnimeDataArray } from "../../models/anime";
import ItemEntry from "../itemList/itemEntry";

const itemFilter: FC<AnimeDataArray> = ({data}) => {
	return (
		<div className='flex flex-col justify-evenly gap-1 md:flex-row'>
			{
				//.entries(animeList).map();
				data.map((data) => (
					<ItemEntry
						key={data.mal_id}
						mal_id={data.mal_id}
						title={data.title_english}
						images={data.images}
					/>
				))
			}
		</div>
	);
};
export default itemFilter;
