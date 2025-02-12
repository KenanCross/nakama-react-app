import { FC } from "react";
import { AnimeDataArray } from "../../models/anime";
import CardItem from "./CardItem";

const ShowCards: FC<AnimeDataArray> = ({ data }) => {
	return (
		<div className="flex flex-row gap-2 flex-wrap">
            {
              data.map((data) => (
				<CardItem
					key={data.mal_id}
					mal_id={data.mal_id}
                      title={data.title_english}
                      synopsis={data.synopsis}
					images={data.images}
					rating={data.rating}
					score={data.score}
				/>
			))}
		</div>
	);
};

export default ShowCards;
