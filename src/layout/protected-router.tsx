import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuth = Boolean(localStorage.getItem("accessToken")) || Boolean(localStorage.getItem("refreshToken"))

    return isAuth ? <>{children}</> : <Navigate to="/" replace />
}
