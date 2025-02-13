import React, { useState } from "react";
import axios from "axios";
const FeedInput: React.FC = () => {

  // storing the :
  const [review, setReview] = useState('');


  // handler function:
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    axios.post(`http://localhost:3000/api/reviews/post`)
      .then((res) => console.log('Review Added!', res.data))
      .catch((error) => console.error(`ERROR: ${error}`));
  };

  return (
    <div className="flex items-center gap-2">
      <form onSubmit={ handleSubmit }>
            <input
              type="text"
              placeholder="Type Here"
              className="input input-bordered input-lg w-full max-w-xs"
              value={ review }
              onChange={ (e) => setReview( e.target.value )}
            />
            <button className="btn btn-primary btn-lg" type="submit">Post Review</button>
      </form>
    </div>
  );
};

export default FeedInput;
