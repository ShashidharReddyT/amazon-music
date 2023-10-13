import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider(props) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const children = props.children;

  function signUpContext(userData) {

  }

  function signInContext(token, userName) {
    setUser(userName);
    setToken(token);
  }

  function signOutContext() {
    setUser(null);
    setToken(null);
  }

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      signOutContext();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const value = {
    isUserLoggedIn: !!user,
    user,
    token,
    signUpContext,
    signInContext,
    signOutContext,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
