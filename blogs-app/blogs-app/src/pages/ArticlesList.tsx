import articles, { ArticleType } from "./article-content";
import { ListComponent } from "../components";

export const ArticlesList: React.FC = (): JSX.Element => {
  return (
    <div>
      <h1> Articles</h1>
      <ListComponent articles={articles as ArticleType[]} />
    </div>
  );
};
