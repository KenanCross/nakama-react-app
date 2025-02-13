import React from "react";
import {AnimeDataArray} from "../../models/anime";
import ItemEntry from "./itemEntry";

const itemsList: React.FC<AnimeDataArray> = ({data}) => {
    return (
			<>
				{
					//.entries(animeList).map();
				data.map((data) => (
						<ItemEntry
							key={data.mal_id}
							mal_id={data.mal_id}
						title_english={data.title_english}
						title = {data.title}
							images={data.images}
						/>
					))
				}
			</>
		);
}

export default itemsList;