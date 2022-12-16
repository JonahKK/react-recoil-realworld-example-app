import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postFavorites, deleteFavorites } from "../../api/favorites";

import { ArticleProps } from "../../types";
import { convertToDate } from "../../utils";
import ArticleTag from "../tag/ArticleTag";

import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state";

const FAVORITED_CLASS = "btn btn-sm btn-primary";
const UNFAVORITED_CLASS = "btn btn-sm btn-outline-primary";

const ArticlePreview = ({ article }: { article: ArticleProps }) => {
  const [favorited, setFavorited] = useState(article.favorited);
  const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount);
  const [disabled, setDisabled] = useState(false);

  const isLoggedIn = useRecoilValue(isLoggedInState);
  const navigate = useNavigate();

  const favorite = async () => {
    await postFavorites(`/articles/${article.slug}/favorite`);
    setFavorited(true);
    setFavoritesCount(favoritesCount + 1);
  };

  const unfavorite = async () => {
    await deleteFavorites(`/articles/${article.slug}/favorite`);
    setFavorited(false);
    setFavoritesCount(favoritesCount - 1);
  };

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/profile/${article.author.username}`}>
          <img src={article.author.image} />
        </Link>
        <div className="info">
          <Link to={`/profile/${article.author.username}`} className="author">
            {article.author.username}
          </Link>
          <span className="date">{convertToDate(article.createdAt)}</span>
        </div>
        <div className="pull-xs-right">
          <button
            type="button"
            className={
              article.favorited
                ? `${FAVORITED_CLASS} ${disabled ? "disabled" : ""}`
                : `${UNFAVORITED_CLASS} ${disabled ? "disabled" : ""}`
            }
            onClick={async () => {
              if (!isLoggedIn) navigate("/register");
              setDisabled(true);
              favorited ? await unfavorite() : await favorite();
              setDisabled(false);
            }}
          >
            <i className="ion-heart" /> {favoritesCount}
          </button>
        </div>
      </div>
      <Link to={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag) => (
            <ArticleTag key={tag} name={tag} />
          ))}
        </ul>
      </Link>
    </div>
  );
};

export default ArticlePreview;
