import Loader from '@/components/_components/loader'
import { TopNav } from '@/components/dashboard/top-nav'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import {AdminSidebar} from "@/components/dashboard/admin-side-bar.tsx";

export default function AdminDashLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 500) // 2

        return () => clearTimeout(timer)
    }, [])

    if (loading) {
        return <Loader />
    }
    return (
        <div className='w-full flex h-screen'>
            <AdminSidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed(v => !v)}
            />
            <main className='flex-1 overflow-y-auto scroll-hidden relative'>
                <TopNav />
                <main className='p-4 '>
                    <Outlet />
                </main>
            </main>
        </div>
    )
}
