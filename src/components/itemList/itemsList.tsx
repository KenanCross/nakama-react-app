import React from "react";
import AnimeData from "../../models/anime";
import ItemEntry from "./itemEntry";

export interface AnimeDataArray {
    data: AnimeData[];
}

const itemsList: React.FC<AnimeDataArray> = ({data}) => {
    return (
			<div className='itemList'>
            {
                
					//.entries(animeList).map();
					data.map((data) => (
						<ItemEntry key={data.mal_id}
                            mal_id={data.mal_id}
                            title={data.title_english}
                            images={data.images}/>
					))
				}
			</div>
		);
}

export default itemsList;