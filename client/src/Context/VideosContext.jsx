import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useLoading } from "./LoadingContext";
const VideosContext = createContext();

import { useLogin } from "./LoginContext";
export const VideosProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const { logout, token } = useLogin();
  const { showLoading, hideLoading } = useLoading();
  const fetchVideos = async () => {
    try {
      showLoading();
      axios
        .get(
          import.meta.env.VITE_ENVIRONMENT === "test"
            ? import.meta.env.VITE_TEST_BASE_URL+ "videos/get-videos"
            : import.meta.env.VITE_BASE_URL + "videos/get-videos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          hideLoading();
          setVideos(response.data.data);
        })
        .catch((error) => {
          hideLoading();
          if (error.status === 401) {
            logout();
          }
          console.error("Error uploading video:", error);
        });
    } catch (err) {
      hideLoading();

      console.error("Error fetching videos", err);
    }
  };

  const getUserVideos = async () => {
    try {
      showLoading();
      axios
        .get(
          import.meta.env.VITE_ENVIRONMENT === "test"
            ? import.meta.env.VITE_TEST_BASE_URL+ "videos/user-videos"
            : import.meta.env.VITE_BASE_URL + "videos/user-videos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          hideLoading();

          setUserVideos(response.data.data);
        })
        .catch((error) => {
          hideLoading();
          if (error.status === 401) {
            logout();
          }
          console.error("Error uploading video:", error);
        });
    } catch (err) {
      hideLoading();
      console.error("Error fetching videos", err);
    }
  };

  const addVideo = (newVideo) => {
    setVideos((prev) => [newVideo, ...prev]);
  };

  const updateVideo = (id, updatedVideo) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === id ? { ...video, ...updatedVideo } : video
      )
    );
  };

  const deleteVideo = (id) => {
    try {
      showLoading();

      axios
        .delete(
          import.meta.env.VITE_ENVIRONMENT === "test"
            ? import.meta.env.VITE_TEST_BASE_URL+ "videos/delete-video"
            : import.meta.env.VITE_BASE_URL + "videos/delete-video",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            params: {
              videoId: id,
            },
          }
        )
        .then((response) => {
          hideLoading();
          fetchVideos();
        })
        .catch((error) => {
          hideLoading();
          if (error.status === 401) {
            logout();
          }
          console.error("Error uploading video:", error);
        });
    } catch (err) {
      hideLoading();
      console.error("Error fetching videos", err);
    }
  };

  return (
    <VideosContext.Provider
      value={{
        videos,
        userVideos,
        getUserVideos,
        fetchVideos,
        addVideo,
        updateVideo,
        deleteVideo,
      }}
    >
      {children}
    </VideosContext.Provider>
  );
};

export const useVideos = () => useContext(VideosContext);
