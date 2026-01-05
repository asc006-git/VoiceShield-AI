
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, ShieldAlert, CheckCircle, User } from 'lucide-react';
import clsx from 'clsx';

export const AnalysisView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const history = useStore(state => state.callHistory);
    const call = history.find(c => c.id === id);

    if (!call) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-white text-xl">Call Record Not Found</h2>
                <button onClick={() => navigate('/history')} className="text-blue-500 mt-4">Back to History</button>
            </div>
        );
    }

    const isFraud = call.analysis?.call_classification === 'potential_fraud';

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4">
            <button onClick={() => navigate('/history')} className="flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to History
            </button>

            <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-white flex items-center">
                    {isFraud ? <ShieldAlert className="w-8 h-8 text-red-500 mr-3" /> : <CheckCircle className="w-8 h-8 text-emerald-500 mr-3" />}
                    {isFraud ? 'Threat Detected' : 'Safe Conversation'}
                </h1>
                <span className="text-slate-500 font-mono">{call.date} • {call.time}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Analysis Card */}
                <div className="md:col-span-2 space-y-6">
                    <div className="glass-panel p-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">AI Security Assessment</h3>

                        <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5 mb-6">
                            <p className="text-lg text-white leading-relaxed">
                                {call.analysis?.reasoning || "No analysis generated."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-slate-500">Caller Assessment</span>
                                <div className="text-white font-medium capitalize mt-1 flex items-center">
                                    <User className="w-4 h-4 mr-2 text-blue-400" />
                                    {call.analysis?.caller_type_assessment.replace('_', ' ')}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500">Emotional Pressure</span>
                                <div className="flex items-center mt-1">
                                    <div className="flex space-x-1">
                                        {[...Array(10)].map((_, i) => (
                                            <div key={i} className={clsx("w-1 h-3 rounded-full",
                                                i < (call.analysis?.emotional_risk_score || 0)
                                                    ? (call.analysis?.emotional_risk_score || 0) > 7 ? 'bg-red-500' : 'bg-amber-500'
                                                    : 'bg-slate-800'
                                            )}></div>
                                        ))}
                                    </div>
                                    <span className="ml-2 text-white font-bold">{call.analysis?.emotional_risk_score}/10</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Transcript Analysis</h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {call.transcript.map(line => (
                                <div key={line.id} className="flex space-x-3">
                                    <div className={clsx("w-16 text-xs font-bold py-1", line.sender === 'caller' ? 'text-red-400' : 'text-emerald-400')}>
                                        {line.sender === 'caller' ? 'CALLER' : 'YOU'}
                                    </div>
                                    <div className="flex-1 text-slate-300 text-sm">
                                        {line.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Meta Card */}
                <div className="space-y-6">
                    <div className={clsx("glass-panel p-6 text-center", isFraud ? 'border-red-500/30' : 'border-emerald-500/30')}>
                        <span className="text-xs text-slate-500 uppercase">Final Risk Score</span>
                        <div className={clsx("text-5xl font-bold mt-2", isFraud ? 'text-red-500' : 'text-emerald-500')}>
                            {call.riskScore}
                        </div>
                        {call.alertTriggered && (
                            <div className="mt-4 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold inline-block">
                                INTERVENTION TRIGGERED
                            </div>
                        )}
                    </div>

                    <div className="glass-panel p-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Key Indicators</h3>
                        <div className="flex flex-wrap gap-2">
                            {call.analysis?.key_indicators.map((tag, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs border border-white/5">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Raw JSON Output</h3>
                        <pre className="text-[10px] bg-black/50 p-4 rounded-lg overflow-x-auto text-emerald-400 font-mono">
                            {JSON.stringify(call.analysis, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};
