import React from "react";
import { Comment } from "../types";

export const Comments: React.FC<{
  comments: Comment[];
}> = ({ comments }) => {
  return (
    <>
      <h3>Comments</h3>
      {comments.map((comment: Comment, index: Number) => (
        <div className="comment" key={`${comment.postedBy} : ${index}`}>
          <div>
            <h4>{comment.postedBy}</h4>
            <p>{comment.text}</p>
          </div>
          <div className="delete-icon">
            {/* <svg data-testid="DeleteIcon"></svg> */}
            {/* <DeleteIcon /> */}
            <button>Delete</button>
          </div>
        </div>
      ))}
    </>
  );
};
