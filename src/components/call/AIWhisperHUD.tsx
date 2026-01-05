import { ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    message: string | null;
}

export const AIWhisperHUD = ({ message }: Props) => {
    if (!message) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="absolute bottom-24 left-4 right-4 z-50 pointer-events-none"
            >
                <div className="bg-slate-900/90 backdrop-blur-xl border border-indigo-500/50 box-border p-4 rounded-2xl shadow-2xl shadow-indigo-500/20 flex items-start space-x-4 max-w-md mx-auto ring-1 ring-indigo-400/30">
                    <div className="bg-indigo-500/20 p-2 rounded-full ring-1 ring-indigo-500/50 animate-pulse">
                        <ShieldAlert className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                        <h4 className="text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
                            AI Guardian Whisper
                        </h4>
                        <p className="text-white text-sm leading-relaxed font-medium">
                            {message}
                        </p>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
