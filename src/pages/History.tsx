import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { ShieldAlert, BadgeCheck, Activity, Search, Filter, Calendar } from 'lucide-react';
import { CallDetailView } from '../components/history/CallDetailView';
import type { CallLog } from '../types';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import clsx from 'clsx';
import { format } from 'date-fns';

export const History = () => {
    const history = useStore(state => state.callHistory);
    const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
    const [filter, setFilter] = useState<'all' | 'scam' | 'safe' | 'cyberCell'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // --- Analytics Logic ---
    const stats = useMemo(() => {
        const total = history.length;
        const scams = history.filter(c => c.analysis?.call_classification === 'potential_fraud').length;
        const safe = total - scams;
        return { total, scams, safe };
    }, [history]);

    const chartData = useMemo(() => {
        return [...history].reverse().slice(-10).map(c => {
            // Parse dd/MM/yyyy
            const [day, month, year] = c.date.split('/').map(Number);
            // Create date object (months are 0-indexed)
            const dateObj = new Date(year, month - 1, day);
            const formattedDate = isNaN(dateObj.getTime()) ? c.date : format(dateObj, 'MMM dd');

            return {
                label: `${formattedDate} ${c.time.slice(0, 5)}`, // Jan 04 12:30
                risk: c.riskScore,
                id: c.id,
                scamType: c.scamCategory || 'Unknown'
            };
        });
    }, [history]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-md">
                    <p className="text-slate-400 text-xs font-mono mb-1">{label}</p>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${payload[0].name === 'risk' ? 'bg-blue-500' : 'bg-red-500'}`} />
                        <p className="text-white font-bold text-sm">
                            {payload[0].name === 'risk' ? 'Risk Score' : 'Count'}:
                            <span className="ml-2 text-lg">{payload[0].value}{payload[0].name === 'risk' ? '%' : ''}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    const scamTypeData = useMemo(() => {
        const types: Record<string, number> = {};
        history.forEach(c => {
            if (c.analysis?.call_classification === 'potential_fraud') {
                const type = c.scamCategory || 'Unknown';
                types[type] = (types[type] || 0) + 1;
            }
        });
        return Object.entries(types).map(([name, value]) => ({ name, value }));
    }, [history]);

    const filteredHistory = useMemo(() => {
        return history.filter(call => {
            const matchesFilter =
                filter === 'all' ? true :
                    filter === 'scam' ? call.analysis?.call_classification === 'potential_fraud' :
                        filter === 'safe' ? call.analysis?.call_classification !== 'potential_fraud' :
                            filter === 'cyberCell' ? !!call.cyberCellReportId : true;

            const matchesSearch =
                call.transcript.some(t => t.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (call.scamCategory || '').toLowerCase().includes(searchQuery.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [history, filter, searchQuery]);


    // If a call is selected, show the detailed view
    if (selectedCall) {
        return <CallDetailView call={selectedCall} onBack={() => setSelectedCall(null)} />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Detection History</h1>
                    <p className="text-slate-400 text-sm mt-1">{history.length} total calls analyzed</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search transcripts or scam types..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-slate-900/50 border border-slate-700 text-sm rounded-xl pl-10 pr-4 py-2.5 w-72 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-200"
                    />
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-blue-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Calendar className="w-16 h-16 text-blue-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Calls</p>
                        <h3 className="text-4xl font-black text-white mt-1">{stats.total}</h3>
                        <div className="mt-2 text-blue-400 text-xs font-bold bg-blue-500/10 inline-block px-2 py-0.5 rounded border border-blue-500/20">
                            Lifetime Analysis
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-red-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShieldAlert className="w-16 h-16 text-red-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Scams Detected</p>
                        <h3 className="text-4xl font-black text-white mt-1">{stats.scams}</h3>
                        <div className="mt-2 text-red-400 text-xs font-bold bg-red-500/10 inline-block px-2 py-0.5 rounded border border-red-500/20">
                            Threats Blocked
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-emerald-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BadgeCheck className="w-16 h-16 text-emerald-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Safe Calls</p>
                        <h3 className="text-4xl font-black text-white mt-1">{stats.safe}</h3>
                        <div className="mt-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 inline-block px-2 py-0.5 rounded border border-emerald-500/20">
                            Verified Secure
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Trend Chart */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-slate-300 text-sm font-bold uppercase tracking-wider flex items-center mb-6">
                        <Activity className="w-4 h-4 mr-2" />
                        Risk Score Trend
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20' }} />
                                <Area
                                    type="monotone"
                                    dataKey="risk"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRisk)"
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#60a5fa' }}
                                    style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.5))' } as any}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Scam Distribution */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-slate-300 text-sm font-bold uppercase tracking-wider flex items-center mb-6">
                        <Filter className="w-4 h-4 mr-2" />
                        Scam Type Distribution
                    </h3>
                    {scamTypeData.length > 0 ? (
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={scamTypeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                                    <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]}>
                                        {scamTypeData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={['#ef4444', '#f97316', '#eab308', '#ec4899'][index % 4]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-slate-500 text-sm flex-col">
                            <ShieldAlert className="w-8 h-8 mb-2 opacity-50" />
                            No scam data collected yet
                        </div>
                    )}
                </div>
            </div>

            {/* Main Log Table */}
            <div className="space-y-4">
                {/* Tabs */}
                <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-xl w-fit border border-white/5">
                    {(['all', 'scam', 'safe', 'cyberCell'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={clsx(
                                "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all",
                                filter === tab
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {tab === 'all' ? `All (${history.length})` : tab === 'cyberCell' ? 'Alerts Sent' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="glass-panel overflow-hidden rounded-2xl border border-white/5 relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-slate-950/50 backdrop-blur-xl h-full rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-900/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm sticky top-0 z-10">
                                    <tr>
                                        <th className="p-4 border-b border-white/10">Date & Time</th>
                                        <th className="p-4 border-b border-white/10">Scam Type</th>
                                        <th className="p-4 border-b border-white/10">Risk Score</th>
                                        <th className="p-4 border-b border-white/10">Status</th>
                                        <th className="p-4 border-b border-white/10">Cyber Cell</th>
                                        <th className="p-4 border-b border-white/10 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-slate-500">
                                                No logs found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredHistory.map(call => (
                                            <tr
                                                key={call.id}
                                                className="hover:bg-blue-500/5 transition-all duration-300 cursor-pointer group/row"
                                                onClick={() => setSelectedCall(call)}
                                            >
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="text-white font-medium text-sm">{call.date}</div>
                                                    <div className="text-xs text-slate-500 font-mono mt-0.5">{call.time}</div>
                                                </td>
                                                <td className="p-4">
                                                    {call.scamCategory && call.scamCategory !== 'Unknown' ? (
                                                        <div className="text-white font-medium text-sm">{call.scamCategory}</div>
                                                    ) : (
                                                        <div className="text-slate-500 italic text-sm">Unknown / None</div>
                                                    )}
                                                    <div className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5 opacity-70 font-mono">
                                                        {call.transcript.length > 0 ? call.transcript[0].text.substring(0, 40) + "..." : "No transcript"}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className={clsx(
                                                        "font-black text-lg drop-shadow-md",
                                                        call.riskScore > 60 ? "text-red-500" : call.riskScore > 30 ? "text-amber-500" : "text-emerald-500"
                                                    )}>
                                                        {call.riskScore}%
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={clsx(
                                                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shadow-[0_0_10px_rgba(0,0,0,0.2)]",
                                                        call.analysis?.call_classification === 'potential_fraud'
                                                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                                                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    )}>
                                                        {call.analysis?.call_classification === 'potential_fraud' ? (
                                                            <><ShieldAlert className="w-3 h-3 mr-1.5" /> Scam</>
                                                        ) : (
                                                            <><BadgeCheck className="w-3 h-3 mr-1.5" /> Safe</>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="p-4 leading-none">
                                                    {call.cyberCellReportId ? (
                                                        <span className="flex flex-col items-start">
                                                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 mb-1">
                                                                Notified
                                                            </span>
                                                            <span className="text-[9px] text-slate-500 font-mono">ID: {call.cyberCellReportId.split('-')[1]}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-600 text-[10px] uppercase font-bold tracking-wider opacity-50">
                                                            N/A
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className="text-xs font-bold text-blue-500 opacity-0 group-hover/row:opacity-100 transition-opacity uppercase tracking-wider flex items-center justify-end transform translate-x-2 group-hover/row:translate-x-0 duration-300">
                                                        View Report <Activity className="w-3 h-3 ml-1" />
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
