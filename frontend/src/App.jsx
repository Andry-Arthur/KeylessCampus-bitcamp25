import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SerialIdPage from "./components/SerialIdPage";
import { Link, Outlet } from "react-router";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}>
          <Route path="/" element={<Login />} />
          {/* <Route path="/dashboard" element={<NewHelp />} /> */}
        </Route>

        <Route path="/signup" element={<SerialIdPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
