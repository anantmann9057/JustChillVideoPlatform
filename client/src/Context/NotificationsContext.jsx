import { Children, createContext, useContext, useState } from "react";
import axios from "axios";
import { useLogin } from "./LoginContext";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { token, logout } = useLogin();
  const getNotifications = () => {
    axios
      .get("https://just-chill.onrender.com/api/v1/notifications/get-notification", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (res.status == 200) setNotifications(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const sendNotifications = (type, videoId) => {
    axios
      .post(
        "https://just-chill.onrender.com/api/v1/notifications/send-like-notification",
        null,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          params: {
            video_id: videoId,
            type: type,
          },
        }
      )
      .then((response) => {
        if(response.status==200) getNotifications();
      })
      .catch((response) => {
        if (response.status === 401) {
          logout();
        }
      })
      .finally(() => {});
  };
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        getNotifications,
        sendNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
export const useNotifications = () => useContext(NotificationsContext);
