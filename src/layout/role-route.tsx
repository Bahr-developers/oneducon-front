import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import type { UserRole } from '@/store/auth-slice'

interface RoleRouteProps {
    children: React.ReactNode
    allowedRoles: UserRole[]
}

export default function RoleRoute({
                                      children,
                                      allowedRoles,
                                  }: RoleRouteProps) {
    const role = useSelector((state: RootState) => state.auth.role)

    if (!role) {
        return <Navigate to='/' replace />
    }

    if (!allowedRoles.includes(role)) {
        if (role === 'STORE') {
            return <Navigate to='/dashboard' replace />
        }

        if (role === 'ADMIN') {
            return <Navigate to='/user/dashboard' replace />
        }
    }

    return <>{children}</>
}