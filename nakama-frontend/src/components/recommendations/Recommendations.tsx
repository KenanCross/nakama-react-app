import React, { FC, useEffect, useState } from "react";
import { useGetRecommendations } from "../../functions/fetchAnime";
import { AnimeRecommendationComparison, RecommendationEntry } from "../../models/anime";
import Recommendation from "./Recommendation";

interface ReccomendationsProps {
  animeId: string;
}

const Reccomendations: FC<ReccomendationsProps> = ({ animeId }) => {
  const { data, loading, error } = useGetRecommendations(animeId);
  const [recData, setRecData] = useState<RecommendationEntry[] | null>(null);

  const random = (data: AnimeRecommendationComparison[]) =>
    data.length > 0 ? data[Math.floor(Math.random() * data.length)] : null;

  useEffect(() => {
    if (!loading && data && data.length > 0) {
      const recommendation = random(data);
      if (recommendation) setRecData(recommendation.entry);
    }
  }, [loading, data]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      {loading ? (
        <p>Loading recommendations...</p>
      ) : recData ? (
        <div className="flex flex-col">
          <div className="flex flex-row">
            <Recommendation data={recData} loading={loading} />
          </div>
        </div>
      ) : (
        <p>No recommendations available.</p>
      )}
    </>
  );
};

export default Reccomendations;
