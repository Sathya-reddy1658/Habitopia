import {Routes, Route} from "react-router-dom";
import React from 'react'
import RegisterPage from "../Components/Auth/RegisterPage";
import LoginPage from "../Components/Auth/LoginPage";
import AuthChecker from "../Components/Auth/AuthChecker";
import Home from '../Components/Home/Home'
import { AuthProvider } from "../Components/contexts/AuthContext";
import CreateHabit from "../Components/NewHabit/CreateHabit";
import Profile from "../Components/Profile/Profile";
import Social from "../Components/social/social";
import GroupHabitPage from "../Components/Home/GroupHabits/GroupHabits"
import DataPage from "../Components/DataViz/DataPage"

const Routing = () => {
  return (
    
    <AuthProvider>

    <Routes>
        <Route path="/" element={<AuthChecker />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/newHabit" element={<CreateHabit/>}/>
        <Route path='/dataViz' element={<DataPage/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/groupHabitInvites" element={<GroupHabitPage />}/>
        <Route path="/social" element={<Social/>}/>
    </Routes>
    </AuthProvider>
  )
}

export default Routing