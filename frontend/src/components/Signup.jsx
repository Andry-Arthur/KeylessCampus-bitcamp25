import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../Login.css";

export default function Signup() {
  let navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    userName: false,
    password: false,
    confirmPassword: false,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSuccessfulSignup();

    // Uncomment for validation
    // const newErrors = {
    //   fullName: fullName.trim() === "",
    //   email: !/^\S+@\S+\.\S+$/.test(email),
    //   username: username.trim() === "",
    //   password: password.length < 6,
    //   confirmPassword: password !== confirmPassword
    // };
    //
    // setErrors(newErrors);
    //
    // if (!Object.values(newErrors).includes(true)) {
    //   handleSuccessfulSignup();
    // }
  };

  const handleSuccessfulSignup = () => {
    setIsAnimating(true);

    // Show welcome message after a short delay
    setTimeout(() => {
      setShowWelcome(true);

      // Redirect after animation completes
      setTimeout(() => {
        // Replace with actual redirect
        navigate("/login");
        console.log("Redirecting to login page...");
        // window.location.href = "/login";
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
          <h2>Account Created!</h2>
          <p>Redirecting to login...</p>
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

      {/* Signup container */}
      <div
        className={`login-container signup-container ${
          isAnimating ? "fade-out" : ""
        }`}
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
        <div className="login-header">
          <h1>Signup</h1>
          <p>Please fill in your details to sign up</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`form-group ${errors.username ? "error" : ""}`}>
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              id="userName"
              placeholder="Enter your user name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <div className="error-message">Please enter your username</div>
          </div>

          <div className={`form-group ${errors.password ? "error" : ""}`}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="error-message">
              Password must be at least 6 characters
            </div>
          </div>
          <div
            className={`form-group ${errors.confirmPassword ? "error" : ""}`}
          >
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="error-message">Passwords do not match</div>
          </div>
          <div className="remember-me">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">I agree to the Terms & Conditions</label>
          </div>
          <button type="submit" className="login-button">
            Create Account
          </button>
        </form>

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
    </div>
  );
}
