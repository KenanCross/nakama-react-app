import React from "react";
import Review from "../../models/review";
import "./style/feed.css";

interface ReviewSlideProps {
	data: Review[];
	usePicture?: boolean;
}

export const ReviewSlides = ({ data, usePicture }: ReviewSlideProps) => {
	return (
		<>
			{usePicture ?
			
				data.map((review) => (
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
				)) :
			
			data.map((review) => (
				<div className='card card-lg bg-base-100 shadow-sm' key={review._id}>
					<div className='card-body'>
						<h2 className='card-title'></h2>
						<p className="mb-2">{review.review}</p>
						<div className='card-actions justify-end'>
							<div className='flex flex-row justify-start'>
								<div className='size-8 relative inline-block text-gray-dark text-center content-center text-sm'>
									<div className='absolute top-[5px] bottom-0 left-0 right-0'>
										{review.score}
									</div>
									<svg
										className='fill-yellow'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 576 512'>
										<path d='M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z' />
									</svg>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</>
	);
};
