import { useEffect, useState } from "react";
import axios from "axios";
import Review from "../../models/review";

// Define the expected structure of the API response
// interface Post {
//   id: number;
//   title: string;
//   body: string;
// }

const DataFetcher: React.FC = () => {
	const [data, setData] = useState<Review[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get<Review[]>(
					"http://localhost:3000/api/reviews/allReviews"
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

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	return (
		<div>
			<h3 className='text-2xl w-full mb-5 pb-3 mx-auto border-b border-solid border-gray'>
				Reviews
			</h3>
			<div className='flex flex-row flex-wrap gap-2 '>
				{data.map((review) => (
					<div
						className='card card-side bg-base-100 shadow-sm'
						key={review._id}>
						<figure>
							<img src={review.entry.imageUrl ? review.entry.imageUrl : ''} alt={review.entry.title} />
						</figure>
						<div className='card-body w-[65%]'>
							<p>{review.review}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default DataFetcher;

// export default function ReviewTextArea({ fetchReviewText }: ReviewTextAreaProps) {
//   const [reviewText, setReviewText] = useState("Loading review...");
//   const [error, setError] = useState(false);

// useEffect(() => {
//   fetchReviewText()
//     .then(setReviewText)
//     .catch(() => {
//       setError(true);
//       setReviewText("Failed to load review.");
//     });
// }, [fetchReviewText]);

// return (
//   <div className="w-full max-w-2xl p-4 bg-gray-100 rounded-lg shadow-md">
//     <h2 className="text-lg font-semibold mb-2">Customer Review</h2>
//     <p className={`text-gray-700 ${error ? "text-red-500" : ""}`}>{reviewText}</p>
//   </div>
// );
//}

// Simulated API call to fetch review text
const fetchReviewFromDatabase = async (): Promise<string> => {
	return new Promise((resolve) =>
		setTimeout(
			() => resolve("This restaurant serves the best pizza in town! 🍕"),
			1000
		)
	);
};

export function App() {
	return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6'>
			<ReviewTextArea fetchReviewText={fetchReviewFromDatabase} />
		</div>
	);
}
