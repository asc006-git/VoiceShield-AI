import { useAudioAnalyzer } from '../../hooks/useAudioAnalyzer';
import clsx from 'clsx';

export const AudioVisualizer = ({ isActive, color = 'bg-emerald-500' }: { isActive: boolean; color?: string }) => {
    // Use the real-time analyzer hook
    const volume = useAudioAnalyzer(isActive);

    // Create 5 bars, each reacting slightly differently to the single volume metric for visual flair
    // In a full implementation, we'd use frequency data for each bar.
    // Here we simulate it by adding slight random variance to the base volume.
    const bars = [0.8, 1.2, 1.5, 1.1, 0.9].map(multiplier => Math.min(50, Math.max(4, volume * multiplier * 0.8)));

    return (
        <div className="flex items-center justify-center space-x-1 h-12">
            {bars.map((height, i) => (
                <div
                    key={i}
                    className={clsx("w-1.5 rounded-full transition-all duration-75", color)}
                    style={{ height: `${isActive ? height : 4}px` }}
                />
            ))}
        </div>
    );
};
