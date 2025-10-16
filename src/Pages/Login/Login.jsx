import React, { useState } from "react";
import "./Login.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faEye, faEyeSlash, faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "teacher@example.com" && password === "1234") {
      toast.success("Welcome, Teacher!");
      setTimeout(() => navigate("/teacher/dashboard"), 1500);
    } else if (email === "student@example.com" && password === "1234") {
      toast.success("Welcome, Student!");
      setTimeout(() => navigate("/student/dashboard"), 1500);
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="login-body">
      <div className="login-form">
        <h2 className="login-title">Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faUser} />
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
          <hr />

          <div className="google-login">
            <GoogleLogin
              onSuccess={() => {
                toast.success("Google Login Successful!");
                setTimeout(() => navigate("/dashboard"), 1500);
              }}
              onError={() => toast.error("Google Login Failed!")}
            />
          </div>
        </form>
      </div>

      <iframe
        src="https://my.spline.design/r4xbot-glm2ThTI8CPTrAX41n5mkl9V/"
        width="100%"
        height="1100px"
        className="frame"
      ></iframe>

      <ToastContainer />
    </div>
  );
}

export default Login;
