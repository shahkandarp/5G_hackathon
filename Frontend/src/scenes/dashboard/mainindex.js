import React from 'react'
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../global/Sidebar";
import Topbar from '../global/Topbar';
import { useState } from "react";
import { useEffect } from 'react';



export default function Mainindex() {
    const navigator = useNavigate()

useEffect(()=>{
    const role = localStorage.getItem('role')
    if(!role || role == 'USER' || role == 'ADMIN'){
        navigator('/')
    } 
},[])
    const [isSidebar, setIsSidebar] = useState(true);
    return (
        <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
                <Topbar setIsSidebar={setIsSidebar} />
                <Outlet />
            </main>
        </div>
    )
}
