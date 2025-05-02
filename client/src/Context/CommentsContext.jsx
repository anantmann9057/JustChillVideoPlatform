import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useLogin } from "./LoginContext";
import { useVideos } from "./VideosContext";
const CommentsContext = createContext();

export const CommentsProvider = ({ children }) => {
  const { token, logout } = useLogin(); // <-- move inside here
  const [comments, setComments] = useState([]);
  const { fetchVideos } = useVideos();
  const getComments = (videoId) => {
    axios
      .get(
        import.meta.env.VITE_ENVIRONMENT === "test"
          ? import.meta.env.VITE_TEST_BASE_URL+ "comments/get-video-comments"
          : import.meta.env.VITE_BASE_URL + "comments/get-video-comments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            video_id: videoId,
          },
        }
      )
      .then((response) => {
        setComments(response.data.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        console.error("Error fetching comments:", error);
      });
  };

  const postComment = (comment, videoId) => {
    axios
      .post(
        import.meta.env.VITE_ENVIRONMENT === "test"
          ? import.meta.env.VITE_TEST_BASE_URL+ "comments/post-comment"
          : import.meta.env.VITE_BASE_URL + "comments/post-comment",
        {
          comment,
          video_id: videoId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        getComments(videoId); // refresh comments after posting
        fetchVideos();
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        console.error("Error posting comment:", error);
      });
  };

  return (
    <CommentsContext.Provider
      value={{
        comments, // you forgot to provide comments list too
        getComments,
        postComment,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => useContext(CommentsContext);
