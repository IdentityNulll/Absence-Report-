import React, { useEffect, useState } from "react";
import Sidebar from "../../../../Components/Sidebar/Sidebar";
import Header from "../../../../Components/header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBookOpen,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css";
import api from "../../../../api/axios";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teacherName, setTeacherName] = useState("Teacher");

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [classRes, studentRes] = await Promise.all([
          api.get("/class/all"),
          api.get("/student"),
        ]);

        const classesData = Array.isArray(classRes.data)
          ? classRes.data
          : [];

        const studentsData = Array.isArray(studentRes.data?.data)
          ? studentRes.data.data
          : [];

        setClasses(classesData);
        setStudents(studentsData);

        // ===== ADMIN / TEACHER NAME =====
        const adminId = localStorage.getItem("id");
        if (adminId) {
          const adminRes = await api.get(`/teachers/${adminId}`);
          setTeacherName(
            adminRes.data?.data?.firstName || "Teacher"
          );
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="tdb-loader-container">
        <div className="tdb-loader"></div>
      </div>
    );
  }

  if (error) {
    return <p className="tdb-error">{error}</p>;
  }

  return (
    <div className="tdb-body">
      <Header />
      {/* <Sidebar /> */}

      {/* ========== WELCOME CARD ========== */}
      <div className="tdb-welcome-card tdb-fade-in-right">
        <div className="tdb-welcome-left">
          <div className="tdb-welcome-icon">
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <div>
            <h3>Welcome back, {teacherName}!</h3>
            <p>Here’s an overview of your classes and students.</p>
          </div>
        </div>
      </div>

      {/* ========== STATS ========== */}
      <div className="tdb-stats tdb-fade-in-up">
        <div className="tdb-stats-box">
          <FontAwesomeIcon icon={faBookOpen} />
          <p className="tdb-number">{classes.length}</p>
          <p className="tdb-text">Classes</p>
        </div>

        <div className="tdb-stats-box">
          <FontAwesomeIcon icon={faUsers} />
          <p className="tdb-number">{students.length}</p>
          <p className="tdb-text">Students</p>
        </div>
      </div>

      {/* ========== CLASSES ========== */}
      <div className="tdb-classes-container tdb-fade-in-up">
        <div className="tdb-my-classes">
          <h3>
            <FontAwesomeIcon icon={faBookOpen} /> My Classes
          </h3>

          {classes.map((cls) => (
            <div className="tdb-class-card" key={cls.uuid}>
              <div className="tdb-class-left">
                <div className="tdb-class-icon">
                  {cls.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4>{cls.name}</h4>
                  <p>
                    {cls.students?.length || 0} students
                  </p>
                </div>
              </div>
            </div>
          ))}

          {classes.length === 0 && (
            <p className="tdb-empty">No classes found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
