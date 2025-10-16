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

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teacherName, setTeacherName] = useState("Mr. John Doe");

  // Dummy data
  const dummyData = {
    students: [
      { id: 1, name: "Alice Johnson" },
      { id: 2, name: "Mark Lee" },
      { id: 3, name: "Sophia Brown" },
      { id: 4, name: "Daniel Kim" },
    ],
    classes: [
      { id: 1, name: "Mathematics", studentCount: 20 },
      { id: 2, name: "Physics", studentCount: 18 },
      { id: 3, name: "Chemistry", studentCount: 22 },
    ],
  };

  useEffect(() => {
    // Simulate fetching
    const timer = setTimeout(() => {
      setStudents(dummyData.students);
      setClasses(dummyData.classes);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="body">
      <Header />
      {/* <Sidebar /> */}

      {/* Welcome Card */}
      <div className="welcome-card fade-in-right">
        <div className="welcome-left">
          <div className="welcome-icon">
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <div>
            <h3>Welcome back, {teacherName}!</h3>
            <p>Here's an overview of your classes and students.</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats fade-in-left">
        <div className="stats-box item1">
          <FontAwesomeIcon icon={faBookOpen} />
          <p className="number">{classes.length}</p>
          <p className="text">Classes</p>
        </div>
        <div className="stats-box item2">
          <FontAwesomeIcon icon={faUsers} />
          <p className="number">{students.length}</p>
          <p className="text">Students</p>
        </div>
      </div>

      {/* Classes List */}
      <div className="classes-container fade-in-up">
        <div className="my-classes">
          <h3>
            <FontAwesomeIcon icon={faBookOpen} /> My Classes
          </h3>

          {classes.map((cls) => (
            <div className="class-card purple" key={cls.id}>
              <div className="class-left">
                <div className="class-icon">
                  {cls.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4>{cls.name}</h4>
                  <p>{cls.studentCount} students</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
