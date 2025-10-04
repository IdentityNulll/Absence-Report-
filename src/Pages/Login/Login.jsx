import React from "react";
import "./Login.css";

function Login() {
  return (
    <div className="body">
      <script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.10.74/build/spline-viewer.js"
      ></script>
      <spline-viewer url="https://prod.spline.design/a6NfPnCxiTXRnhWw/scene.splinecode" height="1050"></spline-viewer>
    </div>
  );
}

export default Login;
