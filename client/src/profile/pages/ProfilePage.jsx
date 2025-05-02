import { useLogin } from "../../Context/LoginContext";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../Context/ThemeContext";
import Avatar from "@mui/material/Avatar";
import { useVideos } from "../../Context/VideosContext";
import { CommentsProvider } from "../../Context/CommentsContext";
import VideoTileProfile from "../elements/VideoTileProfile";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, logout, getUserDetails, updateBio } = useLogin();
  const { userVideos, getUserVideos } = useVideos();

  // Setting up the state to handle bio editing
  const [bio, setBio] = useState(user.bio || "No bio available.");
  const [isEditing, setIsEditing] = useState(false);

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const saveBio = () => {
    // Add functionality here to save bio to your backend
    updateBio(bio);
  };

  useEffect(() => {
    getUserVideos();
    getUserDetails();
  }, []);

  return (
    <div
      className="container-fluid d-flex flex-column align-items-center"
      style={{
        backgroundColor: theme === "dark" ? "#1A1A1A" : "#f9f9f9",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Profile Card */}
      <div
        className="card w-100 w-md-75 p-4 mb-5"
        style={{
          backgroundImage: `url("https://static.vecteezy.com/system/resources/previews/008/629/549/non_2x/abstract-banner-template-with-dummy-text-for-web-design-landing-page-background-etc-free-vector.jpg")`,
          backgroundColor: theme === "dark" ? "#333" : "#fff",
          color: theme === "dark" ? "#fff" : "#111",
          borderRadius: "15px",

          boxShadow:
            theme === "dark"
              ? "0 4px 12px rgba(0, 0, 0, 0.5)"
              : "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Avatar and Username Below the Avatar */}
        <div className="d-flex flex-column align-items-center mb-3">
          <Avatar
            alt={user.userName}
            src={JSON.parse(user).avatar}
            style={{
              width: "120px", // Increased avatar size
              height: "120px", // Increased avatar size
              objectFit: "cover",
              borderRadius: "50%",
              border: "2px solid #ff0000",
            }}
          />
          <div className="mt-3 text-center" st>
            <h4 style={{ color: theme === "dark" ? "white" : "black" }}>
              {JSON.parse(user).userName}
            </h4>
            <p style={{ color: theme === "dark" ? "gray" : "#555" }}>
              {JSON.parse(user).email}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label
            htmlFor="bio"
            className="form-label"
            style={{ color: theme === "dark" ? "#ddd" : "#333" }}
          >
            Bio
          </label>
          {isEditing ? (
            <div>
              <textarea
                id="bio"
                value={bio}
                onChange={handleBioChange}
                rows="4"
                className="form-control"
                style={{
                  backgroundColor: theme === "dark" ? "#222" : "#f5f5f5",
                  color: theme === "dark" ? "#fff" : "#000",
                  borderColor: "#ccc",
                }}
              />
              <button
                onClick={saveBio}
                className="btn btn-outline-danger mt-2"
                style={{
                  color: "#ff0000",
                  borderColor: "#ff0000",
                  backgroundColor: "transparent",
                }}
              >
                Save Bio
              </button>
            </div>
          ) : (
            <p style={{ color: theme === "dark" ? "#ddd" : "#555" }}>{bio}</p>
          )}
        </div>

        {/* Edit Bio Button */}
        <div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-outline-danger"
            style={{
              color: "#ff0000",
              borderColor: "#ff0000",
              backgroundColor: "transparent",
            }}
          >
            {isEditing ? "Cancel" : "Edit Bio"}
          </button>
        </div>
      </div>

      {/* Videos Section */}
      <div className="row w-100">
        {userVideos.map((items, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
            <CommentsProvider>
              <VideoTileProfile key={items._id} items={items} />
            </CommentsProvider>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="btn btn-danger mt-3"
        style={{
          width: "200px",
          backgroundColor: "#ff0000",
          borderColor: "#ff0000",
          color: "#fff",
          padding: "12px 20px",
        }}
      >
        Logout
      </button>
    </div>
  );
}
