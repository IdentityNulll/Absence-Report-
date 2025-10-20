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
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [studentName, setStudentName] = useState("Alex Carter");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (status) => {
    setSelected(status);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!selected) return alert("Please select a status first!");
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
      {/* <Sidebar /> */}

      {/* Welcome */}
      <div className="welcome-card fade-in-right">
        <div>
          <h3>Welcome, {studentName}!</h3>
          <p>Please report your attendance for today below 👇</p>
        </div>
      </div>

      {/* Attendance Options */}
      <div className="attendance-container fade-in-up">
        <h3>Attendance Status</h3>
        <div className="attendance-options">
          <button
            className={`attendance-btn ${
              selected === "Sick" ? "active" : ""
            }`}
            onClick={() => handleSelect("Sick")}
          >
            <FontAwesomeIcon icon={faHouseChimneyMedical} /> Sick
          </button>
          <button
            className={`attendance-btn ${
              selected === "Family Problem" ? "active" : ""
            }`}
            onClick={() => handleSelect("Family Problem")}
          >
            <FontAwesomeIcon icon={faUserXmark} /> Family Problem
          </button>
          <button
            className={`attendance-btn ${
              selected === "Late" ? "active" : ""
            }`}
            onClick={() => handleSelect("Late")}
          >
            <FontAwesomeIcon icon={faUserClock} /> Late
          </button>
          <button
            className={`attendance-btn ${
              selected === "Absent" ? "active" : ""
            }`}
            onClick={() => handleSelect("Absent")}
          >
            <FontAwesomeIcon icon={faUserXmark} /> Absent
          </button>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>

        {submitted && (
          <div className="submitted-status fade-in">
            <FontAwesomeIcon icon={faCheckCircle} />
            <p>
              Attendance submitted as <strong>{selected}</strong>. Thank you!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SDashboard;
