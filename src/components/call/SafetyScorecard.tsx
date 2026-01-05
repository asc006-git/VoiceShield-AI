import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck, ThumbsUp } from 'lucide-react';
import type { CallAnalysis } from '../../types';

interface Props {
    riskScore: number;
    analysis: CallAnalysis | null;
    cyberCellReportId?: string; // NEW
    onClose: () => void;
}

export const SafetyScorecard = ({ riskScore, analysis, cyberCellReportId, onClose }: Props) => {
    const isSafe = riskScore < 50;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden relative">
                {/* Header Decoration */}
                <div className={`h-2 w-full ${isSafe ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isSafe ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {isSafe ? <ShieldCheck className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Call Security Summary</h2>
                        <p className="text-slate-400">Here is how VoiceShield protected you.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Score Panel */}
                        <div className="bg-slate-800/50 rounded-2xl p-6 flex flex-col items-center justify-center border border-white/5">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Final Risk Score</span>
                            <span className={`text-5xl font-black ${isSafe ? 'text-emerald-400' : 'text-amber-500'}`}>
                                {riskScore}
                            </span>
                            <span className={`mt-2 text-xs px-3 py-1 rounded-full font-bold uppercase ${isSafe ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}>
                                {isSafe ? 'Safe Interaction' : 'Suspicious Activity'}
                            </span>
                        </div>

                        {/* Insights Panel */}
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 dark-scroll overflow-y-auto max-h-48">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
                                <CheckCircle className="w-3 h-3 mr-2 text-emerald-500" />
                                Positives & Tips
                            </h3>
                            <ul className="space-y-3">
                                {analysis?.safety_coach_tips?.map((tip, i) => (
                                    <li key={i} className="flex items-start text-sm text-slate-300">
                                        <ThumbsUp className="w-3 h-3 mr-2 text-indigo-400 mt-1 shrink-0" />
                                        {tip}
                                    </li>
                                ))}
                                {!analysis?.safety_coach_tips && (
                                    <li className="text-sm text-slate-500 italic">No specific AI tips generated for this call.</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Cyber Cell Notification Card (If Sent) */}
                    {cyberCellReportId && (
                        <div className="mb-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex items-center space-x-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-white">Cyber Cell Notification Status</h4>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Status</div>
                                        <div className="text-xs font-bold text-blue-400 uppercase flex items-center">
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5 animate-pulse"></span>
                                            Report Sent
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Reference ID</div>
                                        <div className="text-xs font-mono text-white">{cyberCellReportId}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
