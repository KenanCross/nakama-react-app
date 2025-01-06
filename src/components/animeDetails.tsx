import React from "react";
import  AnimeData  from "../models/anime";

const AnimeDetails: React.FC<AnimeData> = ({title, title_japanese, images, episodes, type, source, synopsis, background, rank, rating, season }) => {
    const imageURL:string = images["webp"].image_url
    return (
			<>
				<div className='animeDetails'>
					<div className='titleContainer'>
						<img src={imageURL} />
						<div className='animeMeta'>
							<h1>{title}</h1>
							<h3>{title_japanese}</h3>
							<div className='subMeta'></div>
						</div>
                    </div>
                    <div>
                    <p>{synopsis}</p>
                    </div>
				</div>
			</>
		);

}

export default AnimeDetails;