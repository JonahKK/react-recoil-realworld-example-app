import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import Feed from '../components/feed/Feed';
import LinkTag from '../components/tag/LinkTag';
import Loading from '../components/common/Loading';

import { isLoggedInAtom, pageAtom } from '../atom';
import { getTags } from '../api/tags';

const Home = () => {
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const navigate = useNavigate();

  const [toggle, setToggle] = useState(isLoggedIn ? 0 : 1);
  const [tagList, setTagList] = useState<string[]>([]);
  const [tagListLoading, setTagListLoading] = useState(false);
  const [tagName, setTagName] = useState('');
  const setPage = useSetRecoilState(pageAtom);

  const onClickTag = (tag: string) => {
    setToggle(2);
    setTagName(tag);
    setPage(1);
  };

  useEffect(() => {
    const initTags = async () => {
      setTagListLoading(true);
      const { tags } = await getTags();
      setTagList(tags);
      setTagListLoading(false);
    };

    initTags();
  }, []);

  useEffect(() => navigate('/', { replace: true }), [navigate]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Home — Conduit</title>
        </Helmet>
      </HelmetProvider>

      <div className="home-page">
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${toggle === 0 ? 'active' : ''}`}
                      to="/"
                      onClick={() => {
                        setToggle(0);
                        setPage(1);
                      }}
                      hidden={!isLoggedIn}
                    >
                      Your Feed
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${toggle === 1 ? 'active' : ''}`}
                      to="/"
                      onClick={() => {
                        setToggle(1);
                        setPage(1);
                      }}
                    >
                      Global Feed
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      to="/"
                      onClick={() => {
                        setToggle(2);
                        setPage(1);
                      }}
                      hidden={toggle !== 2}
                    >
                      <i className="ion-pound"></i> {tagName}{' '}
                    </Link>
                  </li>
                </ul>
              </div>
              {toggle === 0 && <Feed query="/feed?" url="/" limit={10} />}
              {toggle === 1 && <Feed query="?" url="/" limit={10} />}
              {toggle === 2 && (
                <Feed query={`?tag=${tagName}&`} url="/" limit={10} />
              )}
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>
                <div className="tag-list">
                  {tagListLoading ? (
                    <Loading text="tags" />
                  ) : (
                    tagList.map(tag => (
                      <LinkTag
                        key={tag}
                        name={tag}
                        onClick={() => onClickTag(tag)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
