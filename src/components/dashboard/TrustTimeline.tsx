import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { AlertCircle, Lock } from 'lucide-react';

export const TrustTimeline = () => {
    const { trustScore, detectedPatterns, isCallActive } = useStore();
    const [dataPoints, setDataPoints] = useState<{ time: number, score: number }[]>([]);
    const [markers, setMarkers] = useState<{ time: number, label: string }[]>([]);

    // Reset or Initialize
    useEffect(() => {
        if (!isCallActive) {
            // Show a "demo" or "safe" flat line if idle
            if (dataPoints.length > 50 || dataPoints.length === 0) {
                setDataPoints(Array(20).fill(0).map((_, i) => ({ time: i, score: 100 })));
                setMarkers([]);
            }
            return;
        }
    }, [isCallActive]);

    // Live Data Update
    useEffect(() => {
        if (!isCallActive) return;

        const now = Date.now();
        setDataPoints(prev => {
            const newPoints = [...prev, { time: now, score: trustScore }];
            // Keep last 60 points
            if (newPoints.length > 60) return newPoints.slice(newPoints.length - 60);
            return newPoints;
        });

        // Check for new patterns to add markers
        // Simple logic: if patterns length changed, add marker for latest pattern
        // (This is a simplified approach)
    }, [trustScore, isCallActive]);

    // Marker Logic
    useEffect(() => {
        if (detectedPatterns.length > 0 && isCallActive) {
            const latestPattern = detectedPatterns[detectedPatterns.length - 1];
            // Avoid duplicate markers for same pattern instantly
            const lastMarker = markers[markers.length - 1];
            if (!lastMarker || lastMarker.label !== latestPattern) {
                setMarkers(prev => [...prev, { time: Date.now(), label: latestPattern }]);
            }
        }
    }, [detectedPatterns, isCallActive]);

    // Generate Path
    const generatePath = () => {
        if (dataPoints.length < 2) return "";

        const width = 100;
        const height = 100;
        const minTime = dataPoints[0].time;
        const maxTime = dataPoints[dataPoints.length - 1].time;
        const timeRange = maxTime - minTime || 1; // avoid div by 0

        const points = dataPoints.map(p => {
            const x = ((p.time - minTime) / timeRange) * width;
            const y = height - (p.score); // 100 at top (y=0), 0 at bottom (y=100)
            return `${x},${y}`;
        }).join(" L ");

        return `M ${points}`;
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-white/5 h-48 flex flex-col relative overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-center mb-4 z-10">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                    <Lock className="w-3 h-3 mr-2" />
                    Trust Degradation Graph
                </h3>
                <span className="text-xs font-mono text-emerald-500">{trustScore}% Integrity</span>
            </div>

            {/* Graph Area */}
            <div className="flex-1 relative w-full">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                    {/* Grid Lines */}
                    <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                    {/* The Line */}
                    <motion.path
                        d={generatePath()}
                        fill="none"
                        stroke={trustScore > 50 ? "#10b981" : "#ef4444"}
                        strokeWidth="2"
                        initial={false}
                        animate={{ d: generatePath(), stroke: trustScore > 50 ? "#10b981" : "#ef4444" }}
                        transition={{ type: "tween", ease: "linear", duration: 0.2 }}
                    />

                    {/* Markers Overlay (Simplistic x-pos calculation) */}
                    {/* Note: In a real SVG, we'd calculate exact x/y for markers. 
                        Here we just simulate markers for visual flair if live. */}
                </svg>

                {/* Simulated Markers for demo */}
                <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none">
                    {/* Simple Marker Overlay (Future Implementation: Exact X/Y markers) */}
                    {/* For now, we show active blip below */}
                    {markers.length > 0 && isCallActive && (
                        <div className="hidden">Markers Active</div>
                    )}

                    {/* Active Event Blip if trust dropping */}
                    {trustScore < 90 && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-red-500/20 text-red-400 text-[10px] px-2 py-1 rounded border border-red-500/50 backdrop-blur-md"
                        >
                            <div className="flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {markers.length > 0 ? markers[markers.length - 1].label : 'Trust Degrading'}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
