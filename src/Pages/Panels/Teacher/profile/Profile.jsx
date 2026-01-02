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
import "./Profile.css";

export default function SProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const id = localStorage.getItem("id");

      try {
        const res = await api.get(`/teacher/${id}`);
        const data = res.data?.data;

        if (data) {
          setStudent(data);

          if (data.photoUrl) {
            const imageRes = await api.get(data.photoUrl, {
              responseType: "blob",
            });
            const imageBlob = imageRes.data;
            const imageObjectUrl = URL.createObjectURL(imageBlob);
            setProfileImage(imageObjectUrl);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const id = localStorage.getItem("id");
    if (!id) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(`/user-photo/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // If upload success → fetch updated user with new photoUrl
      const updated = await api.get(`/student/${id}`);
      const newPhoto = updated.data?.data?.photoUrl;

      if (newPhoto) setProfileImage(newPhoto);
    } catch (err) {
      console.error("Failed to upload photo:", err);
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
