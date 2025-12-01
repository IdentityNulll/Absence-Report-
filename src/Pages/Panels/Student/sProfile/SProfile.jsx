import React, { useEffect, useState } from "react";
import Header from "../../../../Components/studentHeader/SHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faCalendarAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
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

        if (data) {
          setStudent(data);
          setProfileImage(data.photoUrl || null);
        }
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

  if (loading) return <Loader />;
  if (!student) return <p className="error">Failed to load profile.</p>;

  return (
    <div className="profile-wrapper">
      <Header />

      <div className="profile-page">
        <div className="profile-card-full">
          <div className="profile-avatar-big">
            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            <label htmlFor="avatarUpload" className="avatar-label-big">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="avatar-img-big"
                />
              ) : (
                <FontAwesomeIcon icon={faUser} className="default-avatar-big" />
              )}
              <div className="avatar-overlay-big">Change Photo</div>
            </label>
          </div>

          <h1 className="profile-name-big">
            {student.firstName} {student.lastName}
          </h1>

          <p className="profile-role-big">{student.role}</p>

          <div className="profile-info-box">
            <div className="info-row">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>{student.email}</span>
            </div>

            <div className="info-row">
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span>
                {student.birthday
                  ? new Date(student.birthday).toLocaleDateString()
                  : "Not Provided"}
              </span>
            </div>
          </div>

          <Link to="/changepassword" className="btn-primary-big">
            <FontAwesomeIcon icon={faLock} /> Change Password
          </Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
