import { ArrowLeft, ShieldAlert, ShieldCheck, Database, Lock, AlertTriangle, FileText, Activity } from 'lucide-react';
import type { CallLog } from '../../types';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface Props {
    call: CallLog;
    onBack: () => void;
}

export const CallDetailView = ({ call, onBack }: Props) => {
    const isFraud = call.analysis?.call_classification === 'potential_fraud';
    const riskScore = call.riskScore;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            {/* Header / Navigation */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={onBack}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <Database className="w-5 h-5 mr-3 text-indigo-400" />
                        Security Incident Report
                    </h2>
                    <p className="text-slate-400 text-sm font-mono uppercase tracking-wider">
                        ID: {call.id} • {call.date} {call.time}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN: Threat Intelligence */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Risk Score Card */}
                    <div className={clsx(
                        "p-6 rounded-2xl border-l-4 shadow-2xl overflow-hidden relative",
                        isFraud ? "bg-red-950/20 border-red-500" : "bg-emerald-950/20 border-emerald-500"
                    )}>
                        <div className="relative z-10">
                            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Threat Assessment</h3>
                            <div className="flex items-end space-x-2">
                                <span className={clsx(
                                    "text-6xl font-black tracking-tighter",
                                    isFraud ? "text-red-500" : "text-emerald-500"
                                )}>
                                    {riskScore}
                                </span>
                                <span className={clsx(
                                    "text-xl font-bold mb-2",
                                    isFraud ? "text-red-400" : "text-emerald-400"
                                )}>
                                    / 100
                                </span>
                            </div>
                            <div className={clsx(
                                "mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                isFraud ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/50" : "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50"
                            )}>
                                {isFraud ? <ShieldAlert className="w-3 h-3 mr-2" /> : <ShieldCheck className="w-3 h-3 mr-2" />}
                                {isFraud ? "High Risk Detected" : "Secure Conversation"}
                            </div>
                        </div>
                    </div>

                    {/* Detected Patterns */}
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="flex items-center text-slate-300 text-sm font-bold uppercase tracking-wider mb-4">
                            <Activity className="w-4 h-4 mr-2 text-indigo-400" />
                            Detected Patterns
                        </h3>
                        {call.analysis?.key_indicators && call.analysis.key_indicators.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {call.analysis.key_indicators.map((indicator, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-slate-800 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 shadow-sm flex items-center">
                                        <AlertTriangle className="w-3 h-3 mr-1.5 text-amber-500" />
                                        {indicator}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm italic">No specific threat patterns identified.</p>
                        )}
                    </div>

                    {/* Cyber Cell Integration Details */}
                    {call.cyberCellReportId && (
                        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <ShieldAlert className="w-12 h-12 text-blue-500" />
                            </div>
                            <h3 className="flex items-center text-blue-400 text-sm font-bold uppercase tracking-wider mb-4">
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Cyber Cell Notification
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Status</div>
                                    <div className="flex items-center text-white text-sm font-medium">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                                        Report Successfully Sent
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Reference ID</div>
                                        <div className="font-mono text-xs text-blue-300 bg-blue-900/20 px-2 py-1 rounded inline-block">
                                            {call.cyberCellReportId}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Timestamp</div>
                                        <div className="font-mono text-xs text-slate-400">
                                            {call.time}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Data Payload Summary</div>
                                    <div className="text-[10px] font-mono text-slate-400 bg-black/20 p-2 rounded border border-white/5">
                                        {`{ "risk_score": ${call.riskScore}, "threat_type": "${call.scamCategory || 'FRAUD'}", "evidence_count": ${call.analysis?.key_indicators?.length || 0} }`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* MIDDLE & RIGHT: Deep Analysis & Logs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Intelligence Briefing */}
                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Lock className="w-24 h-24 text-indigo-500" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-3">Intelligence Briefing</h3>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-white font-medium mb-1">Targeted Information</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {call.analysis?.reasoning || "No detailed reasoning available."}
                                    </p>
                                </div>

                                {call.analysis?.safety_coach_tips && call.analysis.safety_coach_tips.length > 0 && (
                                    <div className="bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/20">
                                        <h4 className="text-indigo-300 font-bold text-xs uppercase tracking-wider mb-3 flex items-center">
                                            <ShieldCheck className="w-3 h-3 mr-2" />
                                            Defense Guidelines
                                        </h4>
                                        <ul className="space-y-2">
                                            {call.analysis.safety_coach_tips.map((tip, idx) => (
                                                <li key={idx} className="flex items-start text-sm text-slate-300">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 mr-2 shrink-0"></span>
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Transcript Log */}
                    <div className="glass-panel p-0 rounded-2xl overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
                            <h3 className="text-slate-300 text-sm font-bold uppercase tracking-wider flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                Decrypted Transcript
                            </h3>
                            <span className="text-xs text-slate-500">{call.duration}s Duration</span>
                        </div>
                        <div className="p-4 space-y-4 max-h-96 overflow-y-auto bg-slate-950/30">
                            {call.transcript.map((line) => (
                                <div key={line.id} className={clsx(
                                    "flex flex-col max-w-[80%]",
                                    line.sender === 'receiver' ? "ml-auto items-end" : "mr-auto items-start"
                                )}>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                                        {line.sender === 'receiver' ? 'You' : 'Caller'}
                                    </span>
                                    <div className={clsx(
                                        "p-3 rounded-2xl text-sm leading-relaxed",
                                        line.sender === 'receiver'
                                            ? "bg-indigo-600 text-white rounded-tr-none"
                                            : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                                    )}>
                                        {line.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
