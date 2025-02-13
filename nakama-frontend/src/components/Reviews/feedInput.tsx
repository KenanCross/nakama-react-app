import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AnimeData from "../../models/anime";
import Review from "../../models/review";
const FeedInput = (title:any, imageUrl:any, type:any) => {
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
          id: id,
          title: title,
          imageUrl: imageUrl,
        },
      })
      .then((res) => console.log("Review Added!", res.data))
      .catch((error) => console.error(`ERROR: ${error}`));
  };
    console.log(score)
  return (
    <form onSubmit={handleSubmit}>
    <div className="flex flex-col w-8/12 items-center gap-2">
      
        {/* start of the score menu */}
        <div className="rating rating-lg rating-half">
          <input type="radio" name="rating-10" className="rating-hidden" />
          <input
            type="radio"
            name="rating-10"
            className="mask mask-star-2 mask-half-1 bg-green-500"
            onChange={()=> setScore(.5)}
          />
          <input
            type="radio"
            name="rating-10"
            className="mask mask-star-2 mask-half-2 bg-green-500"
            onChange={()=> setScore(1)}
          />
          <input
            type="radio"
            name="rating-10"
            className="mask mask-star-2 mask-half-1 bg-green-500"
            onChange={()=> setScore(1.5)}
          />
          <input
            type="radio"
            name="rating-10"
            className="mask mask-star-2 mask-half-2 bg-green-500"
            onChange={()=> setScore(2)}
          />
          <input
            type="radio"
            name="rating-10"
            className="mask mask-star-2 mask-half-1 bg-green-500"
            onChange={()=> setScore(2.5)}
          />
          <input
            type="radio"
            name="rating-10"
            className="mask mask-star-2 mask-half-2 bg-green-500"
            onChange={()=> setScore(3)}
          />
          <input
            type="radio"
            name="rating-10"
            className="mask mask-star-2 mask-half-1 bg-green-500"
            onChange={()=> setScore(3.5)}
          />
          <input
            type="radio"
            name="rating-10"
            className="mask mask-star-2 mask-half-2 bg-green-500"
            onChange={()=> setScore(4)}
          />
          <input
            type="radio"
            name="rating-10"
            className="mask mask-star-2 mask-half-1 bg-green-500"
            onChange={()=> setScore(4.5)}
          />
          <input
            type="radio"
            name="rating-10"
            className="mask mask-star-2 mask-half-2 bg-green-500"
            onChange={()=> setScore(5)}
          />
        </div>
      <textarea className="textarea textarea-ghost" 
      placeholder="Type your review here"
      value={review}
      onChange={(e) => setReview(e.target.value)}></textarea>

       
        

        <button className="btn btn-primary btn-lg" type="submit">
          Post Review
        </button>
      
    </div>
    </form>
  );
};

export default FeedInput;
