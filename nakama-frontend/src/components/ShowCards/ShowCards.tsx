import { FC } from "react";
import { AnimeDataArray } from "../../models/anime";
import CardItem from "./CardItem";
import "./style/ShowCards.css"

const ShowCards: FC<AnimeDataArray> = ({ data }) => {
	return (
		<>
			{data.map((data) => (
				<CardItem
					key={data.mal_id}
					mal_id={data.mal_id}
					title={data.title_english}
					synopsis={data.synopsis}
					images={data.images}
					score={data.score}
					rank={data.rank}
					genres={data.genres}
				/>
			))}
		</>
	);
};

export default ShowCards;
