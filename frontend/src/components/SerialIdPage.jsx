import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../Login.css";
import Signup from "./Signup";

export default function SerialIdPage() {
  const [serialPage, setSerialPage] = useState(true);
  let navigate = useNavigate();

  const [serialId, setSerialId] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation - check if serialId is not empty
    if (serialId.trim() === "") {
      setError(true);
      return;
    }

    // If valid, navigate directly to signup page
    navigate("/signup", { state: { serialId: serialId } });
    setSerialPage(false);
    console.log("Redirecting to signup page with serialId:", serialId);
  };

  return (
    <div className="app-container">
      {/* Background gradient */}
      <div className="site-background"></div>

      {/* Serial ID container */}
      {serialPage && (
        <div className="login-container">
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
          <div className="login-header">
            <h1>Enter Serial ID</h1>
            <p>Please enter your device serial identification number</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={`form-group ${error ? "error" : ""}`}>
              <label htmlFor="serialId">Serial ID</label>
              <input
                type="text"
                id="serialId"
                placeholder="Enter your serial ID"
                value={serialId}
                onChange={(e) => {
                  setSerialId(e.target.value);
                  setError(false);
                }}
              />
              <div className="error-message">
                Please enter a valid serial ID
              </div>
            </div>

            <button type="submit" className="login-button">
              Continue to Signup
            </button>
          </form>
        </div>
      )}
      {!serialPage && <Signup />}
    </div>
  );
}
