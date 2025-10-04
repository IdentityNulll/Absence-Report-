import React from 'react'
import { Route, Routes } from 'react-router-dom'
import "./App.css"
import Sidebar from './Components/Sidebar/Sidebar'
import Login from './Pages/Login/Login'
import Dashboard from './Pages/Panels/Teacher/Dashboard/Dashboard'

function App() {
  return (
    <div>
      {/* <Login/> */}
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route  path={"/dashboard"} element={<Dashboard/>}/>
      </Routes>
    </div>
  )
}

export default App