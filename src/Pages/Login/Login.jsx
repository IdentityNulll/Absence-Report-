import React, { useState } from "react";
import "./Login.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faEye, faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    console.log(password);
    toast.success("Login Successful!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };
  return (
    <div className="body">
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
            <FontAwesomeIcon icon={faUser}/>
          </div>

          <div className="input-group">
            
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faEye}/>
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
      <script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.10.74/build/spline-viewer.js"
      ></script>
      <iframe
        src="https://my.spline.design/r4xbot-glm2ThTI8CPTrAX41n5mkl9V/"
        frameborder="0"
        width="100%"
        height="1100px"
        className="frame"
      ></iframe>

      <ToastContainer />
    </div>
  );
}

export default Login;
