import React, { useEffect, useState, memo } from "react";
import "./Login.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faEye, faEyeSlash, faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      if (role === "STUDENT") navigate("/student/dashboard");
      else if (role === "TEACHER") navigate("/teacher/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    
    try {
      const response = await api.post("/auth/login", {
        mail: email,
        password,
      });

      console.log(response.data);
      if (response.data.data?.currentUserId) {
        localStorage.setItem("id", response.data.data?.currentUserId);
      } else {
        console.log("Id error");
      }
      if (response.data.data?.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("role", response.data.data.role);

        toast.success("Login Successful!");
        setTimeout(() => {
          if (response.data.data.role === "STUDENT")
            navigate("/student/dashboard");
          else if (response.data.data.role === "TEACHER")
            navigate("/teacher/dashboard");
        }, 1500);
      } else {
        toast.error("Invalid response from server.");
      }
    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        toast.error(
          error.response.data.password ||
            error.response.data.message ||
            "Login failed"
        );
      } else {
        toast.error("Incorrect Email or Password");
      }

      setPassword("");
      setEmail("");
    }
  };

  return (
    <div className="login-body">
      <div className="login-form">
        <h2 className="login-title">Welcome Back</h2>
        <form onSubmit={handleLogin}>
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

      {/* {window.innerWidth > 700 && <SplineFrame />} */}

      <ToastContainer />
    </div>
  );
}

export default Login;
