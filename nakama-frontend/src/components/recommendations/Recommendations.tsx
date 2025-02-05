import { FC, useEffect, useState } from "react"
import { useGetRecommendations } from "../../functions/fetchAnime"
import { AnimeRecommendationComparison } from "../../models/anime";
import Recommendation from "./Recommendation";


export const CompareRecommendations = () => {
    const { data, loading } = useGetRecommendations();
    const [recData, setRecData] = useState({})
    let recommendation = {};
    const random = function (data: any) {
			return data[Math.floor(Math.random() * data.length)];
		};
	useEffect(() => {
		// Code to run only once after the initial render
        console.log("Component mounted");
        recommendation = loading ? "" : random(data!);
        console.log(recommendation);
		setRecData(recommendation);

		// Optional: Cleanup function (runs on unmount)
		return () => {
			console.log("Component unmounted");
		};
	}, [loading]); // Empty dependency array ensures the effect runs only once
	

    return (
        <>
        {
                loading ? '' :
                    (
                       Recommendation(recommendation!) 
                    )
            
        }
		
			
		</>
	);
}