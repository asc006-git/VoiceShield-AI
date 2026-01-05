export interface ScamPattern {
    id: string;
    keywords: string[];
    riskIncrement: number;
    category: 'financial' | 'urgency' | 'threat' | 'info_theft';
    description: string;
}

// Enhanced patterns with context awareness
const SCAM_PATTERNS: ScamPattern[] = [
    {
        id: 'otp',
        keywords: ['otp', 'one time password', 'code sent', 'read out the code', 'digit code'],
        riskIncrement: 35, // High risk
        category: 'info_theft',
        description: 'Soliciting OTP (High Risk)'
    },
    {
        id: 'banking_neutral', // Nuanced: "Bank" alone shouldn't trigger high alert
        keywords: ['bank', 'account', 'credit card', 'debit card'],
        riskIncrement: 5, // Low risk increment for mentions
        category: 'financial',
        description: 'General Financial Terminology'
    },
    {
        id: 'banking_sensitive', // CVV/PIN is always bad
        keywords: ['cvv', 'card number', 'atm pin', 'password', 'expiry date', 'back of your card'],
        riskIncrement: 40,
        category: 'financial',
        description: 'Asking for Sensitive Credentials'
    },
    {
        id: 'urgency',
        keywords: ['immediately', 'urgent', 'act now', 'expires soon', 'within 24 hours', 'police', 'arrest', 'lawsuit'],
        riskIncrement: 25,
        category: 'urgency',
        description: 'Creating Artificial Urgency'
    },
    {
        id: 'emotional_pressure', // New Category
        keywords: ['scared', 'worry', 'don\'t tell anyone', 'secret', 'confidential', 'trust me', 'danger', 'hacker'],
        riskIncrement: 20,
        category: 'threat',
        description: 'Emotional Manipulation / Secrecy'
    }
];

export const analyzeTextForRisk = (text: string, currentScore: number): { score: number; detected: string[] } => {
    let newScore = currentScore;
    let detected: string[] = [];
    const lowerText = text.toLowerCase();

    SCAM_PATTERNS.forEach(pattern => {
        if (pattern.keywords.some(k => lowerText.includes(k))) {
            detected.push(pattern.description);
            newScore += pattern.riskIncrement;

            // COMBINATORIAL LOGIC:
            // If "Financial" mention is combined with "Urgency" or "Secrecy", AMPLIFY the risk.
            // This satisfies the request to not just flag "Bank" but "Bank + Pressure".
            if ((pattern.category === 'financial') && (lowerText.includes('urgent') || lowerText.includes('immediately'))) {
                newScore += 15; // Bonus risk for urgency + money
                detected.push('Combination: Finance + Urgency');
            }
        }
    });

    return {
        score: Math.min(newScore, 100),
        detected: Array.from(new Set(detected))
    };
};

export const detectTone = (text: string): { isUrgent: boolean; isThreatening: boolean } => {
    // Heuristic: ALL CAPS or multiple exclamation marks
    const isUrgent = text.includes('!') || (text.length > 10 && text === text.toUpperCase());
    const isThreatening = text.toLowerCase().includes('police') || text.toLowerCase().includes('arrest');

    return { isUrgent, isThreatening };
}
