import {Routes, Route} from "react-router-dom";

import React from 'react'
import Home from "../Components/Home/Home";

const Routing = () => {
  return (
    <Routes>
        <Route path='/' element={<Home/>}/>
    </Routes>
  )
}

export default Routing