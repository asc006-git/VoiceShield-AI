import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Mic, Phone, PhoneOff, Activity, User, MicOff, Lock } from 'lucide-react';
import { LiveTranscript } from './LiveTranscript';
import { RedAlertPopup } from '../alerts/RedAlertPopup';
import { analyzeTextForRisk } from '../../services/ScamDetectionEngine';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { VoiceWaveform } from './VoiceWaveform';
import { TrustDegradationTimeline } from '../dashboard/TrustDegradationTimeline';
import { AIWhisperHUD } from './AIWhisperHUD';
import { GuardianToast } from '../alerts/GuardianToast';
import { SafetyScorecard } from './SafetyScorecard';
import { QuickActionBar } from './QuickActionBar';
import { CyberCellToast } from '../alerts/CyberCellToast';
import clsx from 'clsx';
import { format } from 'date-fns';

export const CallInterface = () => {
    const {
        isCallActive,
        startCall,
        // endCall, // We use resetState now for full cleanup
        resetState,
        currentRiskScore,
        updateTranscript,
        updateRiskScore,
        addHistoryEntry,
        transcript,
        detectedPatterns,
        settings,
        trustScore,
        whisperMessage,
        isAlertIgnored,
        ignoreAlert,
        cyberCellReportId // NEW
    } = useStore();

    const [showScorecard, setShowScorecard] = useState(false);
    const [lastCallAnalysis, setLastCallAnalysis] = useState<any>(null);

    // Voice Hooks
    const handleTranscript = (text: string, role: 'caller' | 'receiver') => {
        if (!isCallActive) return;

        // Add to transcript
        updateTranscript(role === 'caller' ? 'caller' : 'receiver', text, true);

        // Analyze Risk (if Caller spoke)
        // WARM-UP LOGIC: Only analyze after a few turns to avoid premature flagging
        if (role === 'caller' && transcript.length >= 2) {
            import('../../services/FraudIntelligence').then(async ({ analyzeTextForFraud }) => {
                const tempLine = { id: 'temp', sender: 'caller' as const, text, timestamp: Date.now(), isStable: true };
                const analysis = await analyzeTextForFraud([tempLine], settings.geminiApiKey);

                if (analysis && analysis.emotional_risk_score && analysis.emotional_risk_score * 10 > currentRiskScore) {
                    updateRiskScore(analysis.emotional_risk_score * 10, analysis.key_indicators || []);
                    setLastCallAnalysis(analysis); // Save for scorecard
                }
            });

            const localAnalysis = analyzeTextForRisk(text, currentRiskScore);
            updateRiskScore(localAnalysis.score, localAnalysis.detected);
        }
    };

    // ... existing speech hooks ...
    const callerSpeech = useSpeechRecognition((text) => handleTranscript(text, 'caller'), 2000);
    const receiverSpeech = useSpeechRecognition((text) => handleTranscript(text, 'receiver'), 2000);

    // ... Timer ...
    const [duration, setDuration] = useState(0);
    useEffect(() => {
        let interval: any;
        if (isCallActive) {
            interval = setInterval(() => setDuration(d => d + 1), 1000);
        } else {
            setDuration(0);
        }
        return () => clearInterval(interval);
    }, [isCallActive]);

    const handleStartCall = () => {
        startCall();
        setShowScorecard(false);
        setLastCallAnalysis(null);
        // Auto-start Caller logic to enforce "Caller First" flow seamlessly
        setTimeout(() => callerSpeech.startListening(), 100);
    };

    const handleEndCall = () => {
        // Save history first
        addHistoryEntry({
            id: Math.random().toString(36),
            date: format(new Date(), 'dd/MM/yyyy'),
            time: format(new Date(), 'HH:mm:ss'),
            duration: duration,
            callerNumber: '+1 (555) 019-2834',
            callerRelationship: 'Unknown',
            riskScore: currentRiskScore,
            transcript: transcript,
            analysis: lastCallAnalysis,
            alertTriggered: currentRiskScore >= 30,
            scamCategory: detectedPatterns.length > 0 ? detectedPatterns[0] : 'Unknown',
            cyberCellReportId: cyberCellReportId || undefined // Save report ID
        });

        callerSpeech.stopListening();
        receiverSpeech.stopListening();

        // Show Scorecard instead of immediate reset
        setShowScorecard(true);
        // We do NOT reset state immediately to allow Scorecard to read data if needed,
        // but here we are passing data via history or local state.
        // Actually, store reset clears everything. We should wait to reset until scorecard closed.
    };

    const closeScorecard = () => {
        setShowScorecard(false);
        resetState();
    };

    // Mute Logic (Simulation)
    const [isMuted, setIsMuted] = useState(false);

    return (
        <>
            <GuardianToast />
            {currentRiskScore >= 60 && isCallActive && !isAlertIgnored && (
                <RedAlertPopup
                    riskScore={currentRiskScore}
                    pattern={detectedPatterns[detectedPatterns.length - 1] || "Suspicious Activity"}
                    onEndCall={handleEndCall}
                    onIgnore={ignoreAlert}
                />
            )}

            {/* Safety Scorecard Modal */}
            {showScorecard && (
                <SafetyScorecard
                    riskScore={currentRiskScore}
                    analysis={lastCallAnalysis}
                    cyberCellReportId={cyberCellReportId || undefined}
                    onClose={closeScorecard}
                />
            )}

            <CyberCellToast />

            {/* Quick Action Bar */}
            <QuickActionBar
                isCallActive={isCallActive}
                onEndCall={handleEndCall}
                onMuteToggle={() => setIsMuted(!isMuted)}
                isMuted={isMuted}
                currentRisk={currentRiskScore}
            />

            <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500 pb-24">
                {/* Top Status Bar */}
                {/* Top Status Bar - Elder Mode / Standard */}
                <div className={clsx(
                    "backdrop-blur-md border rounded-xl flex justify-between items-center transition-all",
                    settings.elderMode
                        ? "bg-slate-900 border-white/20 p-6"
                        : "bg-slate-900/50 border-white/5 p-4"
                )}>
                    <div className="flex items-center space-x-4">
                        {isCallActive ? (
                            <div className={clsx("flex items-center space-x-3", settings.elderMode ? "text-emerald-400" : "text-emerald-400")}>
                                <span className={clsx(
                                    "rounded-full animate-pulse bg-emerald-400",
                                    settings.elderMode ? "w-4 h-4" : "w-2 h-2"
                                )}></span>
                                <span className={clsx(
                                    "font-mono tracking-widest",
                                    settings.elderMode ? "text-xl font-bold uppercase" : "text-sm"
                                )}>
                                    {settings.elderMode ? "SECURE CALL IN PROGRESS" : "SECURE LINE ACTIVE"}
                                </span>
                                {!settings.elderMode && (
                                    <>
                                        <span className="text-slate-600 px-2">|</span>
                                        <Activity className="w-4 h-4 animate-pulse" />
                                        <span className="text-xs text-slate-500">Monitoring...</span>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 text-slate-500">
                                <div className={clsx("rounded-full bg-slate-600", settings.elderMode ? "w-4 h-4" : "w-2 h-2")}></div>
                                <span className={clsx("font-mono uppercase", settings.elderMode ? "text-xl font-bold" : "text-sm")}>
                                    {settings.elderMode ? "SYSTEM READY" : "System Standby"}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {settings.guardianContact && settings.elderMode && (
                            <div className="flex items-center space-x-2 bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/30">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-blue-200 font-bold text-sm">Guardian Connected</span>
                            </div>
                        )}

                        {isCallActive && (
                            <button
                                onClick={handleEndCall}
                                className={clsx(
                                    "flex items-center transition-colors shadow-lg shadow-red-500/20 rounded-lg font-bold text-white",
                                    settings.elderMode
                                        ? "bg-red-600 hover:bg-red-700 px-8 py-4 text-xl"
                                        : "bg-red-500 hover:bg-red-600 px-4 py-2 text-sm"
                                )}
                            >
                                <PhoneOff className={clsx("mr-2", settings.elderMode ? "w-6 h-6" : "w-4 h-4")} />
                                {settings.elderMode ? "HANG UP NOW" : "END CALL"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Split View */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] min-h-[600px]">

                    {/* LEFT: Caller Simulator (3 cols) */}
                    <div className="lg:col-span-3 h-full">
                        <div className={clsx(
                            "h-full glass-panel p-6 flex flex-col justify-between transition-all duration-500 border-l border-white/5 relative overflow-hidden group/caller",
                            callerSpeech.isListening
                                ? "bg-gradient-to-b from-red-500/10 to-slate-900/50 shadow-[0_0_50px_rgba(220,38,38,0.1)] border-l-red-500 border-l-4"
                                : "bg-slate-900/40 hover:bg-slate-900/60"
                        )}>
                            {/* Live Waveform Background for Caller */}
                            {isCallActive && (
                                <div className="absolute inset-x-0 bottom-0 h-48 z-0 opacity-30 pointer-events-none mix-blend-screen">
                                    <VoiceWaveform isActive={callerSpeech.isListening} color="text-red-500" />
                                </div>
                            )}

                            {/* Decorative Grid Background */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

                            <div className="flex-1 flex flex-col justify-center items-center relative z-10">
                                <div className="relative">
                                    {/* Holographic Ring */}
                                    {isCallActive && (
                                        <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-[spin_10s_linear_infinite]"></div>
                                    )}
                                    <div className={clsx(
                                        "w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-500 relative z-10 backdrop-blur-sm",
                                        isCallActive
                                            ? "bg-red-500/10 text-red-400 border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse-slow"
                                            : "bg-slate-800/50 text-slate-600 border border-white/5 grayscale"
                                    )}>
                                        {isCallActive ? <Activity className="w-12 h-12 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" /> : <Phone className="w-12 h-12" />}
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight group-hover/caller:text-red-100 transition-colors">The Caller</h2>
                                <p className="text-[10px] font-mono text-red-400 uppercase tracking-[0.2em] bg-red-950/30 px-3 py-1 rounded border border-red-500/20 shadow-[0_0_10px_rgba(220,38,38,0.1)]">
                                    Remote Party
                                </p>
                            </div>

                            <div className="relative z-10 mt-6">
                                {isCallActive ? (
                                    <>
                                        <button
                                            onClick={callerSpeech.isListening ? callerSpeech.stopListening : callerSpeech.startListening}
                                            className={clsx(
                                                "w-full py-8 rounded-xl font-bold uppercase tracking-widest text-xs flex flex-col items-center transition-all duration-300 shadow-2xl active:scale-[0.98] group/btn border backdrop-blur-md",
                                                callerSpeech.isListening
                                                    ? "bg-red-500/10 text-white border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.15)]"
                                                    : "bg-slate-800/80 text-slate-500 hover:bg-slate-700/80 border-white/5"
                                            )}
                                        >
                                            {callerSpeech.isListening ? (
                                                <MicOff className="w-6 h-6 mb-3 text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                                            ) : (
                                                <Mic className="w-6 h-6 mb-3 group-hover/btn:text-white transition-colors" />
                                            )}
                                            <span className={callerSpeech.isListening ? "text-red-400 animate-pulse" : ""}>
                                                {callerSpeech.isListening ? 'Transmission Active' : 'Tap to Speak'}
                                            </span>
                                        </button>
                                        {callerSpeech.error && <p className="text-xs text-red-400 text-center mt-2 font-mono">{callerSpeech.error}</p>}
                                    </>
                                ) : (
                                    <div className="space-y-4 w-full">
                                        <div className="flex justify-center items-center space-x-2 text-slate-500 text-[10px] uppercase tracking-widest font-mono">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                            <span>Connection: Idle</span>
                                        </div>
                                        <button
                                            onClick={handleStartCall}
                                            className="w-full relative overflow-hidden group bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 py-4 rounded-xl font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] active:scale-[0.98]"
                                        >
                                            <div className="flex items-center justify-center space-x-2 relative z-10">
                                                <Phone className="w-4 h-4 fill-current" />
                                                <span className="text-xs">Start Call</span>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE: Real-time Analysis Center (6 cols) */}
                    <div className="lg:col-span-6 flex flex-col space-y-4 h-full">
                        {/* Top Stats Row: Risk Dial & Trust Graph */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-56"> {/* Increased height for better dial visibility */}

                            {/* NEW: Central Risk Dial (Takes up 2/3 space) */}
                            <div className="md:col-span-2 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/5 relative overflow-hidden flex flex-col items-center justify-center group shadow-2xl">
                                {/* Subtle Radar Grid Background */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-50"></div>
                                <div className="absolute inset-0 border-[0.5px] border-white/5 rounded-full scale-[0.8] opacity-20"></div>
                                <div className="absolute inset-0 border-[0.5px] border-white/5 rounded-full scale-[0.6] opacity-20"></div>

                                {/* Dial Container */}
                                <div className="relative z-10 flex flex-col items-center justify-center">
                                    <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                                        {/* Outer Glow Ring */}
                                        <div className={clsx(
                                            "absolute inset-0 rounded-full border-4 opacity-20 animate-pulse-slow",
                                            currentRiskScore > 50 ? "border-red-500" : "border-cyan-500"
                                        )}></div>

                                        {/* Progress Ring */}
                                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="58"
                                                fill="none"
                                                stroke={currentRiskScore > 50 ? "#334155" : "#1e293b"}
                                                strokeWidth="4"
                                            />
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="58"
                                                fill="none"
                                                stroke={currentRiskScore > 60 ? "#ef4444" : currentRiskScore > 30 ? "#f59e0b" : "#06b6d4"}
                                                strokeWidth="4"
                                                strokeDasharray="364"
                                                strokeDashoffset={364 - (364 * currentRiskScore) / 100}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 ease-out"
                                            />
                                        </svg>

                                        {/* Center Text */}
                                        <div className="flex flex-col items-center">
                                            <span className={clsx(
                                                "text-4xl font-black tracking-tighter transition-colors duration-300",
                                                currentRiskScore > 60 ? "text-red-500" : "text-white"
                                            )}>
                                                {currentRiskScore}
                                            </span>
                                            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mt-1">Risk Score</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className={clsx(
                                            "px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.15em] shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-500 bg-slate-900/80 backdrop-blur-xl",
                                            currentRiskScore > 60
                                                ? "border-red-500/50 text-red-400 shadow-red-500/20"
                                                : currentRiskScore > 30
                                                    ? "border-amber-500/50 text-amber-400 shadow-amber-500/20"
                                                    : "border-cyan-500/50 text-cyan-400 shadow-cyan-500/20"
                                        )}>
                                            {currentRiskScore > 60 ? <div className="flex items-center"><Activity className="w-3 h-3 mr-2 animate-pulse" /> Critical Threat</div> :
                                                currentRiskScore > 30 ? <div className="flex items-center"><Activity className="w-3 h-3 mr-2" /> Potential Risk</div> :
                                                    <div className="flex items-center"><Lock className="w-3 h-3 mr-2" /> System Secure</div>}
                                        </div>

                                        {/* CYBER CELL NOTIFICATION BADGE */}
                                        {cyberCellReportId && (
                                            <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center shadow-[0_0_10px_rgba(59,130,246,0.2)] animate-in slide-in-from-bottom-2 duration-500 group/badge cursor-help">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-2"></div>
                                                Cyber Cell Notified
                                                {/* Tooltip */}
                                                <div className="absolute opacity-0 group-hover/badge:opacity-100 transition-opacity bg-slate-900 text-xs text-white p-2 rounded shadow-xl border border-white/10 -bottom-8 pointer-events-none whitespace-nowrap z-50">
                                                    Fraud details sent to Cyber Cell
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Trust Timeline (Enhanced Layout) */}
                            <div className="md:col-span-1 h-full">
                                <TrustDegradationTimeline trustScore={trustScore} />
                            </div>
                        </div>

                        {/* Transcript Area */}
                        <div className="flex-1 glass-panel p-0 flex flex-col relative overflow-hidden bg-slate-950/50 border border-white/5 rounded-2xl group">
                            <div className="p-3 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
                                <h3 className="text-xs font-mono text-slate-400 flex items-center uppercase tracking-wider">
                                    <Activity className="w-3 h-3 mr-2 text-blue-500" />
                                    _Encrypted_Transcript_Log
                                </h3>
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 rounded-full bg-red-500/20 animate-pulse"></div>
                                    <div className="w-2 h-2 rounded-full bg-amber-500/20 animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500/20 animate-pulse delay-150"></div>
                                </div>
                            </div>

                            <div className="relative flex-1">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                                {transcript.length === 0 ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                                        <div className="relative mb-4">
                                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                                            <div className="w-16 h-16 rounded-full border border-slate-700 flex items-center justify-center relative z-10 bg-slate-900/50 backdrop-blur-sm">
                                                <Activity className="w-8 h-8 text-slate-500 animate-pulse" />
                                            </div>
                                        </div>
                                        <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1">System Standby</p>
                                        <p className="text-[10px] text-slate-600 font-mono">Waiting for voice stream input...</p>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0">
                                        <LiveTranscript />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Receiver Simulator (3 cols) */}
                    <div className="lg:col-span-3 h-full">
                        <div className={clsx(
                            "h-full glass-panel p-6 flex flex-col justify-between transition-all duration-500 border-r border-white/5 relative overflow-hidden group/receiver",
                            receiverSpeech.isListening
                                ? "bg-gradient-to-b from-emerald-500/10 to-slate-900/50 shadow-[0_0_50px_rgba(16,185,129,0.1)] border-r-emerald-500 border-r-4"
                                : "bg-slate-900/40 hover:bg-slate-900/60"
                        )}>
                            {/* AI Whisper Overlay */}
                            <div className="absolute top-4 left-4 right-4 z-20">
                                <AIWhisperHUD message={whisperMessage} />
                            </div>

                            {/* Live Waveform Background for Receiver */}
                            {isCallActive && (
                                <div className="absolute inset-x-0 bottom-0 h-48 z-0 opacity-30 pointer-events-none mix-blend-screen">
                                    <VoiceWaveform isActive={receiverSpeech.isListening} color="text-emerald-400" />
                                </div>
                            )}

                            {/* Decorative Hex Grid */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>


                            <div className="flex-1 flex flex-col justify-center items-center relative z-10 pt-20">
                                <div className="relative">
                                    {/* Holographic Ring */}
                                    {isCallActive && (
                                        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-[spin_12s_linear_infinite_reverse]"></div>
                                    )}
                                    <div className="w-32 h-32 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 text-emerald-500 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-sm relative z-10">
                                        <User className="w-16 h-16 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight group-hover/receiver:text-emerald-100 transition-colors">The Receiver</h2>
                                <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.2em] bg-emerald-950/30 px-3 py-1 rounded border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                    You / Protected
                                </p>
                            </div>

                            <div className="relative z-10 mt-6 md:mb-0 mb-8">
                                {isCallActive ? (
                                    <>
                                        <button
                                            disabled={!transcript.some(t => t.sender === 'caller')}
                                            onClick={receiverSpeech.isListening ? receiverSpeech.stopListening : receiverSpeech.startListening}
                                            className={clsx(
                                                "w-full py-8 rounded-xl font-bold uppercase tracking-widest text-xs flex flex-col items-center transition-all duration-300 shadow-xl active:scale-[0.98] group/btn border backdrop-blur-md",
                                                receiverSpeech.isListening
                                                    ? "bg-emerald-500/10 text-white shadow-[0_0_30px_rgba(16,185,129,0.15)] border-emerald-400/50"
                                                    : !transcript.some(t => t.sender === 'caller')
                                                        ? "bg-slate-900/50 text-slate-700 cursor-not-allowed border-transparent grayscale opactiy-50"
                                                        : "bg-slate-800/80 text-emerald-400 hover:bg-slate-700/80 border-emerald-500/30"
                                            )}
                                        >
                                            {receiverSpeech.isListening ? (
                                                <MicOff className="w-6 h-6 mb-3 animate-pulse text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                            ) : (
                                                <Mic className="w-6 h-6 mb-3 group-hover/btn:text-emerald-200 transition-colors" />
                                            )}
                                            <span>{receiverSpeech.isListening ? 'Secure Input Active' : 'Tap to Speak'}</span>

                                            {!transcript.some(t => t.sender === 'caller') && (
                                                <span className="text-[9px] mt-2 font-mono uppercase tracking-wider text-amber-500/80 bg-amber-950/30 px-2 py-1 rounded border border-amber-500/20">
                                                    Waiting for Caller...
                                                </span>
                                            )}
                                        </button>
                                        {receiverSpeech.error && <p className="text-xs text-red-400 text-center mt-2 font-mono">{receiverSpeech.error}</p>}
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};
