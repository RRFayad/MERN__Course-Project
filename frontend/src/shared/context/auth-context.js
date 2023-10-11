import React, { useCallback, useEffect, useState } from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  logout: () => {},
  userId: null,
  login: (email, password) => {},
  signUp: (name, email, password) => {},
  token: null,
});

let logoutTimer;

export const AuthContextProvider = (props) => {
  const [userId, setUserId] = useState();
  const [token, setToken] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState();

  useEffect(() => {
    if (localStorage.getItem("userData")) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData.expirationTime > Date.now()) {
        setToken(userData.token);
        setUserId(userData.id);
        setTokenExpiration(userData.expirationTime);
      }
    }
  }, []);

  const logoutHandler = useCallback(() => {
    // used useCallback here as I used the function in a useEffect
    localStorage.removeItem("userData");
    setUserId(null);
    setToken(null);
    setTokenExpiration(null);
    return console.log("User Logged Out");
  }, []);

  useEffect(() => {
    if (tokenExpiration) {
      logoutTimer = setTimeout(logoutHandler, tokenExpiration - Date.now());
    } else {
      clearTimeout(logoutTimer);
    }
  }, [tokenExpiration, logoutHandler]);

  const loginHandler = (userId, token, expirationTime) => {
    setToken(token);
    setUserId(userId);
    setTokenExpiration(expirationTime);
    const userData = {
      id: userId,
      token,
      expirationTime,
    };
    localStorage.setItem("userData", JSON.stringify(userData));
    return console.log(
      `User Logged In - expires in: ${expirationTime - Date.now()} seconds`
    );
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
