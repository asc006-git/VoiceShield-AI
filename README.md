# VoiceShield AI (Real-Time Call Fraud Detection and Protection System)

---

## Introduction

Voice-based scams are increasing at an alarming rate. Fraudsters exploit live phone calls to deceive users by impersonating trusted authorities such as banks, police, or government officials. These scams heavily rely on emotional manipulation, urgency tactics, and psychological pressure, which often leads users to panic and make irreversible mistakes during the call itself.

Elderly individuals, digitally unaware users, and first-time internet adopters are particularly vulnerable. In most cases, fraud is completed before any external system can intervene.

Traditional fraud detection systems focus on post-transaction analysis, which means they act only after financial or emotional damage has already occurred. There is very limited protection available during live phone conversations, where the actual scam takes place.

VoiceShield AI is designed to address this gap by providing real-time protection during calls, not after them.

---

## Project Overview

VoiceShield AI is a real-time call fraud detection system that acts as a digital guardian during live phone calls.

The system continuously analyzes live call audio by converting speech into text and processing it using AI. Based on detected scam indicators and emotional manipulation patterns, it calculates a dynamic risk score and provides proactive safety actions to the user while the call is still ongoing.

The core philosophy of VoiceShield AI is prevention rather than recovery. Instead of reacting after fraud has occurred, the system focuses on stopping scams before damage happens.

---

## How VoiceShield AI Works

1. Live call audio is captured from the user
2. Speech is converted into real-time text transcripts
3. The transcript is analyzed using the Gemini API
4. Scam indicators and emotional pressure signals are detected
5. A risk score is calculated dynamically
6. Based on risk level, the system takes appropriate protective actions

All analysis is performed during the call to ensure immediate user protection.

---

## Key Features

### Real-Time Scam Detection

VoiceShield AI continuously monitors live call transcripts and looks for common scam indicators such as:

- Authority impersonation (bank officials, police, government representatives)
- Urgency-based language and threats
- Requests for OTP, PIN, CVV, or direct money transfer
- Emotional manipulation techniques designed to create panic or fear

---

### Risk Scoring and Classification

Each call is assigned a dynamic risk score between 0 and 100.

Risk levels are classified as follows:

- Low Risk: less than 30  
  The call is considered safe and normal.

- Medium Risk: between 30 and 70  
  The call may be suspicious. Users are advised not to share sensitive information.

- High Risk: greater than 70  
  The call is considered highly suspicious. Immediate action is recommended.

---

### User Safety Alerts

Based on the risk level, the system displays clear and simple warnings.

Low Risk  
The user can continue the conversation normally.

Medium Risk  
The system warns the user not to share OTPs or sensitive information.

High Risk  
A strong alert is displayed, advising the user to end the call immediately.

---

### Guardian Mode for Elderly Protection

VoiceShield AI includes a guardian mode specifically designed for elderly and vulnerable users.

Users can register a trusted guardian, such as a family member. When a high-risk call is detected, the guardian is notified automatically. This helps reduce emotional pressure and provides real-time support to the user.

---

### Explainable AI and Transparency

VoiceShield AI does not provide unexplained warnings.

The system clearly explains:
- Why a call is considered risky
- Which indicators triggered the alert

All explanations are provided in simple, non-technical language to build trust and long-term awareness among users.

---

## Cyber Cell Escalation (High Risk Only)

In high-risk cases, VoiceShield AI offers an optional cyber cell escalation feature.

This feature is enabled only with explicit user consent.

When activated, the system prepares a structured digital evidence report to assist cyber authorities in investigation.

---

### Evidence Report Structure

```json
{
  "fraudster_number": "+91XXXXXXXXXX",
  "timestamp": "YYYY-MM-DD HH:MM:SS",
  "scam_type": "Bank Impersonation / OTP Fraud / Emergency Scam",
  "risk_score": 85,
  "key_indicators": [
    "Authority impersonation",
    "Urgency pressure",
    "OTP request",
    "Emotional manipulation"
  ]
}
````

---

### User Transparency and Control

Before any escalation:

* The user is informed about what data will be shared
* The reason for escalation is clearly explained
* No banking credentials or private financial details are shared

The generated report is meant to assist investigation and does not imply guilt or automatic legal action.

---

## Technology Stack

Frontend

* Web-based user interface built using React.js

Backend

* Node.js or Python-based services

AI Engine

* Gemini API for real-time transcript analysis

Real-Time Processing

* Streaming speech-to-text analysis

Database

* Guardian information and report logs

Deployment

* Hackathon demonstration environment (On Vercel)

Development Environment

* Google Antigravity

---

## Deployed Application

```
https://voiceshield-ai.vercel.app
```

---

## Setup and Installation

```bash
git clone https://github.com/asc006-git/VoiceShield-AI.git
cd VoiceShield-AI-main
npm install
npm run dev
```

For demonstration purposes, live calls are simulated using microphone input or pre-recorded call transcripts.

---

## Usage Instructions

1. Launch the web application
2. Simulate a call using microphone input or a sample transcript
3. Observe real-time risk score updates and safety alerts
4. Enable guardian mode if required
5. For high-risk calls, review the cyber cell report preview and confirm escalation

---

## Social Impact

VoiceShield AI aims to reduce financial and emotional harm caused by voice-based scams.

The system:

* Protects elderly and vulnerable users
* Prevents scams before damage occurs
* Encourages responsible cybercrime reporting
* Demonstrates ethical and transparent AI usage

---

## Conclusion

VoiceShield AI shifts fraud detection from a reactive, post-event approach to a real-time protection framework.

By combining live AI analysis, guardian involvement, and responsible escalation, the system presents a scalable and socially impactful solution for modern call-based fraud prevention.

---

## Contributions

Contributions are welcome.
If you have ideas for improvements, feature enhancements, or bug fixes, feel free to fork the repository and submit a pull request.
