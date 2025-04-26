import { Col, Row } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";

export default function CommentSection(props) {
  return (
    <div
      className="rounded m-2 p-3 shadow-sm"
      style={{
        backgroundColor: "#1a1a1a",
        color: "#fff",
        transition: "all 0.4s ease",
        cursor: "pointer",
        border: "1px solid rgba(255, 0, 0, 0.7)",
        boxShadow: "0 2px 6px rgba(255, 0, 0, 0.2)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(255, 0, 0, 0.5)";
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(255, 0, 0, 0.2)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <div className="d-flex align-items-center">
        <Avatar
          alt={props.owner.userName}
          src={props.owner.avatar}
          style={{
            border: "2px solid #ff0000",
            width: "45px",
            height: "45px",
          }}
        />

        <div className="d-flex flex-column ms-3">
          <p
            style={{
              fontWeight: "700",
              marginBottom: "4px",
              fontSize: "1.1rem",
              color: "#ff4d4f",
              letterSpacing: "0.5px",
            }}
          >
            @{props.owner.userName}
          </p>
          <p
            style={{
              marginBottom: "0",
              fontSize: "0.95rem",
              color: "#bbb",
              lineHeight: "1.4",
            }}
          >
            {props.content}
          </p>
        </div>

        {/* Like Button */}
        <div className="ms-auto d-flex align-items-center">
          <button
            style={{
              background: "none",
              border: "none",
              color: "#ff4d4f",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              transition: "transform 0.2s ease, color 0.2s ease",
            }}
            onClick={props.onLike}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.2)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            ❤️
            <span className="ms-1" style={{ fontSize: "1rem" }}>
              {props.likesCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
