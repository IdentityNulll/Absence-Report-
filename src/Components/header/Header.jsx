import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Sidebar/Sidebar";
import "./Header.css";
import api from "../../api/axios";
import { useState, useEffect } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Header({ adminData }) {
  const [student, setStudent] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const id = localStorage.getItem("id");
  useEffect(() => {
    const fetchStudentImage = async () => {
      try {
        const res = await api.get(`/teachers/${id}`);
        const data = res.data?.data;

        if (data) {
          setStudent(data);

          if (data.photoUrl) {
            // Fetch the image as blob
            const imageRes = await api.get(data.photoUrl, {
              responseType: "blob",
            });
            const imageBlob = imageRes.data;
            const imageObjectUrl = URL.createObjectURL(imageBlob);
            setProfileImage(imageObjectUrl);

            // Save blob URL in memory, NOT in localStorage
            // If you want caching, you must cache the API route, not the blob
          }
        }
      } catch (err) {
        console.error("Failed to fetch student image:", err);
      }
    };

    fetchStudentImage();
  }, []);

  return (
    <header className="admin-header">
      <div className="header-left">
        <Sidebar />
      </div>

      <div className="header-right">
        <Link to="/teacher/notifications" className="notification">
          <FontAwesomeIcon icon={faBell} />
          <sup>8</sup>
        </Link>

        <Link to={`/teacher/${id}`} className="profile-placeholder">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="avatar-img-big"
              style={{ borderRadius: "50%" }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faUser}
              className="default-avatar-big"
              style={{ fontSize: "16px" }}
            />
          )}
        </Link>
      </div>
    </header>
  );
}
