import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import Avatar from "@mui/material/Avatar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import CommentSection from "./CommentSection";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Spinner from "react-bootstrap/Spinner";
import { useVideos } from "../../Context/VideosContext";
import { useComments } from "../../Context/CommentsContext";
export default function VideoTile(props) {
  const { videos, fetchVideos } = useVideos();
  const { comments, getComments, postComment } = useComments();
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(props.items.totalLikes || 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLiked(false);

      unlikeVideo();
    } else {
      setLiked(true);
      likeVideo();
    }
  };

  function sendNotification(type) {
    axios
      .post(
        "http://localhost:3000/api/v1/notifications/send-like-notification",
        null,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          params: {
            video_id: props.items._id,
            type: type,
          },
        }
      )
      .then((response) => {
        if (response.status === 401) {
          localStorage.clear("user");
          localStorage.clear("token");
          window.location.reload();
        } else {
          setLikesCount(likesCount + 1);
          fetchVideos();
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  function likeVideo() {
    axios
      .post("http://localhost:3000/api/v1/likes/toggle-video-like", null, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          video_id: props.items._id,
        },
      })
      .then((response) => {
        if (response.status === 401) {
          localStorage.clear("user");
          localStorage.clear("token");
          window.location.reload();
        } else {
          setLikesCount(likesCount + 1);

          sendNotification("like");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function unlikeVideo() {
    axios
      .post("http://localhost:3000/api/v1/likes/toggle-video-unlike", null, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          video_id: props.items._id,
        },
      })
      .then((response) => {
        if (response.status === 401) {
          localStorage.clear("user");
          localStorage.clear("token");
          window.location.reload();
        } else {
          setLikesCount(likesCount - 1);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  function getCommentsOnVideo() {
    setIsLoading(true);
    getComments(props.items._id);
    setIsOpen(true);

    setIsLoading(false);
  }
  useEffect(() => {
    setLiked(props.items.isLiked);

    getComments();
  }, []);
  function MyVerticallyCenteredModal(props) {
    console.log(props.videoId);
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
            overflow: "scroll",
          }}
        >
          {/* Comment input section */}
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
                }}
              >
                {"Post Comment"}
              </Button>
            </div>
          </div>

          {/* Comments list */}
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
      className="col-12 col-md-4 mb-4 w-100 position-relative"
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: "0 0 15px rgba(255, 0, 0, 0.3)",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
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
      {/* Particle Overlay */}
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

      {/* Video Player */}
      <div
        style={{
          overflow: "hidden",
          borderRadius: "15px",
          position: "relative",
          zIndex: 2,
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
          height="400px"
          style={{ borderRadius: "15px" }}
        />
      </div>

      {/* Owner Info */}
      <div
        className="d-flex align-items-center mt-3 p-3"
        style={{ position: "relative", zIndex: 2 }}
      >
        <Avatar
          alt={props.items.owner.userName}
          src={props.items.owner.avatar}
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
        <h6 className="ms-3 mb-0" style={{ fontWeight: "600", color: "#fff" }}>
          @{props.items.owner.userName}
        </h6>
      </div>
      <div className="container-fluid d-flex row">
        <h7
          className="ms-3 mb-0"
          style={{ fontWeight: "600", color: "#fff", textAlign: "start" }}
        >
          @{props.items.title}
        </h7>
        <p className="ms-3 mb-0" style={{ color: "#fff", textAlign: "start" }}>
          @{props.items.description}
        </p>
      </div>
      {/* Likes & Comments */}
      <div
        className="d-flex justify-content-between align-items-center mt-3 p-3"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div
          className="d-flex align-items-center"
          style={{
            cursor: "pointer",
            color: liked ? "#ff4d4f" : "#999",
            fontWeight: "500",
            fontSize: "16px",
            transition: "transform 0.2s ease, color 0.2s ease",
            transform: liked ? "scale(1.2)" : "scale(1)",
          }}
          onClick={handleLike}
        >
          {liked ? (
            <FavoriteIcon style={{ color: "#ff4d4f", fontSize: "28px" }} />
          ) : (
            <FavoriteBorderIcon style={{ color: "#999", fontSize: "28px" }} />
          )}
          <span className="ms-2">{likesCount}</span>
        </div>

        <div
          className="d-flex align-items-center"
          style={{
            cursor: "pointer",
            color: "#1890ff",
            fontWeight: "500",
            fontSize: "16px",
          }}
        >
          <button
            onClick={() => getCommentsOnVideo()}
            className="btn btn-link p-0 d-flex align-items-center"
            style={{ textDecoration: "none", color: "#1890ff" }}
          >
            <CommentIcon />
            <span className="ms-2">{props.items.commentsCount}</span>
          </button>
        </div>
      </div>

      {/* Loader Spinner */}
      {isLoading && (
        <div
          className="d-flex justify-content-center mt-3"
          style={{ position: "relative", zIndex: 2 }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {/* Modal for Comments */}
      <MyVerticallyCenteredModal
        show={isOpen}
        videoId={props.items._id}
        onHide={() => setIsOpen(false)}
      />
    </div>
  );
}
