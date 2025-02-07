import React from "react";
const FeedInput: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Type Here"
        className="input input-bordered input-lg w-full max-w-xs"
      />
      <button className="btn btn-primary btn-lg">Post</button>
    </div>
  );
};

export default FeedInput;
