import { useStore } from '../../store/useStore';
import { StatCard } from './StatCard';
import { RiskRadar } from './RiskRadar';
import { ShieldCheck, PhoneOff, Activity, Settings2, Globe, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export const Dashboard = () => {
    const navigate = useNavigate();
    const history = useStore(state => state.callHistory);
    const settings = useStore(state => state.settings);
    const toggleElderMode = useStore(state => state.toggleElderMode);
    const toggleGuardianEnabled = useStore(state => state.toggleGuardianEnabled);
    const toggleLanguage = useStore(state => state.toggleLanguage);
    const currentRisk = useStore(state => state.currentRiskScore);

    // Computed stats
    const totalCalls = history.length;
    const threatsBlocked = history.filter(h => h.analysis?.call_classification === 'potential_fraud').length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <div className="flex items-center space-x-2 text-blue-400 mb-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                        <span className="text-xs font-bold tracking-wider uppercase">System Operational</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white neon-text">
                        VoiceShield <span className="text-slate-500 font-light">AI</span>
                    </h1>
                    <p className="text-slate-400 mt-2 max-w-xl">
                        Advanced real-time conversation simulator. Protect yourself with AI-powered scam detection, Whisper guidance, and Family Guardian alerts.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Risk Radar - Full Width */}
                <div className="lg:col-span-3">
                    <RiskRadar riskScore={currentRisk} />
                </div>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Threats Blocked"
                    value={threatsBlocked}
                    icon={ShieldCheck}
                    color="red"
                    trend="High risk interventions"
                />
                <StatCard
                    title="Total Simulations"
                    value={totalCalls}
                    icon={PhoneOff}
                    color="blue"
                    trend="Active protection"
                    trendUp
                />
                <StatCard
                    title="Protection Status"
                    value="Active"
                    icon={Activity}
                    color="emerald"
                    trend="Version 2.0.4"
                    trendUp
                />
            </div>

            {/* Security Event Log & Quick Config */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Log */}
                <div className="lg:col-span-2 glass-panel overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Activity className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-bold text-white">Security Event Log</h3>
                        </div>
                        <button
                            onClick={() => navigate('/history')}
                            className="text-xs text-slate-400 hover:text-white transition-colors uppercase tracking-wider font-bold"
                        >
                            View All Events
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto">
                        {history.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                                <ShieldCheck className="w-12 h-12 text-slate-700 mb-4 opacity-50" />
                                <p className="text-sm font-medium">No security events recorded.</p>
                                <p className="text-xs text-slate-600 mt-1">Simulations will appear here.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-900/50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 border-b border-white/5">Timestamp</th>
                                        <th className="p-4 border-b border-white/5">Threat Level</th>
                                        <th className="p-4 border-b border-white/5">Classification</th>
                                        <th className="p-4 border-b border-white/5 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {history.slice(0, 5).map(call => (
                                        <tr key={call.id} className="hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => navigate('/history')}>
                                            <td className="p-4">
                                                <div className="text-sm text-white font-medium">{call.date}</div>
                                                <div className="text-xs text-slate-500 font-mono">{call.time}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5 w-16 overflow-hidden">
                                                        <div
                                                            className={clsx("h-full rounded-full", call.riskScore > 50 ? "bg-red-500" : "bg-emerald-500")}
                                                            style={{ width: `${call.riskScore}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={clsx("text-xs font-bold", call.riskScore > 50 ? "text-red-400" : "text-emerald-400")}>
                                                        {call.riskScore}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {call.scamCategory && call.scamCategory !== 'Unknown' ? (
                                                    <span className="text-xs text-white bg-slate-800 px-2 py-1 rounded border border-white/10">
                                                        {call.scamCategory}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-600 italic">Unclassified</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                {call.analysis?.call_classification === 'potential_fraud' ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wide">
                                                        Threat Blocked
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                                                        Secure
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Configuration */}
                <div className="glass-panel p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                        <Settings2 className="w-5 h-5 mr-2 text-blue-400" />
                        Quick Configuration
                    </h3>

                    <div className="space-y-4">
                        {/* Family Guardian Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5 cursor-pointer hover:bg-slate-900 transition-colors"
                            onClick={toggleGuardianEnabled}>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Family Guardian</div>
                                    <div className="text-xs text-slate-500">
                                        {settings.notificationsEnabled ? 'Active' : 'Disabled'}
                                    </div>
                                </div>
                            </div>
                            <div className={clsx("w-10 h-6 rounded-full relative transition-colors", settings.notificationsEnabled ? "bg-emerald-500" : "bg-slate-700")}>
                                <div className={clsx("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", settings.notificationsEnabled ? "left-5" : "left-1")}></div>
                            </div>
                        </div>

                        {/* Elder Mode Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5 cursor-pointer hover:bg-slate-900 transition-colors"
                            onClick={toggleElderMode}>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Elder Mode</div>
                                    <div className="text-xs text-slate-500">
                                        {settings.elderMode ? 'Enhanced Visibility' : 'Simplified Interface'}
                                    </div>
                                </div>
                            </div>
                            <div className={clsx("w-10 h-6 rounded-full relative transition-colors", settings.elderMode ? "bg-blue-500" : "bg-slate-700")}>
                                <div className={clsx("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", settings.elderMode ? "left-5" : "left-1")}></div>
                            </div>
                        </div>

                        {/* Language Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5 cursor-pointer hover:bg-slate-900 transition-colors"
                            onClick={toggleLanguage}>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Language</div>
                                    <div className="text-xs text-slate-500">
                                        {settings.language === 'en' ? 'English' : 'Hindi (हिंदी)'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 bg-slate-800 rounded-lg p-1">
                                <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded transition-colors", settings.language === 'en' ? "bg-slate-600 text-white" : "text-slate-500")}>EN</span>
                                <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded transition-colors", settings.language === 'hi' ? "bg-blue-600 text-white" : "text-slate-500")}>HI</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex gap-4 mt-8'>
                <button
                    onClick={() => navigate('/simulator')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-bold text-white shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform flex items-center"
                >
                    <PhoneOff className="w-5 h-5 mr-2" />
                    Launch Call Simulator
                </button>
            </div>
        </div >
    );
};
