import React, { useEffect, useState } from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  logout: () => {},
  login: (email, password) => {},
  signUp: (name, email, password) => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    localStorage.getItem("isLoggedIn")
      ? setIsLoggedIn(true)
      : setIsLoggedIn(false);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    return console.log("User Logged Out");
  };

  const loginHandler = (email, password) => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    return console.log("User Logged In");
  };

  const signUpHandler = (name, email, password) => {
    localStorage.setItem("isLoggedIn", "true");
    return console.log(`Created Account Successfully`);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
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
