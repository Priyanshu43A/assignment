import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignupPage from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyEmail />} />

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
