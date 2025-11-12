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
import api from "../../../../api/axios";
import "./SDashboard.css";

function SDashboard() {
  const [loading, setLoading] = useState(true);
  const [mainStatus, setMainStatus] = useState("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [report, setReport] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkAttendance = async () => {
      const studentId = localStorage.getItem("id");
      if (!studentId) return;

      try {
        const response = await api.get(`/attendance/${studentId}`);
        const data = response.data?.data;

        if (data) {
          setReport(data);
          const fullName = `${data.studentResponseDto.firstName} ${data.studentResponseDto.lastName}`;
          setStudentName(fullName);
          setIsLocked(true); // Disable new submission
          setSubmitted(true);
        }
      } catch (err) {
        console.log("No attendance record yet for today.");
      }
    };

    checkAttendance();
  }, []);

  const handleMainSelect = (status) => {
    if (isLocked) return;
    setMainStatus(status);
    setReason("");
    setSubmitted(false);
  };

  const handleReasonSelect = (r) => {
    if (isLocked) return;
    setReason(r);
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    const studentId = localStorage.getItem("id");
    if (!studentId) return alert("Student ID not found in localStorage!");

    if (!mainStatus) return alert("Please select Absent or Late first!");
    if (mainStatus === "Absent" && !reason)
      return alert("Please select a reason for being absent!");

    try {
      setSubmitting(true);

      const payload = {
        studentId,
        reason:
          reason === "Sick"
            ? "SICK"
            : reason === "Family Problem"
            ? "FAMILY_MATTER"
            : reason === "Cannot Go"
            ? "CANNOT_GO"
            : "OTHER",
        reasonType: mainStatus.toUpperCase(),
        comment: comment || "",
      };

      const response = await api.post("/attendance", payload);
      const data = response.data?.data;

      if (data?.studentResponseDto) {
        const fullName = `${data.studentResponseDto.firstName} ${data.studentResponseDto.lastName}`;
        setStudentName(fullName);
      }

      setReport(data);
      setSubmitted(true);
      setIsLocked(true);
    } catch (err) {
      console.error("Error submitting attendance:", err);
      alert("Failed to submit attendance. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
            <h3>Welcome, {studentName ? studentName : "Student"}!</h3>
            {!isLocked ? (
              <p>Please report your attendance for today below 👇</p>
            ) : (
              <p>Your attendance for today has already been recorded ✅</p>
            )}
          </div>
        </div>

        {/* Attendance Section */}
        {!isLocked && (
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
                  <input
                    type="text"
                    placeholder="Leave a comment"
                    className="comment-input"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}

        {/* Report card after submit */}
        {submitted && report && (
          <div className="report-card fade-in">
            <div className="report-header">
              <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
              <h3>Attendance Successfully Recorded</h3>
            </div>

            <div className="report-details">
              <p>
                <strong>Name:</strong> {report.studentResponseDto.firstName}{" "}
                {report.studentResponseDto.lastName}
              </p>
              <p>
                <strong>Status:</strong> {report.reasonType}
              </p>
              <p>
                <strong>Reason:</strong> {report.reason}
              </p>
              <p>
                <strong>Comment:</strong>{" "}
                {report.comment ? report.comment : "No comment"}
              </p>
              <p>
                <strong>Date:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="report-footer">
              <p className="success-msg">
                ✅ Successfully reported your{" "}
                <strong>
                  {report.reasonType.toLowerCase()} (
                  {report.reason.replace("_", " ").toLowerCase()})
                </strong>{" "}
                for today.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SDashboard;
