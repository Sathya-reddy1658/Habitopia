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
import GroupHabitInvites from "../Components/social/GroupHabitInvites";
import IndividualDataViz from "../Components/DataViz/IndividualDataViz";
import FriendDataPage from "../Components/DataViz/friend_datapage";
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
        <Route path="/data-viz/:habitId" element={<IndividualDataViz />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/groupHabitInvites" element={<GroupHabitInvites />}/>
        <Route path="/social" element={<Social/>}/>
        <Route path="/friend-dataviz" element={< FriendDataPage />} />
    </Routes>
    </AuthProvider>
  )
}

export default Routing