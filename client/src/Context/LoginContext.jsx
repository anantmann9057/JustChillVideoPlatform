import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useLoading } from "./LoadingContext";
const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => localStorage.getItem("user"));

  const { showLoading, hideLoading } = useLoading();
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
    showLoading();
    axios
      .post(
        import.meta.env.VITE_ENVIRONMENT === "test"
          ? import.meta.env.VITE_TEST_BASE_URL+ "users/update-bio"
          : import.meta.env.VITE_BASE_URL + "users/update-bio",
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
        hideLoading();
        getUserDetails();
      })
      .catch((error) => {
        hideLoading();
        if (error.response && error.response.status === 401) {
          logout();
        }
        console.error("Error posting comment:", error);
      });
  };

  const getUserDetails = () => {
    showLoading();
    axios
      .get(
        import.meta.env.VITE_ENVIRONMENT === "test"
          ? import.meta.env.VITE_TEST_BASE_URL+ "users/getUserDetails"
          : import.meta.env.VITE_BASE_URL + "users/getUserDetails",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        hideLoading();
        setUser(JSON.stringify(res.data.data));
        console.log(res.data);
      })
      .catch((error) => {
        hideLoading();
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  };
  return (
    <LoginContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        getUserDetails,
        updateBio,
        isLoggedIn: !!token,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
