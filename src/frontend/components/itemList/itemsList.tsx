import React from "react";
import {AnimeDataArray} from "../../models/anime";
import ItemEntry from "./itemEntry";

const itemsList: React.FC<AnimeDataArray> = ({data}) => {
    return (
			<div className='flex flex-col gap-3 justify-center md:flex-row flex-wrap'>
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
}

export default itemsList;