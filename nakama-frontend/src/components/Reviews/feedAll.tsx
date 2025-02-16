import { useState, useEffect } from "react";
import axios from "axios";
import Review from "../../models/review";
import { ReviewSlides } from "./feedItem";

const GetAllReviews = () => {
	const [data, setData] = useState<Review[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
			try {
				const response = await axios.get<Review[]>(
					`http://localhost:3000/api/reviews/`
				);
				setData(response.data); // Limiting to first 5 results
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (error) return <h4>{error}</h4>;

	return (
		<div className='flex flex-row gap-2 md:gap-3 h-auto justify-center flex-wrap'>
			{loading ? (
				<span className='loading loading-bars loading-lg'></span>
			) : (
				<ReviewSlides data={data!} usePicture={true} />
			)}
		</div>
	);
};

export default GetAllReviews;
