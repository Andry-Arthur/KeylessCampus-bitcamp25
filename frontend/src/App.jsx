import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SerialIdPage from "./components/SerialIdPage";

import { Link, Outlet } from "react-router";
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./components/Dashboard";
import ScanIdPage from "./components/ScanIdPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="/" element={<Login />} />
          {/* <Route path="/dashboard" element={<NewHelp />} /> */}
        </Route>

        <Route path="/signup" element={<SerialIdPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/scanId" element={<ScanIdPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
