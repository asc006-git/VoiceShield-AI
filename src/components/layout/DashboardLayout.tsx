
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-background overflow-hidden selection:bg-cyan-500/30">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
            <div className="relative z-10 flex w-full">
                <Sidebar />
                <main className="flex-1 overflow-y-auto h-screen p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
