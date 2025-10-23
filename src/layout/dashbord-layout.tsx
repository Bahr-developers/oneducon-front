import Loader from "@/components/_components/loader";
import { AppSidebar } from "@/components/dashboard/side-bar"
import { TopNav } from "@/components/dashboard/top-nav";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Bu yerda API yoki boshqa ishlar bo‘lishi mumkin
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500); // 2

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loader />;
    }
    return (
        <div className="w-full flex h-screen border">
            <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
            <main className="flex-1 overflow-y-auto scroll-hidden relative">
                <TopNav />
                <main className="p-4 ">
                    <Outlet />
                </main>
            </main>
        </div>
    )
}
