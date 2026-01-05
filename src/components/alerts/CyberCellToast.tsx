import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Siren, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const CyberCellToast = () => {
    const cyberCellReportId = useStore(state => state.cyberCellReportId);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (cyberCellReportId) {
            setIsVisible(true);
            const timer = setTimeout(() => setIsVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [cyberCellReportId]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, x: 50 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="fixed top-24 right-6 z-50 max-w-sm w-full"
                >
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-blue-500/50 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.2)] overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-red-500"></div>

                        <div className="p-4 flex items-start space-x-4">
                            <div className="bg-gradient-to-br from-blue-500/20 to-red-500/20 p-3 rounded-lg border border-blue-500/30">
                                <Siren className="w-6 h-6 text-blue-400 animate-pulse" />
                            </div>

                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-white flex items-center mb-1">
                                    <ShieldAlert className="w-4 h-4 mr-2 text-red-500" />
                                    Cyber Cell Alert Sent
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed mb-2">
                                    Fraud details securely shared for investigation.
                                </p>
                                <div className="flex items-center justify-between text-[10px] font-mono bg-black/40 rounded px-2 py-1 border border-white/5">
                                    <span className="text-slate-500">REF ID:</span>
                                    <span className="text-blue-400 font-bold tracking-wider">{cyberCellReportId}</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="h-1 bg-gradient-to-r from-blue-500 to-red-500"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
