import React, { useState, useEffect } from "react";
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
import { toast } from "react-toastify";

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

  // Fake loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // CHECK ATTENDANCE AUTOMATICALLY
  useEffect(() => {
    const checkAttendance = async () => {
      const studentId = localStorage.getItem("id");
      if (!studentId) return;

      try {
        console.log(`📡 GET /attendance/by-userId/${studentId}`);
        const getRes = await api.get(`/attendance/by-userId/${studentId}`);
        console.log("📥 GET RESPONSE:", res.data);
        if (res.status === 200 && res.data?.data) {
          const data = res.data.data;
          setReport(data);
          setStudentName(
            `${data.studentResponseDto.firstName} ${data.studentResponseDto.lastName}`
          );
          setIsLocked(true);
          setSubmitted(true);
        }
      } catch (err) {
        console.log("❌ No attendance yet");
      }
    };

    checkAttendance();
  }, []);

  // Handle ABSENT/LATE selection
  const handleMainSelect = (status) => {
    if (isLocked) return;
    setMainStatus(status);
    setReason("");
    setSubmitted(false);
  };

  // Handle reason selection
  const handleReasonSelect = (r) => {
    if (isLocked) return;
    setReason(r);
  };

  // SUBMIT ATTENDANCE
  const handleSubmit = async () => {
    const studentId = localStorage.getItem("id");
    if (!studentId) return alert("Student ID missing!");

    if (!mainStatus) return alert("Select Absent or Late first!");

    // Late does NOT need a reason
    if (mainStatus === "Absent" && !reason)
      return toast.error("Select a reason for absence!");

    try {
      setSubmitting(true);

      // Build payload
      const payload = {
        studentId,
        reason:
          mainStatus === "Late"
            ? null
            : reason === "Sick"
            ? "SICK"
            : reason === "Family Problem"
            ? "FAMILY_MATTER"
            : reason === "Cannot Go"
            ? "TRAVELING"
            : "EMERGENCY",

        reasonType: mainStatus.toUpperCase(),

        comment: comment || "No comment",
      };

      const postRes = await api.post("/attendance", payload);

      console.log("📥 POST RESPONSE:", postRes.data);

      // Now re-fetch using GET
      console.log("📡 GET /attendance/" + studentId);
      const getRes = await api.get(`/attendance/by-userId/${studentId}`);

      console.log("📥 RE-FETCH RESPONSE:", getRes.data);

      const data = getRes.data.data;

      setReport(data);
      setStudentName(
        `${data.studentResponseDto.firstName} ${data.studentResponseDto.lastName}`
      );

      setIsLocked(true);
      setSubmitted(true);
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("Failed to submit attendance.");
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
            <h3>Welcome, {studentName || "Student"}!</h3>
            {!isLocked ? (
              <p>Please report your attendance below 👇</p>
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

            {/* Only show reasons if Absent */}
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

            {/* Comment */}
            <input
              type="text"
              className="comment-input"
              placeholder="Leave a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {/* Submit */}
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}

        {/* Report card */}
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

              {report.reasonType === "ABSENT" && (
                <p>
                  <strong>Reason:</strong> {report.reason}
                </p>
              )}

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
                  {report.reason
                    ? report.reason.replace("_", " ").toLowerCase()
                    : "no reason"}
                  )
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
