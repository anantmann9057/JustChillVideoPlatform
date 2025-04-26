import axios from "axios";
import { createContext, useContext, useState } from "react";
const VideosContext = createContext();

import { useLogin } from "./LoginContext";
export const VideosProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const { logout, token } = useLogin();

  const fetchVideos = async () => {
    try {
      axios
        .get("http://localhost:3000/api/v1/videos/get-videos",  {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === 401) {
            logout();
          } else {
            setVideos(response.data.data);
          }
        })
        .catch((error) => {
          console.error("Error uploading video:", error);
        });
    } catch (err) {
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
    setVideos((prev) => prev.filter((video) => video.id !== id));
  };

  return (
    <VideosContext.Provider
      value={{
        videos,
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
