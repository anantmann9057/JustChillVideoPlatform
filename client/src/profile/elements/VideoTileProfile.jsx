import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import Avatar from "@mui/material/Avatar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import CommentSection from "../../Home/elements/CommentSection";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Spinner from "react-bootstrap/Spinner";
import { useComments } from "../../Context/CommentsContext";
import { useNotifications } from "../../Context/NotificationsContext";
import { useLogin } from "../../Context/LoginContext";

export default function VideoTileProfile(props) {
  const { comments, getComments, postComment } = useComments();
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(props.items.totalLikes || 0);
  const [isLoading, setIsLoading] = useState(false);
  const { sendNotifications } = useNotifications();
  const { logout, token } = useLogin();

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      unlikeVideo();
    } else {
      setLiked(true);
      likeVideo();
    }
  };

  const likeVideo = () => {
    setIsLoading(true);
    axios
      .post(
        import.meta.env.ENVIRONMENT === "test"
          ? import.meta.env.TEST_BASE_URL
          : import.meta.env.BASE_URL + "likes/toggle-video-like",
        null,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          params: {
            video_id: props.items._id,
          },
        }
      )
      .then((response) => {
        if (response.status === 401) {
          logout();
        } else {
          setLikesCount(likesCount + 1);
          sendNotifications("like", props.items._id);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const unlikeVideo = () => {
    setIsLoading(true);
    axios
      .post(
        import.meta.env.ENVIRONMENT === "test"
          ? import.meta.env.TEST_BASE_URL
          : import.meta.env.BASE_URL + "likes/toggle-video-unlike",
        null,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          params: {
            video_id: props.items._id,
          },
        }
      )
      .then((response) => {
        if (response.status === 401) {
          logout();
        } else {
          setLikesCount(likesCount - 1);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const getCommentsOnVideo = () => {
    setIsLoading(true);
    getComments(props.items._id);
    setIsOpen(true);
    setIsLoading(false);
  };

  useEffect(() => {
    setLiked(props.items.isLiked);
  }, [props.items.isLiked]);

  function MyVerticallyCenteredModal(props) {
    const [newComment, setNewComment] = useState("");

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Comments on this video
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          className="h-50"
          style={{
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <div className="mb-4">
            <textarea
              className="form-control"
              placeholder="Write your comment..."
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ borderColor: "#ff4d4f", resize: "none" }}
            />
            <div className="d-flex justify-content-end mt-2">
              <Button
                variant="danger"
                onClick={() => {
                  postComment(newComment, props.videoId);
                  setNewComment(""); // Clear the input after posting
                }}
              >
                Post Comment
              </Button>
            </div>
          </div>

          {comments ? (
            <div>
              {comments.map((comm, index) => (
                <CommentSection
                  key={index}
                  owner={comm.owner}
                  content={comm.content}
                  likesCount={comm.totalLikes}
                />
              ))}
            </div>
          ) : (
            <h5>No Comments....</h5>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <div
      className="col-12 col-md-3 mb-4 w-100 position-relative"
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: "0 0 15px rgba(255, 0, 0, 0.3)",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
        width: "250px", // Adjust width for smaller size
        height: "250px", // Adjust height for square shape
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 0 25px rgba(255, 0, 0, 0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 0, 0, 0.3)";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          pointerEvents: "none",
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255,0,0,0.3) 0%, transparent 20%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 0%, transparent 20%),
            radial-gradient(circle at 50% 90%, rgba(255,0,0,0.2) 0%, transparent 20%)
          `,
          backgroundSize: "cover",
          animation: "particleMove 8s linear infinite",
          zIndex: 1,
          borderRadius: "15px",
          opacity: 0.6,
        }}
      ></div>

      <div
        style={{
          overflow: "hidden",
          borderRadius: "15px",
          position: "relative",
          zIndex: 2,
          height: "100%", // Fit the height to the square container
          width: "100%", // Fit the width to the square container
        }}
      >
        <ReactPlayer
          url={props.items.videoFile}
          playing={true}
          controls={true}
          light={
            props.items.thumbnail
              ? props.items.thumbnail
              : "https://knetic.org.uk/wp-content/uploads/2020/07/Video-Placeholder.png"
          }
          width="100%"
          height="100%" // Ensure the video takes up the full height of the container
          style={{ borderRadius: "15px" }}
        />
      </div>

      <div
        className="d-flex align-items-center mt-2 p-2"
        style={{ position: "relative", zIndex: 2 }}
      >
        <Avatar
          alt={props.items.owner.userName}
          src={props.items.owner.avatar}
          style={{ width: "30px", height: "30px", borderRadius: "50%" }}
        />
        <h6 className="ms-2 mb-0" style={{ fontWeight: "600", color: "#fff" }}>
          @{props.items.owner.userName}
        </h6>
      </div>

      <div
        className="container-fluid d-flex row"
        style={{
          position: "relative",
          zIndex: 2,
          padding: "5px 10px",
          color: "#fff",
        }}
      >
        <h6
          className="ms-3 mb-0"
          style={{
            fontWeight: "600",
            fontSize: "12px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "#fff",
          }}
        >
          {props.items.title}
        </h6>
        <p
          className="ms-3 mb-0"
          style={{
            color: "#fff",
            fontSize: "10px",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {props.items.description}
        </p>
      </div>

      <div
        className="d-flex justify-content-between align-items-center mt-2 p-2"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div
          className="d-flex align-items-center"
          style={{
            cursor: "pointer",
            color: liked ? "#ff4d4f" : "#999",
            fontWeight: "500",
            fontSize: "14px",
            transition: "transform 0.2s ease, color 0.2s ease",
            transform: liked ? "scale(1.2)" : "scale(1)",
          }}
          onClick={handleLike}
        >
          {liked ? (
            <FavoriteIcon style={{ color: "#ff4d4f", fontSize: "22px" }} />
          ) : (
            <FavoriteBorderIcon style={{ color: "#999", fontSize: "22px" }} />
          )}
          <span className="ms-2">{likesCount}</span>
        </div>

        <div
          className="d-flex align-items-center"
          style={{
            cursor: "pointer",
            color: "#1890ff",
            fontWeight: "500",
            fontSize: "14px",
          }}
        >
          <button
            onClick={getCommentsOnVideo}
            className="btn btn-link p-0 d-flex align-items-center"
            style={{ textDecoration: "none", color: "#1890ff" }}
          >
            <CommentIcon />
            <span className="ms-2">{props.items.commentsCount}</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div
          className="d-flex justify-content-center mt-3"
          style={{ position: "relative", zIndex: 2 }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      <MyVerticallyCenteredModal
        show={isOpen}
        videoId={props.items._id}
        onHide={() => setIsOpen(false)}
      />
    </div>
  );
}
