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
import "./SSidebar.css";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    closeSidebar();
    navigate("/");
  };

  useEffect(() => {
    const fetchStudent = async () => {
      const id = localStorage.getItem("id");
      if (!id) return console.log("no id ");

      setStudentId(id); // ← save it for JSX

      try {
        const response = await api.get(`/student/${id}`);
        setStudent(response.data?.data);
        console.log(response);
      } catch (err) {
        console.error("Failed to fetch student info:", err);
      }
    };

    fetchStudent();
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
            <div className="logo-img1">S</div>
            <div className="logo-text1">
              <h4>
                {student
                  ? `${student.firstName} ${student.lastName}`
                  : "Loading..."}
              </h4>
              <p>{student ? student.role : ""}</p>
            </div>
          </div>
          <button className="close-btn" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <hr style={{ opacity: "0.6" }} />

        <nav className="menu">
          <Link to="/student/dashboard" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faHouse} className="house" />{" "}
            <span>Home</span>
          </Link>
          <Link to={`/student/${studentId}`} onClick={closeSidebar}>
            <FontAwesomeIcon icon={faUser} className="user" />{" "}
            <span>My Profile</span>
          </Link>
          <Link to="/student/schedule" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faCalendar} className="calendar" />{" "}
            <span>Lesson Schedule</span>
          </Link>
          <Link to="/student/notifications" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faBell} className="bell" />{" "}
            <span>Notifications</span>
          </Link>
          <Link to="/student/analytics" onClick={closeSidebar}>
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
