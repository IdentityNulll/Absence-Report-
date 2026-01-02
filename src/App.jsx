import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Sidebar from "./Components/Sidebar/Sidebar";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Panels/Teacher/Dashboard/Dashboard";
import Profile from "./Pages/Panels/Teacher/profile/Profile";
import ForgotPassword from "./Components/forgotPassword/ForgotPassword";
import Schedule from "./Pages/Panels/Teacher/Schedule/Schedule";
import Notifications from "./Pages/Panels/Teacher/Notifications/Notifications";
import Analytics from "./Pages/Panels/Teacher/Analytics/Analytics";
import SDashboard from "./Pages/Panels/Student/dashboard/SDashboard";
import SProfile from "./Pages/Panels/Student/sProfile/SProfile";
import SNotifications from "./Pages/Panels/Student/sNotifications/SNotifications";
import SSchedule from "./Pages/Panels/Student/sSchedule/SSchedule";
import AdminAnimate from "./Components/Animation/AdminAnimate";
import ChangePassword from "./Components/changePassword/ChangePassword";
import SAnalytics from "./Pages/Panels/Student/analytics/Analytics"

function App() {
  return (
    <div>
      {/* <AdminAnimate /> */}
      <Routes>
        <Route path="/changepassword" element={<ChangePassword />} />

        {/* Teacher */}
        <Route path="/" element={<Login />} />
        <Route path={"/teacher/dashboard"} element={<Dashboard />} />
        <Route path={"/teacher/:id"} element={<Profile />} />
        <Route path={"/forgotpassword"} element={<ForgotPassword />} />
        <Route path={"/teacher/schedule"} element={<Schedule />} />
        <Route path={"/teacher/notifications"} element={<Notifications />} />
        <Route path={"/teacher/analytics"} element={<Analytics />} />

        {/* student */}
        <Route path={"/student/dashboard"} element={<SDashboard />} />
        <Route path={"/student/:id"} element={<SProfile />} />
        <Route path={"/student/notifications"} element={<SNotifications />} />
        <Route path={"/student/schedule"} element={<SSchedule />} />
        <Route path={"/student/analytics"} element={<SAnalytics/>}/>
      </Routes>
    </div>
  );
}

export default App;
