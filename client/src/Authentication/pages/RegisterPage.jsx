import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
    coverImage: null,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullname, username, email, password, confirmPassword, avatar, coverImage } = formData;

    if (!fullname || !username || !email || !password || !confirmPassword || !avatar || !coverImage) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("fullname", fullname);
    submissionData.append("username", username);
    submissionData.append("email", email);
    submissionData.append("password", password);
    submissionData.append("avatar", avatar);
    submissionData.append("coverImage", coverImage);

    axios
      .post("https://just-chill.onrender.com/api/v1/users/register", submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        setError("Something went wrong. Please try again.");
      });
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        padding: "20px",
      }}
    >
      <div
        className="card shadow p-4"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "20px",
          border: "none",
        }}
      >
        <h2 className="text-center mb-4" style={{ color: "#ff0000" }}>
          Sign Up
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="form-control"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              placeholder="Username"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Email"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Confirm Password"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "14px", color: "#555" }}>
              Avatar
            </label>
            <input
              type="file"
              name="avatar"
              onChange={handleFileChange}
              className="form-control"
              accept="image/*"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "14px", color: "#555" }}>
              Cover Image
            </label>
            <input
              type="file"
              name="coverImage"
              onChange={handleFileChange}
              className="form-control"
              accept="image/*"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-danger w-100"
            style={{
              backgroundColor: "#ff0000",
              border: "none",
              padding: "10px",
              fontSize: "16px",
            }}
          >
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <a href="/" style={{ color: "#ff0000", textDecoration: "none" }}>
              Login
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}
