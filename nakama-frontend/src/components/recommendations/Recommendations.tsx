import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetRecommendations } from "../../functions/fetchAnime";
import { AnimeRecommendationComparison, RecommendationEntry } from "../../models/anime";
import Recommendation from "./Recommendation";

const Recommendations = () => {  
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useGetRecommendations(id);
  const [recData, setRecData] = useState<RecommendationEntry[] | null>(null);
  
  useEffect(() => {
    if (!loading && data && data.length > 0) {
      const extractedElements = data.map((item) => item.entry[0]);
      setRecData(extractedElements)
      
    }
  }, [loading, data]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
		<>
			{loading ? (
				<span className='loading loading-bars loading-lg'></span>
			) : recData ? (
				<div className='flex flex-col my-20'>
					<h3 className='text-2xl w-full mb-5 pb-3 mx-auto border-b border-solid border-gray'>
						Similar Titles
					</h3>
					<div className='flex flex-row gap-10 w-full mx-auto'>
						<Recommendation data={recData} loading={loading} />
					</div>
				</div>
			) : (
				<h3>No recommendations available.</h3>
			)}
		</>
	);
};

export default Recommendations;
