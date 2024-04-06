import React from "react";
import { Link } from "react-router-dom";
import { ArticleType } from "../pages/article-content";

export const ListComponent: React.FC<{
  articles: ArticleType[];
}> = ({ articles }) => {
  return (
    <>
      {articles.map((article: ArticleType) => (
        <Link
          key={article.name}
          className="article-list-item"
          to={`/articles/${article.name}`}
        >
          <h3>{article.title}</h3>
          <p>{article.content[0].substring(0, 200)}...</p>
        </Link>
      ))}
    </>
  );
};
