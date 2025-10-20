import React, { useState, useEffect } from "react";
import Header from "../../../../Components/studentHeader/SHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SProfile.css";
import Loader from "../../../../Components/loader/Loader";
import { Link } from "react-router-dom";

export default function Profile() {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const dummyTeacher = {
    firstName: "Emily",
    lastName: "Brown",
    mail: "emily@academy.edu",
    role: "Student",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTeacherData(dummyTeacher);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="profile-wrapper">
      <Header />
      <div className="profile">
        <div className="profile-container">
          {loading ? (
            <Loader />
          ) : (
            <div className="profile-content">
              <div className="profile-avatar">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <h2>
                {teacherData.firstName} {teacherData.lastName}
              </h2>
              <p className="profile-role">{teacherData.role}</p>
              <p className="profile-email">{teacherData.mail}</p>

              <Link to="/forgotpassword" className="btn-primary">
                <FontAwesomeIcon icon={faLock} /> Change Password
              </Link>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
