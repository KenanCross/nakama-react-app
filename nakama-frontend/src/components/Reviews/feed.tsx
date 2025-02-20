import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Review from "../../models/review";
import { ReviewSlides } from "./feedItem";

interface ReviewFeedProps {
	updateReviews: boolean;
	setUpdateReviews: any;
}

export const ReviewFeed = ({
	updateReviews,
	setUpdateReviews,
}: ReviewFeedProps) => {
	const { id } = useParams<{ id: string }>();
	const [data, setData] = useState<Review[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				const response = await axios.get<Review[]>(
					`http://localhost:3000/api/reviews/${id}`
				);
				if(response.data.length !== 0) setData(response.data); // Limiting to first 5 results
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setUpdateReviews(false);
				setLoading(false);
			}
		};

		fetchData();
	}, [updateReviews, id]);

	if (error) return <h4>Be The First To Add A Review!</h4>;

	return (
		<div className='flex flex-row gap-2 md:gap-3 h-auto justify-center flex-wrap'>
			{loading ? (
				<span className='loading loading-bars loading-lg'></span>
			) : (
				<ReviewSlides data={data!} />
			)}
		</div>
	);
};
