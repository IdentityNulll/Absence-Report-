import React, { useEffect, useState } from "react";
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

        const teacherId = localStorage.getItem("id");

        const [lessonRes, studentRes, teacherRes] = await Promise.all([
          api.get("/lessons"),
          api.get("/student"),
          api.get(`/teachers/${teacherId}`),
        ]);

        setTeacherName(teacherRes.data?.data?.firstName || "Teacher");

        const studentsData = Array.isArray(studentRes.data?.data)
          ? studentRes.data.data
          : [];
        setStudents(studentsData);

        const lessons = Array.isArray(lessonRes.data?.data)
          ? lessonRes.data.data
          : [];

        const teacherLessons = lessons.filter(
          (lesson) => lesson.teacherResponseDto?.id == teacherId
        );


        const classMap = new Map();

        teacherLessons.forEach((lesson) => {
          const cls = lesson.classResponseDto;
          if (!cls) return;

          if (!classMap.has(cls.uuid)) {
            classMap.set(cls.uuid, {
              ...cls,
              lessonCount: 1,
            });
          } else {
            classMap.get(cls.uuid).lessonCount++;
          }
        });

        setClasses([...classMap.values()]);

        setClasses([...classMap.values()]);
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

  if (error) return <p className="tdb-error">{error}</p>;

  return (
    <div className="tdb-body">
      <Header />

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
                  <p>{cls.students?.length || 0} students</p>
                </div>
              </div>
            </div>
          ))}

          {classes.length === 0 && (
            <p className="tdb-empty">No classes assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
