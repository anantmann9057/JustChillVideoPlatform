import { createContext, useContext, useState } from "react";
import axios from "axios";
const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => localStorage.getItem("user"));
  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const updateBio = (bio) => {
    axios
      .post(
        "https://just-chill.onrender.com/api/v1/users/update-bio",
        {
          bio: bio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        getUserDetails();
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        console.error("Error posting comment:", error);
      });
  };

  const getUserDetails = () => {
    axios
      .get(
        "https://just-chill.onrender.com/api/v1/users/getUserDetails",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        console.error("Error posting comment:", error);
      });
  };
  return (
    <LoginContext.Provider
      value={{ user, token, login, logout, isLoggedIn: !!token }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
