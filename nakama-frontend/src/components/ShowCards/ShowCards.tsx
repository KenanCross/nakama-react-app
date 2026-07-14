import { FC } from "react";
import { AnimeDataArray } from "../../models/anime";
import CardItem from "./CardItem";
import "./style/ShowCards.css"

const ShowCards: FC<AnimeDataArray> = ({ data }) => {
	return (
		<>
			{data.map((item, index) => (
				<CardItem
					key={`${item.mal_id}-${index}`}
					mal_id={item.mal_id}
					title={item.title}
					title_english={item.title_english}
					synopsis={item.synopsis}
					images={item.images}
					score={item.score}
					rank={item.rank}
					genres={item.genres}
				/>
			))}
		</>
	);
};

export default ShowCards;
