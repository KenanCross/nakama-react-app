import React, { FC } from "react";
import { RecommendationEntry } from "../../models/anime";

interface RecommendationProps {
    data: RecommendationEntry[];
    loading: boolean;
}

const Recommendation: FC<RecommendationProps> = ({ data, loading }) => {
    if (loading) return <p>Loading recommendations...</p>;

    return (
        <div className="recommendations-grid">
            {data.map((entry, i) => {
                let orderClass = i > 0 ? "order-last" : "order-first";
                return (
                    <div key={entry.mal_id} className={orderClass}>
                        <img src={entry.images.webp.image_url} alt={entry.title} />
                    </div>
                );
            })}
        </div>
    );
};

export default Recommendation;
