import { useEffect, useState } from "react";
import Header from "../../../../Components/header/Header";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../../../api/axios"; 
import "./Schedule.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = ["Period 1", "Period 2", "Period 3", "Period 4", "Period 5", "Period 6"];

const DAY_ENUM = {
  Monday: "MONDAY",
  Tuesday: "TUESDAY",
  Wednesday: "WEDNESDAY",
  Thursday: "THURSDAY",
  Friday: "FRIDAY",
  Saturday: "SATURDAY",
};

const PERIOD_ENUM = {
  "Period 1": "FIRST",
  "Period 2": "SECOND",
  "Period 3": "THIRD",
  "Period 4": "FOURTH",
  "Period 5": "FIFTH",
  "Period 6": "SIXTH",
};

export default function Schedule() {
  const [schedule, setSchedule] = useState({});
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const selectedDay = days[selectedDayIndex];

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await api.get("/lessons");
      const lessons = res.data?.data || [];
      const normalized = {};

      lessons.forEach((l) => {
        const day = Object.keys(DAY_ENUM).find((d) => DAY_ENUM[d] === l.dayOfWeek);
        const period = Object.keys(PERIOD_ENUM).find((p) => PERIOD_ENUM[p] === l.period);
        if (!day || !period) return;

        normalized[day] ??= {};
        normalized[day][period] = {
          id: l.id,
          subject: l.name,
          teacher: l.teacherResponseDto
            ? `${l.teacherResponseDto.firstName} ${l.teacherResponseDto.lastName}`
            : "—",
          className: l.classResponseDto?.name || "—",
        };
      });

      setSchedule(normalized);
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
    }
  };

  return (
    <div className="schedule-page">
      <Header />

      {/* Day selector */}
      <div className="day-selector">
        <button
          onClick={() => setSelectedDayIndex((p) => (p === 0 ? 5 : p - 1))}
          className="arrow-btn"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2>{selectedDay}</h2>
        <button
          onClick={() => setSelectedDayIndex((p) => (p === 5 ? 0 : p + 1))}
          className="arrow-btn"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      {/* Schedule grid */}
      <div className="schedule-grid">
        {periods.map((p) => {
          const lesson = schedule[selectedDay]?.[p];

          return (
            <div key={p} className="lesson-row">
              <div className="period-info">
                <strong>{p}</strong>
              </div>

              <div className="lesson-content1">
                {lesson ? (
                  <div className="lesson-box">
                    <div className="lesson-content">
                      <h4 className="class-name">{lesson.subject}</h4>
                      <p className="class-tag">🧑‍🏫 Teacher — {lesson.teacher}</p> <br />
                      <span className="class-tag">📚 Class — {lesson.className}</span>
                    </div>
                  </div>
                ) : (
                  <span className="empty-slot">— No lesson —</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
