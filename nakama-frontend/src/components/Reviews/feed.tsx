import {useState, useEffect} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Review from "../../models/review";
import { ReviewSlides } from "./feedItem";

interface ReviewFeedProps {
    updateReviews: boolean;
    setUpdateReviews: any
}

export const ReviewFeed = ({updateReviews, setUpdateReviews}: ReviewFeedProps) => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<Review[]>([]);
		const [loading, setLoading] = useState<boolean>(true);
		const [error, setError] = useState<string | null>(null);

		useEffect(() => {
			const fetchData = async () => {
				try {
					const response = await axios.get<Review[]>(
						`http://localhost:3000/api/reviews/${id}`
					);
					setData(response.data); // Limiting to first 5 results
				} catch (err) {
					setError((err as Error).message);
				} finally {
                    setLoading(false);
                    setUpdateReviews(false);
				}
			};

			fetchData();
		}, [updateReviews]);

    if (error) return <p>Error: {error}</p>;
    
    return (
			<div className='flex flex-row gap-2 md:gap-3 h-auto justify-center flex-wrap'>
				{loading ? (
					<span className='loading loading-bars loading-lg'></span>
				) : (
                    <ReviewSlides data={data!} />
				)}
			</div>
		);


}