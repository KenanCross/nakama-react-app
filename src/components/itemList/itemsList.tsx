import React from "react";
import AnimeData from "../../models/anime";
import ItemEntry from "./itemEntry";

export interface AnimeDataArray {
    data: AnimeData[];
}

const itemsList: React.FC<AnimeDataArray> = ({data}) => {
    
    // const image_url = images["webp"].image_url;

    return (
			<div className='itemList'>
				{
					//.entries(animeList).map();
					data.map((data) => (
						<ItemEntry
                            mal_id={data.mal_id}
                            title={data.title}
                            images={data.images} title_japanese={""} trailer={{
                                youtube_id: "",
                                url: "",
                                embed_url: "",
                                images: {
                                    image_url: "",
                                    small_image_url: "",
                                    medium_image_url: "",
                                    large_image_url: "",
                                    maximum_image_url: ""
                                }
                            }} episodes={0} type={""} source={""} synopsis={""} background={""} rating={0} rank={0} season={""}						/>
					))
				}
			</div>
		);
}

export default itemsList;