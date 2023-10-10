import React, { useEffect } from 'react'
import Login from "../components/Login/Login"
import {useSelector} from "react-redux"
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate()
  const {isAuthenticated} = useSelector((state)=>state.user)

  useEffect(()=>{
    console.log("Login page LoginPage.jsx")

    if(isAuthenticated === true){
      navigate("/");
    }
  },[])
  // Only One Time

  return (
    <div>
        <Login/>
    </div>
  )
}

export default LoginPage