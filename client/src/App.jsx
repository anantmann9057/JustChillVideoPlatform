import "./App.css";
import LoginPage from "./Authentication/pages/LoginPage";
import { useEffect, useState } from "react";
import HomePage from "./Home/pages/HomePage";
import { LoginProvider, useLogin } from "./Context/LoginContext";
import { VideosProvider } from "./Context/VideosContext";
import { Routes, Route } from "react-router";
import ProfileScreen from "./profile/pages/ProfilePage";
import RegisterPage from "./Authentication/pages/RegisterPage";

function App() {
  const [getUser, setUser] = useState({});
  const { isLoggedIn } = useLogin();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <LoginPage></LoginPage>
            ) : (
              <VideosProvider>
                <HomePage
                  userName={getUser.userName}
                  coverImage={getUser.coverImage}
                  avatar={getUser.avatar}
                  token={JSON.parse(localStorage.getItem("user")).refreshToken}
                ></HomePage>
              </VideosProvider>
            )
          }
        ></Route>
        <Route
          path="/profile"
          element={
            <VideosProvider>
              {!isLoggedIn ? <LoginPage></LoginPage> : <ProfileScreen />}
            </VideosProvider>
          }
        ></Route>

<Route
          path="/register"
          element={
            <RegisterPage></RegisterPage>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App;
