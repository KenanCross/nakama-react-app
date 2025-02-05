import React, { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { RecommendationEntry} from "../../models/anime";

const Recommendation: FC<RecommendationEntry[]> = (data, loading) => {
	
	return (
		data.map((entry, i) => {
		let orderClass = i > 0 ? "order-last" : "order-first";
		<div className={orderClass}>
			<img src={entry.images["webp"].image_url} />
		</div>;
	});)
};
export default Recommendation