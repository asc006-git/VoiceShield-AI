import { useStore } from '../../store/useStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldAlert, TrendingUp, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export const ScamInsights = () => {
    const history = useStore(state => state.callHistory);

    // 1. Calculate Risk Trend (last 10 calls)
    const riskData = history.slice(0, 10).reverse().map((call, index) => ({
        name: `Call ${index + 1}`,
        risk: call.riskScore,
        date: call.date
    }));

    // 2. Identify Top Vulnerabilities (Patterns)
    const patternsMock = [
        { name: 'Financial Pressure', count: 0 },
        { name: 'Urgency', count: 0 },
        { name: 'Authority', count: 0 },
        { name: 'Tech Support', count: 0 },
    ];

    history.forEach(call => {
        if (call.scamCategory) {
            const pattern = patternsMock.find(p => p.name.toLowerCase().includes(call.scamCategory?.toLowerCase() || ''));
            if (pattern) pattern.count++;
            else if (call.scamCategory === 'Urgency') patternsMock[1].count++;
        }
    });

    // Sort and get top
    const vulnerabilities = patternsMock.sort((a, b) => b.count - a.count).filter(p => p.count >= 0);

    return (
        <div className="glass-panel p-6 col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Header */}
            <div className="md:col-span-2 flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center">
                        <ShieldAlert className="w-5 h-5 mr-2 text-indigo-400" />
                        Scam Playbook Generator
                    </h3>
                    <p className="text-sm text-slate-400">
                        AI-generated vulnerability profile based on your call history.
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Profile Status</span>
                    <div className="text-emerald-400 font-mono font-bold">OPTIMIZED</div>
                </div>
            </div>

            {/* Left: Risk Trend Graph */}
            <div className="h-64">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Risk Exposure Trend
                </h4>
                <div className="w-full h-full bg-slate-900/50 rounded-xl border border-white/5 p-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={riskData}>
                            <defs>
                                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                            <XAxis dataKey="name" hide />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                                itemStyle={{ color: '#ef4444' }}
                            />
                            <Area type="monotone" dataKey="risk" stroke="#ef4444" fillOpacity={1} fill="url(#colorRisk)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Right: Top Vulnerabilities */}
            <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Top Detected Threats
                </h4>
                <div className="space-y-4">
                    {vulnerabilities.slice(0, 3).map((v, i) => (
                        <div key={i} className="group">
                            <div className="flex justify-between text-sm text-slate-300 mb-1">
                                <span>{v.name}</span>
                                <span className="font-mono text-slate-500">{v.count} incidents</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={clsx("h-full rounded-full transition-all duration-1000",
                                        i === 0 ? "bg-red-500" : i === 1 ? "bg-orange-500" : "bg-amber-500"
                                    )}
                                    style={{ width: `${Math.min(100, (v.count / Math.max(1, history.length)) * 100 * 2)}%` }} // Scaling for visuals
                                ></div>
                            </div>
                        </div>
                    ))}
                    {history.length === 0 && (
                        <div className="text-center py-8 text-slate-500 italic text-sm">
                            No data available. Complete calls to generate profile.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
