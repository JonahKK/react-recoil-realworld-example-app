import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { postUser } from "@/api/user";
import { menuState, tokenState } from "@/store/state";

const Register = () => {
  const [account, setAccount] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { username, email, password } = account;
  const [error, setError] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [disabled, setDisabled] = useState(false);
  const setToken = useSetRecoilState(tokenState);
  const setMenu = useSetRecoilState(menuState);
  const navigate = useNavigate();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };

  const onRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisabled(true);
    try {
      const data = await (
        await postUser("/users", {
          user: {
            username: username,
            email: email,
            password: password,
          },
        })
      ).data;
      const token = data.user.token;
      setToken(token);
      navigate("/", { replace: true });
    } catch (error: any) {
      const errorMessage = error.response.data.errors;
      setError({
        email: errorMessage.email,
        username: errorMessage.username,
        password: errorMessage.password,
      });
    }
    setDisabled(false);
  };

  useEffect(() => {
    setMenu(2);
  }, [setMenu]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Sign up — Conduit</title>
        </Helmet>
      </HelmetProvider>

      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign up</h1>
              <p className="text-xs-center">
                <Link to="/login" className="text-xs-center">
                  Have an account?
                </Link>
              </p>

              <ul className="error-messages">
                {error.email && <li>email {error.email}</li>}
                {error.username && <li>username {error.username}</li>}
                {error.password && <li>password {error.password}</li>}
              </ul>

              <form onSubmit={(event) => onRegister(event)}>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={username}
                    onChange={onChange}
                    disabled={disabled}
                    autoComplete="off"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    disabled={disabled}
                    autoComplete="off"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    disabled={disabled}
                  />
                </fieldset>
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  disabled={disabled}
                >
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;