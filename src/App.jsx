import React from 'react'
import { Route, Routes } from 'react-router-dom'
import "./App.css"
import Sidebar from './Components/Sidebar/Sidebar'
import Login from './Pages/Login/Login'
import Dashboard from './Pages/Panels/Teacher/Dashboard/Dashboard'
import Profile from './Pages/Panels/Teacher/profile/Profile'
import ForgotPassword from './Components/forgotPassword/ForgotPassword'

function App() {
  return (
    <div>
      {/* <Login/> */}
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route  path={"/teacher/dashboard"} element={<Dashboard/>}/>
        <Route path={"/teacher/:id"} element={<Profile/>}/>
        <Route path={"/forgotpassword"} element={<ForgotPassword/>}/>
      </Routes>
    </div>
  )
}

export default App