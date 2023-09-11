import React, { useEffect, useState } from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  logout: () => {},
  userId: null,
  login: (email, password) => {},
  signUp: (name, email, password) => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      setIsLoggedIn(true);
      setUserId(localStorage.getItem("userId"));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    return console.log("User Logged Out");
  };

  const loginHandler = (userId) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", userId);
    setIsLoggedIn(true);
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
        isLoggedIn,
        userId,
        logout: logoutHandler,
        login: loginHandler,
        signUp: signUpHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
