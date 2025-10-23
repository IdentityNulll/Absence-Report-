import React, { useState, useEffect } from "react";
import "./Notifications.css";
import Header from "../../../../Components/header/Header";
import Loader from "../../../../Components/loader/Loader";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
  });

  // Simulate fetch with dummy data
  useEffect(() => {
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          title: "Class Reminder",
          message: "Your Math class starts at 10:00 AM.",
        },
        {
          id: 2,
          title: "Exam Update",
          message: "Physics exam has been postponed to Friday.",
        },
        {
          id: 3,
          title: "Holiday Notice",
          message: "School will be closed next Monday.",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);


  return (
    <div className="notifications-page">
      <Header />

      <div className="container12">
        <div className="notifications-container">
          <div className="notifications-header">
            <h2 className="page-title">Notifications</h2>
          </div>

          <div className="notifications-list-card">
            {loading ? (
              <Loader />
            ) : notifications.length === 0 ? (
              <p className="empty-text">No notifications yet</p>
            ) : (
              notifications.map((n, index) => (
                <div key={n.id || index} className="notification-card">
                  <div className="notification-content">
                    <h4>{n.title}</h4>
                    {n.message && <p>{n.message}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Create Notification</h3>

            <input
              type="text"
              placeholder="Title"
              value={newNotification.title}
              onChange={(e) =>
                setNewNotification({
                  ...newNotification,
                  title: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Message"
              value={newNotification.message}
              onChange={(e) =>
                setNewNotification({
                  ...newNotification,
                  message: e.target.value,
                })
              }
            ></textarea>

            <div className="popup-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button className="save-btn" onClick={handleCreate}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
