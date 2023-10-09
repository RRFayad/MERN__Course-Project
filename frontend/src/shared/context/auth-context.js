import React, { useEffect, useState } from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  logout: () => {},
  userId: null,
  login: (email, password) => {},
  signUp: (name, email, password) => {},
  token: null,
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      setToken(localStorage.getItem("token"));
      setUserId(localStorage.getItem("userId"));
    } else {
      setToken(null);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    setToken(null);
    return console.log("User Logged Out");
  };

  const loginHandler = (userId, token) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", userId);
    setToken(token);
    setUserId(userId);
    return console.log("User Logged In");
  };

  const signUpHandler = (userId) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", userId);
    setUserId(userId);
    return console.log(`Created Account Successfully`);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userId,
        logout: logoutHandler,
        login: loginHandler,
        signUp: signUpHandler,
        token,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
