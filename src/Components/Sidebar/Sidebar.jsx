import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faSignOutAlt,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  faUser,
  faCalendar,
  faBell,
  faHouse,
} from "@fortawesome/free-regular-svg-icons";
import "./Sidebar.css";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    closeSidebar();
    navigate("/");
  };
  const id = localStorage.getItem("id");
  useEffect(() => {
    const fetchStudentImage = async () => {
      try {
        const res = await api.get(`/teachers/${id}`);
        const data = res.data?.data;
        console.log(res)

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
        console.error("Failed to fetch teacher image:", err);
      }
    };

    fetchStudentImage();
  }, []);

  return (
    <>
      {!isOpen && (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo">
          <div className="logo-text">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="avatar-img-big"
                style={{ borderRadius: "50%", width: "30%" }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                className="default-avatar-big"
                style={{ fontSize: "16px" }}
              />
            )}
            <div className="logo-text1">
              <h4>
                {student
                  ? `${student.firstName}`
                  : "Loading..."}
              </h4>
            </div>
          </div>
          <button className="close-btn" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <hr style={{ opacity: "0.6" }} />

        <nav className="menu">
          <Link to="/teacher/dashboard" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faHouse} className="house" />{" "}
            <span>Home</span>
          </Link>
          <Link to={`/teacher/${id}`} onClick={closeSidebar}>
            <FontAwesomeIcon icon={faUser} className="user" />{" "}
            <span>My Profile</span>
          </Link>
          <Link to="/teacher/schedule" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faCalendar} className="calendar" />{" "}
            <span>Lesson Schedule</span>
          </Link>
          <Link to="/teacher/notifications" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faBell} className="bell" />{" "}
            <span>Notifications</span>
          </Link>
          <Link to="/teacher/analytics" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faChartLine} className="analytics" />{" "}
            <span>Analytics</span>
          </Link>
        </nav>

        <hr style={{ opacity: "0.6", margin: "20px" }} />

        <ThemeSwitcher />

        <div className="logout">
          <button onClick={handleLogout} className="logout-btn">
            <FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {isOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </>
  );
}

export default Sidebar;
