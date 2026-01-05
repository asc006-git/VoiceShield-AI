
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Phone, History, Settings, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            clsx(
                'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group',
                isActive
                    ? 'bg-blue-600/20 border border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
            )
        }
    >
        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <span className="font-medium">{label}</span>
    </NavLink>
);

export const Sidebar = () => {
    return (
        <div className="w-64 border-r border-white/10 bg-slate-950/50 backdrop-blur-xl h-screen p-6 flex flex-col">
            <div className="flex items-center space-x-3 mb-10 px-2">
                <div className="relative">
                    <ShieldAlert className="w-8 h-8 text-blue-500" />
                    <div className="absolute inset-0 bg-blue-500 blur-lg opacity-40"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    VoiceShield AI
                </span>
            </div>

            <nav className="space-y-2 flex-1">
                <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/simulator" icon={Phone} label="Call Simulator" />
                <NavItem to="/history" icon={History} label="History" />
                <NavItem to="/settings" icon={Settings} label="Settings" />
            </nav>

            <div className="mt-auto p-4 rounded-xl bg-slate-900 border border-white/5">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500"></div>
                    <div>
                        <p className="text-sm font-medium text-white">Admin User</p>
                        <p className="text-xs text-emerald-400 flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                            PROTECTED
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
