import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../components/Home";
import SignUp from "../components/SignUp";
import Login from '../components/Login'
import Main from '../components/Main'
import Chat from "../components/Chat";
import ProtectRoutes from "./ProtectRoutes";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="" element={<Home />} />
                <Route path="signUp" element={<SignUp />} />
                <Route path="login" element={<Login />} />
                <Route element={<ProtectRoutes />}>
                    <Route path="main" element={<Main />} >
                        <Route path="chat" element={<Chat />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;