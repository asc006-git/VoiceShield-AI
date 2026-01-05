import { useAudioAnalyzer } from '../../hooks/useAudioAnalyzer';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface Props {
    isActive: boolean;
    color?: string; // e.g. "text-red-500" or "text-emerald-500"
}

export const VoiceWaveform = ({ isActive, color = 'text-emerald-500' }: Props) => {
    const volume = useAudioAnalyzer(isActive);

    // Generate a smooth wave path based on volume
    // We'll create a simple sine-wave like path that amplifies with volume
    const generateWavePath = () => {
        const points = 20;
        const width = 100;
        // ViewBox height is 100
        const amplitude = isActive ? Math.min(40, volume * 1.5) : 2;

        // Build path: Start middle-left
        let path = `M 0 50 `;

        for (let i = 0; i <= points; i++) {
            const x = (width / points) * i;
            // Create fluctuating wave
            const y = 50 + Math.sin(i * 1.5 + Date.now() / 100) * amplitude * (i % 2 === 0 ? 1 : -1);
            path += `L ${x} ${y} `;
        }

        return path;
    };

    return (
        <div className="w-full h-full flex items-center justify-center opacity-30">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <motion.path
                    d={generateWavePath()}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={clsx("transition-colors duration-300", color)}
                    initial={{ d: "M 0 50 L 100 50" }}
                    animate={{ d: generateWavePath() }}
                    transition={{ duration: 0.05, ease: "linear" }}
                />
            </svg>
        </div>
    );
};
