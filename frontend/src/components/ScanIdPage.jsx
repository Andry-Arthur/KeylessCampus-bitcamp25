import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../Login.css";
import Signup from "./Signup";

export default function ScanIdPage() {
  const [serialPage, setSerialPage] = useState(true);
  let navigate = useNavigate();

  const [serialId, setSerialId] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://157.245.244.233:8080/scanid");
    const data = await response.json();
    console.log("Response from server:", data["RFID"]);

    // Simple validation - check if serialId is not empty
    navigate("/login", { state: { rfID: data["RFID"] } });
  };

  return (
    <div className="app-container">
      {/* Background gradient */}
      <div className="site-background"></div>

      {/* Serial ID container */}

      {serialPage && (
        <div
          className="login-container"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="dashboard-logo">
            <div
              style={{
                width: "140px",
                height: "140px",

                borderRadius: "50%",
                backgroundImage: "url('/public/KeylessCampus.png')",
                backgroundSize: "80%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#efdfc2",
              }}
            ></div>
          </div>

          <div>
            <button
              type="text"
              id="serialId"
              placeholder="Enter your serial ID"
              value={serialId}
              onClick={handleSubmit}
              style={{ marginTop: "20px" }}
            >
              Scan Your ID
            </button>
          </div>

          <div className="login-footer" style={{ color: "#121212" }}>
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Sign In
            </a>
          </div>
        </div>
      )}
      {!serialPage && <Signup />}
    </div>
  );
}
