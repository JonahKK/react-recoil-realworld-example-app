import { useState, useEffect } from "react";

import Loading from "../Loading";
import ArticlePreview from "../article/ArticlePreview";
import { getArticles } from "../../api/article";
import { ArticleProps } from "../../types";

const MyFeed = ({ toggle }: { toggle: number }) => {
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const limit = 10; // temporary
    const initArticles = async () => {
      const { articles } = await getArticles(`/articles/feed?limit=${limit}`);
      setArticles(articles);
    };
    initArticles().then(() => setLoading(false));
  }, []);

  if (toggle !== 0) return null;

  return (
    <>
      {loading ? (
        <div className="article-preview">
          <Loading />
        </div>
      ) : (
        // TODO: add pagenation
        <>
          {articles.length === 0 ? (
            <div className="article-preview">No articles are here... yet.</div>
          ) : (
            articles.map((article) => (
              <ArticlePreview key={article.slug} article={article} />
            ))
          )}
        </>
      )}
    </>
  );
};

export default MyFeed;
