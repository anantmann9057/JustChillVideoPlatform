import { Col, Row } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
import { Sun, Moon } from "lucide-react"; // Add this at the top with other imports
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import VideoTile from "../elements/VideoTile";
import { useFilePicker } from "use-file-picker";
import { generateVideoThumbnails } from "@rajesh896/video-thumbnails-generator";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { useLogin } from "../../Context/LoginContext";
import { useLoading } from "../../Context/LoadingContext";
import { useVideos } from "../../Context/VideosContext";
import { CommentsProvider } from "../../Context/CommentsContext";
import { useNotifications } from "../../Context/NotificationsContext";
import { useTheme } from "../../Context/ThemeContext";
import { NavLink } from "react-router";
export default function HomePage(props) {
  const { videos, fetchVideos } = useVideos();
  const { notifications, getNotifications } = useNotifications();
  const { user, logout } = useLogin();
  const { showLoading, hideLoading } = useLoading();
  const title = useRef(null);
  const description = useRef(null);
  const titleLabel = useRef(null);
  const descriptionLabel = useRef(null);
  const { theme, toggleTheme } = useTheme();

  const { openFilePicker } = useFilePicker({
    readAs: "DataURL",
    accept: "video/*",
    multiple: false,
    onFilesSelected: ({ plainFiles, filesContent, errors }) => {
      console.log("onFilesSelected", plainFiles, filesContent, errors);
    },
    onFilesRejected: ({ errors }) => {
      console.log("onFilesRejected", errors);
    },
    onFilesSuccessfullySelected: ({ plainFiles }) => {
      const firstFile = plainFiles[0];
      if (firstFile) {
        if (!title.current.value) {
          console.log("no value");
          titleLabel.current.textContent = "select input";
        } else if (!description.current.value) {
          console.log("no value");
          descriptionLabel.current.textContent = "select input";
        } else {
          uploadVideo(plainFiles[0]);
        }
      } else {
        console.error("No file selected or file is undefined.");
      }
    },
  });

  function handleFileSelection() {
    openFilePicker();
  }

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    getNotifications();
    fetchVideos();
  }, []);

  async function uploadVideo(file) {
    showLoading();
    const formData = new FormData();
    formData.append("title", title.current.value);
    formData.append("description", description.current.value);
    formData.append("video", file);
    await generateVideoThumbnails(file, 1)
      .then((thumbnailArray) => {
        formData.append("thumbnail", thumbnailArray[0]);
      })
      .catch((err) => {
        console.error(err);
      });
    axios
      .post(
        "https://just-chill.onrender.com/api/v1/videos/upload-video",
        formData,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        hideLoading();

        if (response.status === 401) {
          logout();
        }
        fetchVideos();
      })
      .catch((error) => {
        console.error("Error uploading video:", error);
        hideLoading();
      });
  }

  const NotificationModal = (props) => (
    <Modal show={props.show} onHide={props.onHide} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          maxHeight: "400px",
          overflowY: "scroll",
          backgroundColor: "#1A1A1A",
        }}
      >
        {notifications.length ? (
          notifications.map((noti, index) => (
            <div
              key={index}
              className="p-2 border-bottom d-flex"
              style={{ color: "#fff" }}
            >
              <Avatar
                alt={noti.users?.userName}
                src={noti.users?.avatar}
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />{" "}
              <strong className="ms-4">@{noti.users?.userName} </strong>
              {"   "}
              {noti.type === "like"
                ? "liked your video."
                : noti.type === "comment"
                ? "commented on your video."
                : "uploaded a video."}
            </div>
          ))
        ) : (
          <div style={{ color: "#fff" }}>No notifications yet.</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <div
      className="container-fluid w-100 d-flex flex-column align-items-center justify-content-start position-relative"
      style={{
        backgroundColor: theme === "dark" ? "#1A1A1A" : "#f9f9f9",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Notifications Icon */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          bottom: "20px",
          cursor: "pointer",
        }}
        onClick={() => setShowNotifications(true)}
      >
        <CircleNotificationsIcon
          fontSize="large"
          sx={{ color: theme === "dark" ? "white" : "black" }}
        />
        {notifications.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              backgroundColor: "red",
              borderRadius: "9999px",
              color: "white",
              fontSize: "10px",
              padding: "2px 6px",
            }}
          >
            {notifications.length}
          </span>
        )}
      </div>

      {/* Header */}
      <header
        className="pb-3 mb-4 border-bottom w-100"
        style={{ borderColor: "#ff0000" }}
      >
        <div className="d-flex align-items-center w-100 flex-wrap">
          <div
            className="d-flex align-items-center mb-2 mb-sm-0"
            style={{ color: theme === "dark" ? "white" : "black" }}
          >
            <NavLink to="profile">
              <img
                className="rounded-circle me-2"
                src={JSON.parse(user).avatar}
                style={{
                  height: "40px",
                  width: "40px",
                  objectFit: "cover",
                }}
              />
            </NavLink>

            <span className="fs-5">{JSON.parse(user).userName}</span>
          </div>

          <div className="d-flex align-items-center mb-2 mb-sm-0 ms-4">
            {/* Theme toggle */}
            <div
              onClick={toggleTheme}
              style={{
                cursor: "pointer",
                backgroundColor: theme === "dark" ? "#444" : "#ccc",
                borderRadius: "20px",
                padding: "5px 10px",
                display: "flex",
                alignItems: "center",
                marginRight: "20px",
                transition: "all 0.3s ease",
              }}
            >
              {theme === "dark" ? (
                <>
                  <Sun color="yellow" size={20} className="me-2" />
                  <span className="text-white">Light</span>
                </>
              ) : (
                <>
                  <Moon color="purple" size={20} className="me-2" />
                  <span className="text-dark">Dark</span>
                </>
              )}
            </div>

            {/* Logout */}
            <span
              className="fs-6 fs-sm-5"
              style={{
                color: "red",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => logout()}
            >
              Logout
            </span>
          </div>
        </div>
      </header>

      {/* Upload Section */}
      <Row className="w-100 mb-5 justify-content-center">
        <Col
          xs={12}
          md={8}
          lg={6}
          className="p-5 rounded-3 align-content-center"
          style={{
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#111",
            borderRadius: "15px",
            boxShadow:
              theme === "dark"
                ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                : "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 className="text-center">Upload Video</h2>
          <div>
            <label
              htmlFor="title"
              className="w-100"
              ref={titleLabel}
              style={{ textAlign: "start" }}
            >
              Title
            </label>

            <input
              ref={title}
              type="text"
              id="title"
              placeholder="Input title"
              className="w-100 form-control mb-3"
              style={{
                backgroundColor: theme === "dark" ? "#222" : "#f5f5f5",
                color: theme === "dark" ? "#fff" : "#000",
                border: "1px solid #ccc",
              }}
            />

            <label
              htmlFor="description"
              ref={descriptionLabel}
              className="w-100"
              style={{ textAlign: "start" }}
            >
              Description
            </label>

            <input
              ref={description}
              type="text"
              id="description"
              placeholder="Input description"
              className="w-100 form-control mb-3"
              style={{
                backgroundColor: theme === "dark" ? "#222" : "#f5f5f5",
                color: theme === "dark" ? "#fff" : "#000",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <p className="text-center">
            Click on the button below to upload videos
          </p>
          <button
            className="btn w-100"
            type="button"
            onClick={() => handleFileSelection()}
            style={{
              borderColor: "#ff0000",
              color: "#ff0000",
              padding: "12px 20px",
              fontWeight: "500",
              backgroundColor: "transparent",
            }}
          >
            Upload Video
          </button>
        </Col>
      </Row>

      {/* Video Tiles */}
      <Row className="w-100">
        {videos.map((items, index) => (
          <Col key={index} xs={12} md={6} lg={4} xl={3} className="mb-4">
            <CommentsProvider>
              <VideoTile key={items._id} items={items} />
            </CommentsProvider>
          </Col>
        ))}
      </Row>

      {/* Footer */}
      <footer
        className="pt-3 mt-4 text-center text-body-secondary border-top"
        style={{ borderColor: "#ff0000", width: "100%" }}
      >
        <span style={{ color: "#ff0000" }}>JustChill © 2025</span>
      </footer>

      {/* Notifications Modal */}
      <NotificationModal
        show={showNotifications}
        onHide={() => setShowNotifications(false)}
      />
    </div>
  );
}
