import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, CallLog, UserRole } from '../types';

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            // Initial State
            isCallActive: false,
            callDuration: 0,
            callerMetadata: {
                relationship: 'Unknown',
                numberKnown: false,
                name: 'Unknown Caller',
            },
            transcript: [],
            currentRiskScore: 0,
            detectedPatterns: [],
            trustScore: 100, // Starts perfect
            whisperMessage: null,
            conversationContext: "",
            callHistory: [],
            isAlertIgnored: false,
            guardianNotified: false,
            cyberCellReportId: null,
            settings: {
                elderMode: false,
                language: 'en',
                notificationsEnabled: true,
                riskSensitivity: 'medium',
                geminiApiKey: "AIzaSyAJ2jmO99eXM6MLpThZ5EDwVysd_P_p_tI",
            },

            // Actions
            startCall: () => set({
                isCallActive: true,
                callDuration: 0,
                transcript: [],
                currentRiskScore: 0,
                detectedPatterns: [],
                trustScore: 100,
                whisperMessage: null,
                conversationContext: "",
                isAlertIgnored: false,
                guardianNotified: false,
                cyberCellReportId: null
            }),

            ignoreAlert: () => set({ isAlertIgnored: true }),

            endCall: () => set({ isCallActive: false }),

            updateTranscript: (role: UserRole, text: string, isStable: boolean) => set((state) => {
                const newLine = {
                    id: Math.random().toString(36).substr(2, 9),
                    sender: role,
                    text,
                    timestamp: Date.now(),
                    isStable
                };

                // Append to context if stable
                let newContext = state.conversationContext;
                if (isStable) {
                    newContext += `\n${role.toUpperCase()}: ${text}`;
                }

                return {
                    transcript: [...state.transcript, newLine],
                    conversationContext: newContext
                };
            }),

            updateRiskScore: (score: number, patterns: string[]) => set((state) => {
                // Whisper Logic
                let whisper = state.whisperMessage;
                let notified = state.guardianNotified;
                let reportId = state.cyberCellReportId;

                if (score > 40 && state.currentRiskScore <= 40) {
                    whisper = "Warning: Suspicious patterns detected. Do not share personal info.";
                } else if (score > 60 && state.currentRiskScore <= 60) {
                    whisper = "Critical: Risk level extreme. Guardian alert system pre-armed.";

                    // Simulate Guardian Alert if configured and not yet notified
                    if (state.settings.guardianContact && !state.guardianNotified) {
                        // We set notified to true to prevent spam
                        notified = true;
                    }

                    // CYBER CELL AUTOMATION (Demo Logic)
                    // Trigger at > 60% risk for visibility
                    if (!reportId) {
                        const randomId = Math.floor(100000 + Math.random() * 900000);
                        reportId = `CC-${randomId}`;
                    }
                }

                // Trust degrades
                const newTrust = Math.max(0, 100 - score);

                return {
                    currentRiskScore: score,
                    detectedPatterns: patterns,
                    whisperMessage: whisper,
                    trustScore: newTrust,
                    guardianNotified: notified,
                    cyberCellReportId: reportId
                };
            }),

            setTrustScore: (score: number) => set({ trustScore: score }),
            setWhisperMessage: (msg: string | null) => set({ whisperMessage: msg }),
            addToContext: (text: string) => set((state) => ({ conversationContext: state.conversationContext + text })),

            addHistoryEntry: (entry: CallLog) => set((state) => ({
                callHistory: [entry, ...state.callHistory]
            })),

            toggleElderMode: () => set((state) => ({
                settings: { ...state.settings, elderMode: !state.settings.elderMode }
            })),

            toggleGuardianEnabled: () => set((state) => ({
                settings: { ...state.settings, notificationsEnabled: !state.settings.notificationsEnabled }
            })),

            toggleLanguage: () => set((state) => ({
                settings: { ...state.settings, language: state.settings.language === 'en' ? 'hi' : 'en' }
            })),

            setGeminiApiKey: (key: string) => set((state) => ({
                settings: { ...state.settings, geminiApiKey: key }
            })),

            setGuardianName: (name: string) => set((state) => ({
                settings: { ...state.settings, guardianName: name }
            })),

            setGuardianContact: (contact: string) => set((state) => ({
                settings: { ...state.settings, guardianContact: contact }
            })),

            setRiskSensitivity: (level: 'low' | 'medium' | 'high') => set((state) => ({
                settings: { ...state.settings, riskSensitivity: level }
            })),

            resetState: () => set({
                isCallActive: false,
                callDuration: 0,
                transcript: [],
                currentRiskScore: 0,
                detectedPatterns: [],
                trustScore: 100,
                whisperMessage: null,
                conversationContext: "",
                isAlertIgnored: false,
                guardianNotified: false,
                cyberCellReportId: null
            })
        }),
        {
            name: 'voiceshield-storage',
            partialize: (state) => ({
                callHistory: state.callHistory,
                settings: state.settings
            }) // Only persist history and settings
        }
    )
);
