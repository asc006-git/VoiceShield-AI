export type UserRole = 'caller' | 'receiver';

export interface TranscriptLine {
    id: string;
    sender: UserRole;
    text: string;
    timestamp: number;
    isStable: boolean; // For real-time updates
}

export interface RiskFactor {
    id: string;
    name: string;
    scoreImpact: number;
    detectedAt: number;
}

export interface CallAnalysis {
    call_classification: 'benign' | 'potential_fraud';
    emotional_risk_score: number; // 1-10
    caller_type_assessment: 'friend' | 'relative' | 'known_contact' | 'unknown' | 'suspicious' | 'uncertain';
    key_indicators: string[];
    reasoning: string;
    safety_coach_tips?: string[]; // Educational tips for the user
}

export interface CallLog {
    id: string;
    date: string;
    time: string;
    duration: number; // seconds
    callerNumber: string; // simulated
    callerRelationship: string; // simulated metadata
    riskScore: number;
    transcript: TranscriptLine[];
    analysis: CallAnalysis | null;
    alertTriggered: boolean;
    scamCategory?: string;
    cyberCellReportId?: string; // NEW: Simulated report ID
}

export interface AppState {
    // Call State
    isCallActive: boolean;
    callDuration: number;
    callerMetadata: {
        relationship: string;
        numberKnown: boolean;
        name: string; // Simulated name
    };

    // Real-time Data
    transcript: TranscriptLine[];
    currentRiskScore: number;
    detectedPatterns: string[];

    // Innovation Features
    trustScore: number; // 0-100, starts at 100
    whisperMessage: string | null; // AI Whisper hint
    conversationContext: string; // Accumulated context
    isAlertIgnored: boolean;
    guardianNotified: boolean;
    cyberCellReportId: string | null; // NEW: Tracks active report status

    // History
    callHistory: CallLog[];

    // Settings
    settings: {
        elderMode: boolean;
        language: 'en' | 'hi';
        notificationsEnabled: boolean;
        geminiApiKey?: string;
        guardianName?: string; // NEW
        guardianContact?: string;
        riskSensitivity?: 'low' | 'medium' | 'high';
    };

    // Actions
    startCall: () => void;
    ignoreAlert: () => void;
    endCall: () => void;
    updateTranscript: (role: UserRole, text: string, isStable: boolean) => void;
    updateRiskScore: (score: number, patterns: string[]) => void;
    setTrustScore: (score: number) => void;
    setWhisperMessage: (msg: string | null) => void;
    addToContext: (text: string) => void;
    addHistoryEntry: (entry: CallLog) => void;
    toggleElderMode: () => void;
    toggleGuardianEnabled: () => void; // NEW
    toggleLanguage: () => void; // NEW
    setGeminiApiKey: (key: string) => void;
    setGuardianName: (name: string) => void; // NEW
    setGuardianContact: (contact: string) => void;
    setRiskSensitivity: (level: 'low' | 'medium' | 'high') => void;
    resetState: () => void;
}
