
import { PhoneOff, Slash, X, TriangleAlert, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RedAlertPopupProps {
    riskScore: number;
    pattern: string;
    onEndCall: () => void;
    onIgnore: () => void; // "View Details" or Stop Alert
}

export const RedAlertPopup = ({ riskScore, pattern, onEndCall, onIgnore }: RedAlertPopupProps) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/90 backdrop-blur-xl"
            >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600/30 via-transparent to-transparent animate-pulse-slow pointer-events-none"></div>

                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative bg-gradient-to-b from-[#1a0505] to-[#0f0202] border border-red-500/50 rounded-3xl p-0 max-w-md w-full shadow-2xl overflow-hidden mx-4"
                >
                    {/* Header Section */}
                    <div className="bg-red-600 p-6 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-50 hover:opacity-100 cursor-pointer" onClick={onIgnore}>
                            <div className="bg-red-800/50 rounded-full p-1"><X className="w-4 h-4 text-white" /></div>
                        </div>

                        <div className="flex flex-col items-center justify-center space-y-2 relative z-10">
                            <div className="bg-white rounded-full p-2 mb-1">
                                <TriangleAlert className="w-8 h-8 text-red-600 fill-red-600" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-wide">SCAM DETECTED</h2>
                            <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em]">Security Alert • Risk Level Critical</p>
                        </div>
                    </div>

                    {/* Body Section */}
                    <div className="p-6 space-y-6">

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center">
                                <span className="text-[10px] text-slate-400 uppercase font-bold text-center mb-1">Detected Pattern</span>
                                <span className="text-white font-bold text-sm text-center leading-tight">{pattern}</span>
                            </div>
                            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center">
                                <span className="text-[10px] text-slate-400 uppercase font-bold text-center mb-1">Risk Score</span>
                                <span className="text-3xl font-black text-white">{riskScore}%</span>
                            </div>
                        </div>

                        {/* Safety Warning Card */}
                        <div className="bg-red-500/10 border-l-4 border-red-500 rounded-r-xl p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <ShieldAlert className="w-4 h-4 text-red-500" />
                                <span className="text-red-500 font-bold text-xs uppercase">Safety Warning:</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Do <span className="text-white font-bold underline decoration-red-500">NOT</span> share OTP, ATM PIN, or Bank Details.
                            </p>
                            <p className="text-slate-500 text-[10px] mt-2 leading-relaxed">
                                Keyword-based local fallback analysis detected suspicious patterns in recent conversation.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3 pt-2">
                            <button
                                onClick={onEndCall}
                                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 rounded-xl flex items-center justify-center text-sm uppercase tracking-wider transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-900/50"
                            >
                                <PhoneOff className="w-5 h-5 mr-2 fill-white" />
                                End Call Immediately
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 rounded-lg text-xs flex items-center justify-center transition-colors border border-slate-700">
                                    <Slash className="w-3 h-3 mr-2" />
                                    Block Caller
                                </button>
                                <button onClick={onIgnore} className="bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-white font-medium py-3 rounded-lg text-xs flex items-center justify-center transition-colors border border-transparent hover:border-slate-700">
                                    <Slash className="w-3 h-3 mr-2 rotate-90" />
                                    Ignore & Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
