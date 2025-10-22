import React, { useState, useEffect } from "react";
import Sidebar from "../../../../Components/Sidebar/Sidebar";
import Header from "../../../../Components/studentHeader/SHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faUserClock,
  faUserXmark,
  faHouseChimneyMedical,
} from "@fortawesome/free-solid-svg-icons";
import "./SDashboard.css";

function SDashboard() {
  const [loading, setLoading] = useState(true);
  const [mainStatus, setMainStatus] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [studentName, setStudentName] = useState("Alex Carter");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleMainSelect = (status) => {
    setMainStatus(status);
    setReason("");
    setSubmitted(false);
  };

  const handleReasonSelect = (r) => {
    setReason(r);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!mainStatus) return alert("Please select Absent or Late first!");
    if (mainStatus === "Absent" && !reason)
      return alert("Please select a reason for being absent!");
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="body">
        <Header />
      <div className="container">

        {/* Welcome */}
        <div className="welcome-card fade-in-right">
          <div>
            <h3>Welcome, {studentName}!</h3>
            <p>Please report your attendance for today below 👇</p>
          </div>
        </div>

        {/* Attendance Section */}
        <div className="attendance-container fade-in-up">
          <h3>Attendance Status</h3>

          {/* Main Options */}
          <div className="attendance-options">
            <button
              className={`attendance-btn ${
                mainStatus === "Absent" ? "active" : ""
              }`}
              onClick={() => handleMainSelect("Absent")}
            >
              <FontAwesomeIcon icon={faUserXmark} /> Absent
            </button>
            <button
              className={`attendance-btn ${
                mainStatus === "Late" ? "active" : ""
              }`}
              onClick={() => handleMainSelect("Late")}
            >
              <FontAwesomeIcon icon={faUserClock} /> Late
            </button>
          </div>

          {/* Show reasons only if Absent */}
          {mainStatus === "Absent" && (
            <div className="reason-options fade-in-up">
              <h4>Select your reason</h4>
              <div className="attendance-options">
                <button
                  className={`attendance-btn ${
                    reason === "Sick" ? "active" : ""
                  }`}
                  onClick={() => handleReasonSelect("Sick")}
                >
                  <FontAwesomeIcon icon={faHouseChimneyMedical} /> Sick
                </button>
                <button
                  className={`attendance-btn ${
                    reason === "Family Problem" ? "active" : ""
                  }`}
                  onClick={() => handleReasonSelect("Family Problem")}
                >
                  <FontAwesomeIcon icon={faUserXmark} /> Family Problem
                </button>
                <button
                  className={`attendance-btn ${
                    reason === "Cannot Go" ? "active" : ""
                  }`}
                  onClick={() => handleReasonSelect("Cannot Go")}
                >
                  <FontAwesomeIcon icon={faUserXmark} /> Cannot Go
                </button>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>

          {/* Submitted result */}
          {submitted && (
            <div className="submitted-status fade-in">
              <FontAwesomeIcon icon={faCheckCircle} />
              <p>
                Attendance submitted as{" "}
                <strong>
                  {mainStatus}
                  {reason ? ` (${reason})` : ""}
                </strong>
                . Thank you!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SDashboard;
