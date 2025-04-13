import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../Login.css";

export default function Login() {
  let navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [errors, setErrors] = useState({
    username: false,
    password: false,
    roomNumber: false,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const roomOptions = [
    "Select Room Number",
    "Room 101",
    "Room 102",
    "Room 103",
    "Room 201",
    "Room 202",
    "Room 203",
    "Room 301",
    "Room 302",
    "Room 303",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSuccessfulLogin();

    // const newErrors = {
    //   username: username.trim() === "",
    //   password: password.length < 6,
    // };

    // setErrors(newErrors);

    // if (!newErrors.username && !newErrors.password) {
    //   handleSuccessfulLogin();
    // }
  };

  const handleSuccessfulLogin = () => {
    setIsAnimating(true);

    // Show welcome message after a short delay
    setTimeout(() => {
      setShowWelcome(true);

      // Redirect after animation completes
      setTimeout(() => {
        // Replace with actual redirect
        navigate("/signup");
        console.log("Redirecting to dashboard...");
        // window.location.href = "/dashboard";
      }, 2500);
    }, 200);
  };

  return (
    <div className="app-container">
      {/* Background gradient */}
      <div className="site-background"></div>

      {/* Welcome message */}
      {isAnimating && (
        <div className={`welcome-message ${showWelcome ? "show" : ""}`}>
          <h2>Welcome</h2>
          <p>Redirecting to your dashboard...</p>
        </div>
      )}

      {/* Door animation */}
      {isAnimating && (
        <div className="door-container">
          <div className={`door-left ${showWelcome ? "open" : ""}`}>
            <div className="door-handle-left"></div>
          </div>
          <div className={`door-right ${showWelcome ? "open" : ""}`}>
            <div className="door-handle-right"></div>
          </div>
        </div>
      )}

      {/* Login container */}
      <div className={`login-container ${isAnimating ? "fade-out" : ""}`}>
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`form-group ${errors.roomNumber ? "error" : ""}`}>
            <select
              id="roomNumber"
              value={roomNumber}
              onChange={(e) => {
                setRoomNumber(e.target.value);
                setErrors({ ...errors, roomNumber: false });
              }}
              className="select-dropdown"
            >
              {roomOptions.map((room, index) => (
                <option key={index} value={room}>
                  {room}
                </option>
              ))}
            </select>
            <div className="error-message">Please select a room number</div>
          </div>

          <div className={`form-group ${errors.username ? "error" : ""}`}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="error-message">Please enter a valid username</div>
          </div>

          <div className={`form-group ${errors.password ? "error" : ""}`}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="error-message">
              Password must be at least 6 characters
            </div>
          </div>

          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <a href="#">Forgot Password?</a> |{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}
