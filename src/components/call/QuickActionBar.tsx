import { PhoneOff, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    isCallActive: boolean;
    onEndCall: () => void;
    onMuteToggle: () => void;
    isMuted: boolean;
    currentRisk: number;
}

export const QuickActionBar = ({ isCallActive, onEndCall, onMuteToggle, isMuted, currentRisk }: Props) => {
    if (!isCallActive) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
            >
                <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl p-2 flex items-center space-x-2 ring-1 ring-white/5">

                    {/* Protection Status Indicator */}
                    <div className="px-4 flex items-center border-r border-white/10 mr-2">
                        <div className={`w-2 h-2 rounded-full mr-2 ${currentRisk > 50 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                        <span className="text-xs font-bold text-white tracking-wide">
                            {currentRisk > 50 ? 'RISK HIGH' : 'PROTECTED'}
                        </span>
                    </div>

                    <button
                        onClick={onMuteToggle}
                        className={`p-4 rounded-full transition-all ${isMuted ? 'bg-slate-700 text-amber-400' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                        title="Toggle Mute"
                    >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={onEndCall}
                        className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg shadow-red-500/20 transition-transform active:scale-95 flex items-center px-6"
                    >
                        <PhoneOff className="w-5 h-5 mr-0 md:mr-2" />
                        <span className="hidden md:inline font-bold uppercase text-sm tracking-wide">End Call</span>
                    </button>

                </div>
            </motion.div>
        </AnimatePresence>
    );
};
