
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: 'blue' | 'red' | 'emerald' | 'amber';
}

export const StatCard = ({ title, value, icon: Icon, trend, trendUp, color = 'blue' }: StatCardProps) => {
    const colorStyles = {
        blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        red: 'text-red-500 bg-red-500/10 border-red-500/20',
        emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    };

    return (
        <div className="glass-panel p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className={clsx('p-3 rounded-lg border', colorStyles[color])}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                    <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                </div>
            </div>

            <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
            <div className="text-3xl font-bold text-white mb-2">{value}</div>

            {trend && (
                <div className={clsx('text-xs font-medium flex items-center', trendUp ? 'text-emerald-400' : 'text-slate-400')}>
                    {trendUp ? '↗' : '↘'} {trend}
                </div>
            )}

            {/* Hover Glow */}
            <div className={clsx('absolute -right-10 -bottom-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500',
                color === 'blue' ? 'bg-blue-500' :
                    color === 'red' ? 'bg-red-500' :
                        color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'
            )}></div>
        </div>
    );
};
