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
  const [profileImage, setProfileImage] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

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
                <input
                  type="file"
                  id="avatarUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="avatarUpload" className="avatar-label">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="avatar-img"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} />
                  )}
                  <div className="avatar-overlay">Change Photo</div>
                </label>
              </div>
              <h2>
                {teacherData.firstName} {teacherData.lastName}
              </h2>
              <p className="profile-role">{teacherData.role}</p>
              <p className="profile-email">{teacherData.mail}</p>

              <Link to="/changepassword" className="btn-primary">
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
