import React from 'react'
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import Topbar from '../global/Topbar';
import { useState } from "react";
import { useEffect } from 'react';
import UserSidebar from '../global/Usersidebar';

export default function UserMainindex() {
    const navigator = useNavigate()

useEffect(()=>{
    const role = localStorage.getItem('role')
    if(!role || role == 'RTO' || role == 'ADMIN'){
        navigator('/')
    } 
},[])
    const [isSidebar, setIsSidebar] = useState(true);
    return (
        <div className="app">
            <UserSidebar isSidebar={isSidebar} />
            <main className="content">
                <Topbar setIsSidebar={setIsSidebar} />
                <Outlet />
            </main>
        </div>
    )
}
