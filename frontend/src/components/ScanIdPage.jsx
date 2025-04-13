import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import "../Login.css";
import Signup from "./Signup";

export default function ScanIdPage() {
  const [serialPage, setSerialPage] = useState(true);
  let navigate = useNavigate();

  const location = useLocation();
  const { serialId } = location.state || {};
  console.log("Serialsjdn ID from location:", serialId);

  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://157.245.244.233:8080/scanid");
    // if (response.status !== 200) {
    //   console.log("Scan ID failed");
    //   return;
    // }
    const data = await response.json();
    if (response.status !== 200) {
      console.log("Scan ID failed");
      return;
    }

    // Simple validation - check if serialId is not empty
    navigate("/signupFinal", {
      state: { RFID: data["RFID"], serialId: serialId },
    });
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
