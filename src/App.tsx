import { useEffect } from "react";
import { Routes, Route, HashRouter, Navigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import Header from "./components/header/Header";
import Footer from "./components/common/Footer";
import ScrollTop from "./components/common/ScrollTop";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Article from "./pages/Article";
import Profile from "./pages/Profile";
import EditArticle from "./pages/EditArticle";
import NewArticle from "./pages/NewArticle";

import { getUser } from "./api/user";
import { isLoggedInState, userState } from "./state";

const App = () => {
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const initApp = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        if (!jwtToken) return;
        const data = await getUser("/user");
        const { email, username, bio, image } = data.user;
        setIsLoggedIn(true);
        setUser({
          email: email,
          username: username,
          bio: bio,
          image: image,
        });
      } catch (err: any) {
        localStorage.removeItem("jwtToken");
        setIsLoggedIn(false);
        setUser({
          email: "",
          username: "",
          bio: "",
          image: "",
        });
      }
    };
    initApp();
  }, [setIsLoggedIn, setUser]);

  return (
    <>
      <HashRouter>
        <ScrollTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/article/:URLSlug" element={<Article />} />
          <Route path="/editor" element={<NewArticle />} />
          <Route path="/editor/:URLSlug" element={<EditArticle />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile/:userId/*" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
        <Footer />
      </HashRouter>
    </>
  );
};

export default App;
