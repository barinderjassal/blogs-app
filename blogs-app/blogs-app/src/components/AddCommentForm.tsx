import React, { useState } from "react";
import axios from "axios";
import { Article as ArticleInfoType } from "../types";
import { useUser } from "../hooks";

export const AddCommentForm: React.FC<{
  articleName: string | undefined;
  onArticleUpdated: (data: ArticleInfoType) => void;
}> = ({ articleName, onArticleUpdated }) => {
  const [commentText, setCommentText] = useState("");
  const { user } = useUser();

  const onCommentTextChange = (e: any) => setCommentText(e.target.value);

  const onSubmitComment = async () => {
    if (user && commentText === "") return;

    const token = await user?.getIdToken();
    const headers = token ? { token } : {};

    const response = await axios.post(
      `http://localhost:8080/api/articles/${articleName}/comments`,
      {
        postedBy: user.email,
        text: commentText,
      },
      { headers }
    );
    const updatedArticle: ArticleInfoType = response.data;

    onArticleUpdated(updatedArticle);
    setCommentText("");
  };

  return (
    <div id="add-comment-form">
      <h3>Add a comment</h3>
      {user && (
        <p>
          You are posting as <i>{user.email}</i>
        </p>
      )}
      <br />

      <textarea
        cols={50}
        rows={5}
        value={commentText}
        onChange={onCommentTextChange}
      />

      <button type="submit" onClick={onSubmitComment}>
        Add Comment
      </button>
    </div>
  );
};
