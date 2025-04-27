import { useState } from "react";
import axios from "axios";
import { useLogin } from "../../Context/LoginContext";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post("https://just-chill.onrender.com/api/v1/users/login", {
        email,
        username,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          login(response.data.data.refreshToken,response.data.data.loggedInUser);
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.data.loggedInUser)
          );
          localStorage.setItem(
            "token",
            response.data.data.loggedInUser.refreshToken
          );
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Login failed. Please check your credentials.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center min-vh-100 px-3"
      style={{ backgroundColor: "#000", position: "relative", overflow: "hidden" }}
    >
      {/* Animated Red Background Glow */}
      <div
        className="animated-glow"
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(255,0,0,0.3) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 0,
          animation: "pulse 6s infinite alternate",
          filter: "blur(80px)",
        }}
      ></div>

      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.8; }
        }
        .glow-input:focus {
          box-shadow: 0 0 8px #ff1a1a, 0 0 15px #ff1a1a;
          border-color: #ff1a1a;
          background-color: #111;
          color: #fff;
        }
        .glow-button:hover {
          box-shadow: 0 0 10px #ff1a1a, 0 0 20px #ff1a1a;
          background-color: #e60000;
          color: #fff;
        }
        @media (max-width: 576px) {
          .card {
            padding: 2rem 1rem;
          }
          h1 {
            font-size: 2rem;
          }
          p {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="row w-100 justify-content-center" style={{ zIndex: 1 }}>
        <div className="col-12 col-md-8 col-lg-5">
          <div className="text-center mb-4">
            <h1 className="fw-bold" style={{ color: "#ff1a1a" }}>
              Just Chill
            </h1>
            <p style={{ color: "#aaa" }}>Login to continue</p>
          </div>
          <div
            className="card p-5"
            style={{
              backgroundColor: "#111",
              border: "1px solid #ff1a1a",
              borderRadius: "12px",
              color: "#fff",
              boxShadow: "0 0 20px rgba(255, 26, 26, 0.3)",
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control bg-dark text-light border-danger glow-input"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email" style={{ color: "#aaa" }}>
                  Email address
                </label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control bg-dark text-light border-danger glow-input"
                  id="username"
                  placeholder="your_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label htmlFor="username" style={{ color: "#aaa" }}>
                  Username
                </label>
              </div>

              <div className="form-floating mb-4">
                <input
                  type="password"
                  className="form-control bg-dark text-light border-danger glow-input"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password" style={{ color: "#aaa" }}>
                  Password
                </label>
              </div>

              <button
                type="submit"
                className="btn w-100 py-2 glow-button"
                style={{
                  backgroundColor: "#ff1a1a",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <small style={{ color: "#aaa" }}>
                Don't have an account?{" "}
                <a href="/register" style={{ color: "#ff1a1a", textDecoration: "underline" }}>
                  Register
                </a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
