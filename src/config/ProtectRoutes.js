import { Navigate, Outlet } from "react-router-dom"

const ProtectRoutes = () => {
    const logged = localStorage['userId']
    return logged ? <Outlet /> : <Navigate to="/signUp" />
}

export default ProtectRoutes
