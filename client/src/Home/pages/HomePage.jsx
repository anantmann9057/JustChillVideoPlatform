import { Col, Row } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
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
export default function HomePage(props) {
  const { videos, fetchVideos } = useVideos();
  const { user, logout } = useLogin();
  const { showLoading, hideLoading } = useLoading();
  const title = useRef(null);
  const description = useRef(null);
  const titleLabel = useRef(null);
  const descriptionLabel = useRef(null);
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
          titleLabel.current.textContent = 'select input'
        } else if (!description.current.value) {
          console.log("no value");
          descriptionLabel.current.textContent = 'select input'

        } else {
          uploadVideo(plainFiles[0]);
        }
        console.log(title.current.value);
      } else {
        console.error("No file selected or file is undefined.");
      }
    },
  });

  function handleFileSelection() {
    openFilePicker();
  }

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/notifications/get-notification", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setNotifications(res.data.data);
      })
      .catch((err) => console.log(err));
    fetchVideos();
  }, []);

  async function uploadVideo(file) {
    showLoading();
    const formData = new FormData();
    formData.append("title", title.current.value);
    formData.append("description",description.current.value);
    formData.append("video", file);
    await generateVideoThumbnails(file, 1)
      .then((thumbnailArray) => {
        formData.append("thumbnail", thumbnailArray[0]);
      })
      .catch((err) => {
        console.error(err);
      });
    axios
      .post("http://localhost:3000/api/v1/videos/upload-video", formData, {
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 401) {
          logout();
        }
        fetchVideos();
        hideLoading();
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
              />
              <strong className="ms-4">@{noti.users?.userName} </strong>
              {"  "}
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
        backgroundColor: "#1A1A1A",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          cursor: "pointer",
        }}
        onClick={() => setShowNotifications(true)}
      >
        <CircleNotificationsIcon fontSize="large" sx={{ color: "white" }} />
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

      <header
        className="pb-3 mb-4 border-bottom w-100"
        style={{ borderColor: "#ff0000" }}
      >
        <div className="d-flex align-items-center w-100 justify-content-between">
          <div className="d-flex align-items-center text-white">
            <img
              className="rounded-circle me-2"
              src={JSON.parse(user).avatar}
              style={{ height: "50px", width: "50px", objectFit: "cover" }}
            />
            <span className="fs-4 text-white">{JSON.parse(user).userName}</span>
            <span
              className="fs-4 ms-4"
              style={{
                color: "red",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                logout();
              }}
            >
              Logout
            </span>
          </div>
        </div>
      </header>

      <div className="row w-100 mb-5 justify-content-center">
        <div
          className="col-12 col-md-8 col-lg-6 p-5 text-bg-dark rounded-3 align-content-center"
          style={{
            backgroundColor: "#333",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 className="text-white text-center">Upload Video</h2>
          <div>
            <label
              htmlFor="title"
              className="w-100"
              ref={titleLabel}
              style={{
                textAlign: "start",
              }}
            >
              Title
            </label>

            <input
              ref={title}
              type="text"
              id="title"
              placeholder="Input title"
              className=" w-100"
            ></input>

            <label
              htmlFor="description"
              ref={descriptionLabel}
              className="w-100"
              style={{
                textAlign: "start",
              }}
            >
              Description
            </label>

            <input
              ref={description}
              type="text"
              id="description"
              placeholder="Input Description"
              className="btn-outline-danger w-100"
            ></input>
          </div>
          <p className="text-white text-center">
            Click on the button below to upload videos
          </p>
          <button
            className="btn btn-outline-danger w-100"
            type="button"
            onClick={() => handleFileSelection()}
            style={{
              borderColor: "#ff0000",
              color: "#ff0000",
              padding: "12px 20px",
              fontWeight: "500",
            }}
          >
            Upload Video
          </button>
        </div>
      </div>

      <div className="row w-100">
        {videos.map((items, index) => (
          <div key={index} className="col-md-6 col-lg- col-xl-3 col-xs-6 mb-4">
            <CommentsProvider>
              <VideoTile key={items._id} items={items} />
            </CommentsProvider>
          </div>
        ))}
      </div>

      <footer
        className="pt-3 mt-4 text-center text-body-secondary border-top"
        style={{ borderColor: "#ff0000", width: "100%" }}
      >
        <span style={{ color: "#ff0000" }}>JustChill © 2025</span>
      </footer>

      <NotificationModal
        show={showNotifications}
        onHide={() => setShowNotifications(false)}
      />
    </div>
  );
}
