import type { CallAnalysis, TranscriptLine } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with a placeholder or env var. 
// Ideally, this comes from user settings.
const API_KEY = ""; // I will leave blank and handle error gracefully as per fallback requirement.

export const generateFraudAnalysis = async (transcript: TranscriptLine[], finalRiskScore: number): Promise<CallAnalysis> => {
    const fullText = transcript.map(t => `${t.sender.toUpperCase()}: ${t.text}`).join('\n');

    try {
        if (!API_KEY) throw new Error("No API Key");

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      You are an AI-powered fraud call analysis system.
      Analyze the following call transcript for scam risk.
      
      Transcript:
      ${fullText}
      
      Return ONLY valid JSON in this EXACT format:
      {
        "call_classification": "benign | potential_fraud",
        "emotional_risk_score": 1-10,
        "caller_type_assessment": "friend | relative | known_contact | unknown | suspicious | uncertain",
        "key_indicators": ["indicator1", "indicator2"],
        "reasoning": "Clear explanation."
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON from text (handle potential markdown code blocks) // TODO: robust parsing
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.warn("AI Analysis Failed or No Key, using Fallback Logic", error);

        // FALLBACK LOGIC (STRICT REQUIREMENT)
        // "If AI fails: Use fallback keyword detection. ALWAYS return analysis"

        const isFraud = finalRiskScore > 30;
        const indicators = [];
        if (fullText.toLowerCase().includes('otp')) indicators.push('OTP Solicitation');
        if (fullText.toLowerCase().includes('bank')) indicators.push('Banking Inquiry');
        if (fullText.toLowerCase().includes('urgent')) indicators.push('Urgency Pressure');

        return {
            call_classification: isFraud ? 'potential_fraud' : 'benign',
            emotional_risk_score: Math.min(Math.ceil(finalRiskScore / 10), 10),
            caller_type_assessment: isFraud ? 'suspicious' : 'uncertain',
            key_indicators: indicators.length > 0 ? indicators : ['No specific flags'],
            reasoning: isFraud
                ? `System detected high-risk patterns (${indicators.join(', ')}) consistent with known fraud scripts.`
                : "No significant fraud indicators were detected during this conversation.",
            safety_coach_tips: ["Always verify caller identity.", "Never share OTPs.", "Stay calm under pressure."]
        };
    }
};

export const analyzeTextForFraud = async (transcript: TranscriptLine[], apiKey?: string): Promise<CallAnalysis> => {
    // If API Key is present, try accurate AI analysis
    // If API Key is present, try accurate AI analysis
    if (apiKey) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const conversationText = transcript.map(t => `${t.sender}: ${t.text}`).join('\n');
            const prompt = `
            SYSTEM PROMPT (MASTER INSTRUCTION)
            You are Google Antigravity, an AI-powered real-time scam detection and risk
            assessment engine designed to protect users from phone-based fraud.
            
            Your task is to analyze call transcripts and determine the likelihood of fraud 
            by evaluating emotional pressure, behavioral patterns, and known scam indicators.
            
            🔹 RISK SCORING LOGIC (MANDATORY)
            Assign a risk_score (0-100).
            - Emotional pressure/Panic/Urgency -> Increases Risk
            - Sensitive info requests (OTP, PIN, Bank) -> Major Risk
            - Authority Impersonation -> Major Risk
            - Normal tone -> Low Risk

            🔹 RISK LEVEL CLASSIFICATION
            - LOW: < 30
            - MEDIUM: 30-70
            - HIGH: > 70

            🔹 OUTPUT FORMAT (STRICT JSON ONLY)
            Return ONLY valid JSON:
            {
              "risk_score": 0-100,
              "risk_level": "LOW | MEDIUM | HIGH",
              "detected_indicators": ["indicator1", "indicator2"],
              "emotional_state_summary": "Brief description",
              "user_message": "User facing warning or null",
              "system_action": "none | show_warning | show_high_risk_popup",
              "reasoning": "Explanation",
              "safety_coach_tips": ["tip1", "tip2", "tip3"]
            }

            Transcript:
            ${conversationText}
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean markdown if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const analysis = JSON.parse(jsonStr);

            return {
                call_classification: analysis.risk_score > 70 ? 'potential_fraud' : 'benign',
                emotional_risk_score: Math.ceil(analysis.risk_score / 10), // Map 0-100 to 1-10 for compatibility
                caller_type_assessment: analysis.risk_score > 50 ? 'suspicious' : 'uncertain',
                key_indicators: analysis.detected_indicators || [],
                reasoning: analysis.reasoning || "AI Risk Assessment Completed.",
                safety_coach_tips: analysis.safety_coach_tips || ["Verify caller identity.", "Do not share OTPs."]
            };

        } catch (error) {
            console.error("Gemini API Error, falling back to local logic:", error);
            // Fallthrough to local logic
        }
    }

    // fallback logic...
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

    // Simple keyword based fallback
    const text = transcript.map(t => t.text.toLowerCase()).join(' ');
    let risk = 1; // 1-10 scale
    const patterns = [];

    // Base Keywords (Low independent weight)
    const hasFinancial = text.includes('bank') || text.includes('account') || text.includes('credit');
    const hasUrgency = text.includes('urgent') || text.includes('immediately') || text.includes('now');
    const hasSecrecy = text.includes('secret') || text.includes('don\'t tell') || text.includes('private');

    // High Impact Keywords
    if (text.includes('otp') || text.includes('code') || text.includes('cvv') || text.includes('pin')) {
        risk += 5; // Major jump for sensitive data
        patterns.push('Sensitive Data Request');
    }

    if (text.includes('police') || text.includes('warrant') || text.includes('arrest') || text.includes('legal')) {
        risk += 4;
        patterns.push('Authority Impersonation');
    }

    // Combinatorial Logic (The core enhancement)
    if (hasFinancial) {
        if (hasUrgency) {
            risk += 4;
            patterns.push('Financial + Urgency');
        } else if (hasSecrecy) {
            risk += 4;
            patterns.push('Financial + Secrecy');
        } else {
            risk += 1; // "Bank" alone is very low risk (+1 from base 1 = 2/10 = 20%)
            patterns.push('Financial Mention');
        }
    } else if (hasUrgency) {
        risk += 2; // Urgency alone is suspicious but not proof
        patterns.push('Urgency');
    }

    const isFraud = risk > 4;

    return {
        call_classification: isFraud ? 'potential_fraud' : 'benign',
        emotional_risk_score: Math.min(risk, 10),
        caller_type_assessment: isFraud ? 'suspicious' : 'uncertain',
        key_indicators: patterns,
        reasoning: "Analysis based on pattern combinations (API Fallback).",
        safety_coach_tips: isFraud
            ? ["Do not share OTPs with anyone.", "Hang up if pressured.", "Verify with the bank directly."]
            : ["Good job verifying the caller.", "Stay vigilant for future calls.", "Trusted contacts are safe."]
    };
};
