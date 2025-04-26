import "./App.css";
import LoginPage from "./Authentication/pages/LoginPage";
import { useEffect, useState } from "react";
import HomePage from "./Home/pages/HomePage";
import { LoginProvider, useLogin } from "./Context/LoginContext";
import { VideosProvider } from "./Context/VideosContext";

function App() {
  const [getUser, setUser] = useState({});
  const { isLoggedIn } = useLogin();

  return (
    <>
      {!isLoggedIn ? (
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
      )}
    </>
  );
}

export default App;
