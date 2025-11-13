import React, { useEffect, useState } from "react";
import Header from "../../../../Components/studentHeader/SHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faCalendarAlt, faEnvelope, faIdBadge } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../../Components/loader/Loader";
import api from "../../../../api/axios";
import { Link } from "react-router-dom";
import "./SProfile.css";

export default function SProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const id = localStorage.getItem("id");
      if (!id) {
        console.error("Student ID not found in localStorage");
        return;
      }

      try {
        const response = await api.get(`/student/${id}`);
        const data = response.data?.data;
        setStudent(data);
        setProfileImage(data.photoUrl || null);
      } catch (err) {
        console.error("Failed to load student profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="profile-wrapper">
      <Header />
      <div className="profile-container fade-in">
        <div className="profile-card">
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
                <img src={profileImage} alt="Profile" className="avatar-img" />
              ) : (
                <FontAwesomeIcon icon={faUser} className="default-avatar" />
              )}
              <div className="avatar-overlay">Change Photo</div>
            </label>
          </div>

          <h2 className="student-name">
            {student.firstName} {student.lastName}
          </h2>
          <p className="student-role">{student.role}</p>

          <div className="profile-info">
            <p>
              <FontAwesomeIcon icon={faEnvelope} /> {student.email}
            </p>
            <p>
              <FontAwesomeIcon icon={faCalendarAlt} />{" "}
              {student.birthday
                ? new Date(student.birthday).toLocaleDateString()
                : "Not Provided"}
            </p>
            <p>
              <FontAwesomeIcon icon={faIdBadge} /> ID: {student.id}
            </p>
          </div>

          <Link to="/changepassword" className="btn-primary">
            <FontAwesomeIcon icon={faLock} /> Change Password
          </Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
