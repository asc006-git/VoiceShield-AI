import clsx from 'clsx';
import { Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
    trustScore: number;
}

export const TrustDegradationTimeline = ({ trustScore }: Props) => {
    // Keep history of last 50 data points for the waveform
    const [dataPoints, setDataPoints] = useState<number[]>(Array(50).fill(100));

    // Update history when trustScore changes
    useEffect(() => {
        const interval = setInterval(() => {
            setDataPoints(prev => {
                const newData = [...prev.slice(1), trustScore];
                return newData;
            });
        }, 100); // Fast update for smooth scrolling effect
        return () => clearInterval(interval);
    }, [trustScore]);

    // Generate SVG Path
    const generatePath = () => {
        const width = 100;
        const height = 100;
        const step = width / (dataPoints.length - 1);

        let path = `M 0 ${height} `; // Start bottom left

        // Draw area points
        dataPoints.forEach((score, i) => {
            const x = i * step;
            const y = height - (score / 100 * height);
            path += `L ${x} ${y} `;
        });

        path += `L ${width} ${height} Z`; // Close path to bottom right -> bottom left
        return path;
    };

    // Generate Line Path (just the top stroke)
    const generateLine = () => {
        const width = 100;
        const height = 100;
        const step = width / (dataPoints.length - 1);

        let path = "";
        dataPoints.forEach((score, i) => {
            const x = i * step;
            const y = height - (score / 100 * height);
            if (i === 0) path += `M ${x} ${y} `;
            else path += `L ${x} ${y} `;
        });
        return path;
    };

    return (
        <div className="w-full h-full bg-slate-900/50 rounded-2xl p-5 border border-white/5 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-center z-10 relative">
                <span className="text-xs font-mono uppercase text-slate-400 flex items-center font-bold tracking-wider">
                    <Lock className="w-3 h-3 mr-2 text-emerald-500" />
                    TRUST DEGRADATION TIMELINE
                </span>
                <span className={clsx(
                    "text-xl font-black font-mono transition-colors",
                    trustScore > 80 ? 'text-emerald-400' : trustScore > 50 ? 'text-amber-400' : 'text-red-500 animate-pulse'
                )}>
                    {Math.round(trustScore)}%
                </span>
            </div>

            {/* Waveform Visualization */}
            <div className="absolute inset-0 z-0">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-50">
                    <defs>
                        <linearGradient id="trustGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={trustScore > 50 ? "#10b981" : "#ef4444"} stopOpacity="0.5" />
                            <stop offset="100%" stopColor={trustScore > 50 ? "#10b981" : "#ef4444"} stopOpacity="0.0" />
                        </linearGradient>
                    </defs>
                    <motion.path
                        d={generatePath()}
                        fill="url(#trustGradient)"
                        transition={{ duration: 0.1, ease: "linear" }}
                    />
                    <motion.path
                        d={generateLine()}
                        fill="none"
                        stroke={trustScore > 50 ? "#34d399" : "#f87171"}
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                        transition={{ duration: 0.1, ease: "linear" }}
                    />
                </svg>
            </div>

            {/* Grid Lines Overlay */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="w-full h-full border-t border-slate-500/50 mt-[25%]"></div>
                <div className="w-full h-full border-t border-slate-500/50 mt-[25%]"></div>
                <div className="w-full h-full border-t border-slate-500/50 mt-[25%]"></div>
            </div>

            {/* Status Footer */}
            <div className="relative z-10 mt-auto pt-4">
                <div className="flex items-center space-x-2">
                    <div className={clsx("w-2 h-2 rounded-full animate-pulse", trustScore > 50 ? "bg-emerald-500" : "bg-red-500")}></div>
                    <span className={clsx("text-xs font-bold uppercase", trustScore > 50 ? "text-emerald-500" : "text-red-500")}>
                        {trustScore > 80 ? "Trust Integrity Optimized" : trustScore > 50 ? "Analyzing Deviation..." : "Trust Compromised"}
                    </span>
                </div>
            </div>
        </div>
    );
};
