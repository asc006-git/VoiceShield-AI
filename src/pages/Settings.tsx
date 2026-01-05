import { useStore } from '../store/useStore';
import { ToggleLeft, ToggleRight } from 'lucide-react';

export const SettingsPage = () => {
    const { settings, setGeminiApiKey, toggleElderMode } = useStore();

    // Basic settings placeholder
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">System Configuration</h1>
            <div className="glass-panel p-6 space-y-6">
                {/* Gemini API Key */}
                <div className="pb-6 border-b border-white/5 space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium text-white">Gemini API Configuration</h3>
                        <p className="text-sm text-slate-400">Required for advanced AI analysis and real-time fraud detection.</p>
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Enter your Gemini API Key"
                            value={settings.geminiApiKey || ''}
                            onChange={(e) => setGeminiApiKey(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Get one from Google AI Studio</a>
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium text-white">Elder Mode</h3>
                        <p className="text-sm text-slate-400">High-contrast interface, larger text, and simplified alerts.</p>
                    </div>
                    <button
                        onClick={toggleElderMode}
                        className={`transition-colors ${settings.elderMode ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-400'}`}
                    >
                        {settings.elderMode ? (
                            <ToggleRight className="w-12 h-12" />
                        ) : (
                            <ToggleLeft className="w-12 h-12" />
                        )}
                    </button>
                </div>
                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium text-white">Detection Language</h3>
                        <p className="text-sm text-slate-400">Primary language for transciption and sentiment analysis.</p>
                    </div>
                    <select className="bg-slate-900 border border-white/10 text-white rounded p-2">
                        <option>English (US)</option>
                        <option>Hindi</option>
                    </select>
                </div>

                {/* Guardian Mode */}
                <div className="pb-6 border-b border-white/5 space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium text-white">Family Guardian Configuration</h3>
                        <p className="text-sm text-slate-400">Trusted contact details for high-risk alerts (Score &ge; 70).</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Guardian Name (e.g. Mom, John)"
                            value={settings.guardianName || ''}
                            onChange={(e) => useStore.getState().setGuardianName(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <input
                            type="text"
                            placeholder="Guardian Email or Phone"
                            value={settings.guardianContact || ''}
                            onChange={(e) => useStore.getState().setGuardianContact(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Risk Sensitivity */}
                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium text-white">Risk Sensitivity</h3>
                        <p className="text-sm text-slate-400">Adjust how aggressively the AI flags suspicious behavior.</p>
                    </div>
                    <select
                        value={settings.riskSensitivity || 'medium'}
                        onChange={(e) => useStore.getState().setRiskSensitivity(e.target.value as any)}
                        className="bg-slate-900 border border-white/10 text-white rounded p-2"
                    >
                        <option value="low">Low (Fewer Alerts)</option>
                        <option value="medium">Medium (Balanced)</option>
                        <option value="high">High (Strict Protection)</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
