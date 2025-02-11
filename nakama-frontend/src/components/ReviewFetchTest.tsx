import { useState, useEffect } from "react";
import Review from "../models/review";


const ReviewFetchTest = () => {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const execute = async () => {
            await fetch(`http://localhost:3000/api/reviews/allReviews`)
            .then((response) => {
                if(!response.ok) {
                    new Error(`Bad response`);
                }
                return response.json();
            })
            .then((data) => setReviews(data));
        }

        execute();
    }, []);

    console.log(reviews);

    return(
        <>
            { reviews ? 

            <ul>
                {reviews.map((review) => (
                    <li key={review._id} > 
                        <div>
                            <h2>{ }</h2>
                        </div>
                    </li>
                ))}
            </ul>

             :  <p>"Loading"</p> }
        </>
    );
};

export default ReviewFetchTest;