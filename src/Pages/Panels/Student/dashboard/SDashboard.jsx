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

  const reasonMap = {
    Sick: "SICK",
    "Family Problem": "FAMILY_MATTER",
    "Cannot Go": "TRAVELING",
    Emergency: "EMERGENCY",
    Course: "COURSE",
  };

  // Fake loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Check if student already submitted attendance
  useEffect(() => {
    const checkAttendance = async () => {
      const studentId = localStorage.getItem("id");
      if (!studentId) return;

      try {
        const res = await api.get(`/attendance/by-userId/${studentId}`);

        if (res.status === 200 && res.data?.data) {
          const data = res.data.data;
          // console.log(data);

          setReport(data);
          setStudentName(
            `${data.studentResponseDto.firstName} ${data.studentResponseDto.lastName}`
          );
          setIsLocked(true);
          setSubmitted(true);
        }
      } catch (err) {
        console.log("No attendance found yet");
      }
    };

    checkAttendance();
  }, []);

  // Handle main status (Absent / Late)
  const handleMainSelect = (status) => {
    if (isLocked) return;
    setMainStatus(status);
    setReason(""); // reset sub reason
  };

  // Submit attendance
  const handleSubmit = async () => {
    const studentId = localStorage.getItem("id");
    if (!studentId) return toast.error("Student ID missing!");

    if (!mainStatus) return toast.error("Select Absent or Late!");

    if (mainStatus === "Absent" && !reason)
      return toast.error("Select a reason for absence!");

    const payload = {
      studentId,
      reason: mainStatus === "Late" ? null : reasonMap[reason] || "EMERGENCY",
      reasonType: mainStatus.toUpperCase(), // ABSENT or LATE
      comment: comment || "No comment",
    };

    try {
      setSubmitting(true);

      await api.post("/attendance", payload);

      // Re-fetch report
      const res = await api.get(`/attendance/by-userId/${studentId}`);
      const data = res.data.data;

      setReport(data);
      setStudentName(
        `${data.studentResponseDto.firstName} ${data.studentResponseDto.lastName}`
      );
      setIsLocked(true);
      setSubmitted(true);

      toast.success("Attendance submitted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading screen
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
        {/* Welcome Message */}
        <div className="welcome-card fade-in-right">
          <h3>Welcome, {studentName || "Student"}!</h3>

          {!isLocked ? (
            <p>Please report your attendance below 👇</p>
          ) : (
            <p>Your attendance for today has already been recorded ✅</p>
          )}
        </div>

        {/* Attendance Form */}
        {!isLocked && (
          <div className="attendance-container fade-in-up">
            <h3>Attendance Status</h3>

            {/* Main selection */}
            <div className="attendance-options">
              <button
                onClick={() => handleMainSelect("Absent")}
                className={`attendance-btn ${
                  mainStatus === "Absent" ? "active" : ""
                }`}
              >
                <FontAwesomeIcon icon={faUserXmark} /> Absent
              </button>

              <button
                onClick={() => handleMainSelect("Late")}
                className={`attendance-btn ${
                  mainStatus === "Late" ? "active" : ""
                }`}
              >
                <FontAwesomeIcon icon={faUserClock} /> Late
              </button>
            </div>
            {mainStatus === "Absent" && (
              <div className="reason-options fade-in-up">
                <h4>Select your reason</h4>

                <div className="attendance-options">
                  {[
                    "Sick",
                    "Family Problem",
                    "Cannot Go",
                    "Emergency",
                    "Course",
                  ].map((r) => (
                    <button
                      key={r}
                      onClick={() => setReason(r)}
                      className={`attendance-btn ${
                        reason === r ? "active" : ""
                      }`}
                    >
                      <FontAwesomeIcon icon={faHouseChimneyMedical} /> {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* COMMENT SHOULD SHOW FOR BOTH ABSENT + LATE */}
            {(mainStatus === "Absent" || mainStatus === "Late") && (
              <div className="container-smth">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="comment-input fade-in-up"
                  placeholder={
                    mainStatus === "Late"
                      ? "Reason for being late"
                      : "Leave a comment"
                  }
                />
              </div>
            )}

            {/* Comment for Absent + Late */}

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

        {/* Report Card */}
        {submitted && report && (
          <div className="report-card fade-in">
            <div className="report-header">
              <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
              <h3>Attendance Recorded</h3>
            </div>

            <div className="report-details">
              <p>
                <strong>Name:</strong> {report.studentResponseDto.firstName}{" "}
                {report.studentResponseDto.lastName}
              </p>

              <p>
                <strong>Status:</strong> {report.reason}
              </p>

              <p>
                <strong>Comment:</strong> {report.comment}
              </p>

              <p>
                <strong>Date:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>

            <p className="success-msg">
              Successfully reported your attendance for today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SDashboard;
