import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { LoginProvider } from "./Context/LoginContext.jsx";
import { LoadingProvider } from "./Context/LoadingContext.jsx";
import { NotificationsProvider } from "./Context/NotificationsContext.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <LoginProvider>
        <LoadingProvider>
          <NotificationsProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </NotificationsProvider>
        </LoadingProvider>
      </LoginProvider>
    </ThemeProvider>
  </StrictMode>
);
