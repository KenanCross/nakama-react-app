import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface FeedInputProps {
	title: string;
	imageURL: string;
	type: string;
	getReviews: boolean;
	setGetReviews: any;
}

const FeedInput = ({
	title,
	imageURL,
	type,
	getReviews,
	setGetReviews,
}: FeedInputProps) => {
	// storing the :
	const [review, setReview] = useState("");
	const [score, setScore] = useState(0);
	const { id } = useParams<{ id: string }>();

	// handler function:
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		axios
			.post(`http://localhost:3000/api/reviews/post`, {
				review,
				type,
				score,
				entry: {
					id: parseInt(id!),
					title: title,
					imageUrl: imageURL,
				},
			})
			.then((res) => {
				console.log("Review Added!", res.data);
				setGetReviews(true);
			})
			.catch((error) => console.error(`ERROR: ${error}`));
		setScore(0);
	};
	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className='flex flex-col w-8/12 items-center gap-2 m-auto'>
					<div className='flex flex-row items-center pb-4'>
						<h4 className='uppercase text-lg'>Your Score: </h4>
						{/* start of the score menu */}
						<div className='rating rating-lg rating-half'>
							<input
								type='radio'
								name='rating-10'
								className='rating-hidden'
								defaultChecked
							/>
							<input
								type='radio'
								name='rating-10'
								className='mask mask-star-2 mask-half-1 bg-green-500'
								onChange={() => setScore(0.5)}
							/>
							<input
								type='radio'
								name='rating-10'
								className='mask mask-star-2 mask-half-2 bg-green-500'
								onChange={() => setScore(1)}
							/>
							<input
								type='radio'
								name='rating-10'
								className='mask mask-star-2 mask-half-1 bg-green-500'
								onChange={() => setScore(1.5)}
							/>
							<input
								type='radio'
								name='rating-10'
								className='mask mask-star-2 mask-half-2 bg-green-500'
								onChange={() => setScore(2)}
							/>
							<input
								type='radio'
								name='rating-10'
								className='mask mask-star-2 mask-half-1 bg-green-500'
								onChange={() => setScore(2.5)}
							/>
							<input
								type='radio'
								name='rating-10'
								className='mask mask-star-2 mask-half-2 bg-green-500'
								onChange={() => setScore(3)}
							/>
							<input
								type='radio'
								name='rating-10'
								className='mask mask-star-2 mask-half-1 bg-green-500'
								onChange={() => setScore(3.5)}
							/>
							<input
								type='radio'
								name='rating-10'
								className='mask mask-star-2 mask-half-2 bg-green-500'
								onChange={() => setScore(4)}
							/>
							<input
								type='radio'
								name='rating-10'
								className='mask mask-star-2 mask-half-1 bg-green-500'
								onChange={() => setScore(4.5)}
							/>
							<input
								type='radio'
								name='rating-10'
								className='mask mask-star-2 mask-half-2 bg-green-500'
								onChange={() => setScore(5)}
							/>
						</div>
					</div>

					<textarea
						className='textarea textarea-ghost caret-slate-700 border-base-100 w-4/5 h-96'
						placeholder='Type your review here'
						value={review}
						onChange={(e) => setReview(e.target.value)}></textarea>

					<button className='btn btn-wide uppercase text-lg' type='submit'>
						Post Review
					</button>
				</div>
			</form>
		</>
	);
};

export default FeedInput;
