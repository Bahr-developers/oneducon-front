import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

interface ProtectedRouteProps {
	children: React.ReactNode
}

export default function ProtectedRoute({
										   children,
									   }: ProtectedRouteProps) {
	const token = useSelector((state: RootState) => state.auth.token)

	if (!token) {
		return <Navigate to='/' replace />
	}

	return <>{children}</>
}