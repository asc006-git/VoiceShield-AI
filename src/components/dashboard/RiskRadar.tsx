import { motion } from 'framer-motion';
import clsx from 'clsx';
// Imports removed as they were unused after badge removal

interface Props {
    riskScore: number;
}

export const RiskRadar = ({ riskScore }: Props) => {
    // Determine color state
    const isMedium = riskScore >= 30 && riskScore < 70;
    const isCritical = riskScore >= 70;

    const colorClass = isCritical ? 'text-red-500' : isMedium ? 'text-amber-500' : 'text-cyan-400';
    const bgClass = isCritical ? 'bg-red-500' : isMedium ? 'bg-amber-500' : 'bg-cyan-500';
    const borderClass = isCritical ? 'border-red-500' : isMedium ? 'border-amber-500' : 'border-cyan-500';

    return (
        <div className="relative w-full h-64 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm">

            {/* Radar Grid/Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="w-56 h-56 rounded-full border border-slate-700"></div>
                <div className="w-40 h-40 rounded-full border border-slate-700 absolute"></div>
                <div className="w-24 h-24 rounded-full border border-slate-700 absolute"></div>
                <div className="w-full h-[1px] bg-slate-700 absolute"></div>
                <div className="h-full w-[1px] bg-slate-700 absolute"></div>
            </div>

            {/* Scanning Line Animation */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute w-56 h-56 rounded-full overflow-hidden opacity-30 pointer-events-none"
            >
                <div className={clsx("w-1/2 h-1/2 absolute top-0 right-0 bg-gradient-to-bl from-transparent via-transparent", isCritical ? "to-red-500" : isMedium ? "to-amber-500" : "to-cyan-500")}></div>
            </motion.div>

            {/* Central Risk Indicator */}
            <div className="relative z-10 flex flex-col items-center">
                <div className={clsx(
                    "w-32 h-32 rounded-full border-4 flex items-center justify-center bg-slate-900 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500",
                    borderClass,
                    isCritical || isMedium ? "animate-pulse" : ""
                )}>
                    <div className="flex flex-col items-center">
                        <span className={clsx("text-4xl font-black tracking-tighter", colorClass)}>
                            {riskScore}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                            Risk Score
                        </span>
                    </div>
                </div>

                {/* Status Badge Removed per user request */}
            </div>

            {/* Outer Glow for High Risk */}
            {(isCritical || isMedium) && (
                <div className={clsx("absolute inset-0 opacity-20 mix-blend-screen animate-pulse pointer-events-none", bgClass)}></div>
            )}
        </div>
    );
};
