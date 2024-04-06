import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import articles, { ArticleType } from "./article-content";
import { NotFound } from "./NotFound";
import { Comments, AddCommentForm } from "../components";
import { Article as ArticleInfoType } from "../types";
import { useUser } from "../hooks";

const hosturl = "http://localhost:8080";

export const Article: React.FC = (): JSX.Element => {
  const [articleInfo, setArticleInfo] = useState<ArticleInfoType>({
    name: "",
    upvotes: 0,
    comments: [],
    canUpvote: false,
  });
  const { canUpvote } = articleInfo;
  const navigate = useNavigate();
  const { user, isLoading } = useUser();

  const { articleId } = useParams() || "";

  const onUpvoteHandler = async () => {
    if (!canUpvote) {
      return;
    }
    const token = await user?.getIdToken();
    const headers = token ? { token } : {};
    const response = await axios.put(
      `${hosturl}/api/articles/${articleId}/upvote`,
      null,
      {
        headers,
      }
    );
    const updatedArticles = response.data;
    setArticleInfo(updatedArticles);
  };

  const loadArticleInfo = async () => {
    const token = await user?.getIdToken();
    const headers = token ? { token } : {};
    const response = await axios.get(`${hosturl}/api/articles/${articleId}`, {
      headers,
    });
    const newArticleInfo = response.data;
    setArticleInfo(newArticleInfo);
  };

  const onUpdateArticleHandler = (updatedArticle: ArticleInfoType) =>
    setArticleInfo(updatedArticle);

  const redirectToLogin = () => navigate("/login");

  const article = articles.find(
    (article: ArticleType) => article.name === articleId
  );

  if (!article) return <NotFound />;

  useEffect(() => {
    if (!isLoading) {
      loadArticleInfo();
    }
  }, [isLoading, user]);

  return (
    <>
      {article && (
        <>
          <h1>{article.title}</h1>
          <div className="upvotes-section">
            {user ? (
              <button type="button" onClick={onUpvoteHandler}>
                {canUpvote ? "Upvote" : "Already Upvoted!"}
              </button>
            ) : (
              <button type="button" onClick={redirectToLogin}>
                Log in to upvote!
              </button>
            )}

            <br />
            <p>This article has {articleInfo.upvotes} upvote(s)!</p>
          </div>
          {article.content.map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
          {user ? (
            <AddCommentForm
              articleName={articleId}
              onArticleUpdated={onUpdateArticleHandler}
            />
          ) : (
            <button type="button" onClick={redirectToLogin}>
              Login to add a Comment
            </button>
          )}

          {articleInfo.comments && <Comments comments={articleInfo.comments} />}
        </>
      )}
    </>
  );
};
