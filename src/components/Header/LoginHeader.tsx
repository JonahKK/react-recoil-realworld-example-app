import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { getUser } from "@/api/user";
import { tokenState } from "@/store/state";

const LoginHeader = () => {
  const [userInfo, setUserInfo] = useState({
    image: "",
    username: "",
  });
  const { image, username } = userInfo;
  const token = useRecoilValue(tokenState);
  const setToken = useSetRecoilState(tokenState);

  useEffect(() => {
    const getUsername = async () => {
      try {
        const data = await (
          await getUser("/user", {
            headers: {
              Authorization: `Token ${token}`,
            },
          })
        ).data;
        const user = data.user;
        setUserInfo({
          // FIXME: API error
          // image: user.image,
          image:
            "https://opgg-static.akamaized.net/images/profile_icons/profileIcon4661.jpg?image=q_auto&image=q_auto,f_webp,w_auto&v=1658762585003",
          username: user.username,
        });
        setToken(user.token);
      } catch (error: any) {
        console.log(error);
      }
    };
    getUsername();
  }, [token, setToken]);

  return (
    <>
      <li className="nav-item">
        <Link to="/editor" className="nav-link">
          <i className="ion-compose"></i> New Article
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/settings" className="nav-link">
          <i className="ion-gear-a"></i> Settings
        </Link>
      </li>
      <li className="nav-item">
        <Link to={`/profile/${username}`} className="nav-link">
          <img className="user-pic" src={image} />
          {username}
        </Link>
      </li>
    </>
  );
};

export default LoginHeader;
