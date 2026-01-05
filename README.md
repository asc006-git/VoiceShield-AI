# VoiceShield AI (Real-Time Call Fraud Detection & Protection System)

Voice-based scams are rapidly increasing, with fraudsters exploiting live phone calls to deceive users—especially elderly individuals, digitally unaware users, and first-time internet adopters. These scams rely on impersonation, emotional manipulation, urgency tactics, and psychological pressure, making them extremely difficult to detect in real time.

Traditional fraud detection systems focus on **post-transaction analysis**, offering little to no protection **during live phone conversations**, where most financial and emotional damage occurs.

**VoiceShield AI** addresses this critical gap by providing **real-time AI-powered audio intelligence** that detects scam patterns *as the call is happening* and proactively protects users **before fraud occurs**.

---

## Project Overview

**VoiceShield AI** is an AI-driven, real-time call fraud detection system designed to act as a **digital guardian during live phone calls**.

The system continuously analyzes live call transcripts using the **Gemini API**, detects scam indicators and emotional pressure, assigns a dynamic risk score, and takes **proactive safety actions**—with special focus on protecting elderly and vulnerable users.

Unlike traditional systems that react after losses occur, **VoiceShield AI works during the call**, providing:
- Real-time alerts
- Clear safety guidance
- Guardian notifications
- Responsible cyber-cell escalation (with user consent)

---

## Key Features

### Real-Time Scam Detection
- Live **speech-to-text** analysis of call audio  
- Detection of scam indicators such as:
  - Authority impersonation (bank, police, government)
  - Urgency and threat-based language
  - Requests for OTP, PIN, CVV, or money
  - Emotional manipulation and panic tactics

---

### Risk Scoring & Classification
Each call is assigned a **risk score (0–100)** and classified as:

- **Low Risk:** `< 30`
- **Medium Risk:** `30 – 70`
- **High Risk:** `> 70`

---

### User Safety Alerts
**Low Risk**
> "The user can talk safely without any risk, like a normal call"

**Medium Risk**
> “Do not share OTP or sensitive information during this call.”

**High Risk**
>  Prominent **High Risk Detected** alert  
> Option to **end the call immediately**

---

### Elderly Protection – Guardian Mode
- Users can register a **trusted guardian** (family member)
- When a **high-risk call** is detected:
  - Guardian is automatically notified
  - Helps break emotional pressure and prevent scam escalation

---

### Explainable AI (User Trust)
- Clearly explains:
  - Why a call is risky
  - Which indicators were detected
- Uses **simple, non-technical language**
- Builds awareness and long-term scam resistance

---

## Innovative Feature: Cyber Cell Escalation (High Risk Only)

With **explicit user consent**, VoiceShield AI prepares a **structured digital evidence report** to assist cyber authorities.

### Evidence Report Format
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

### Transparency to Users

Before escalation, the user is informed:

* What data is shared
* Why reporting is recommended
* Confirmation that **no banking credentials** are shared

 *This report assists investigation and does not imply guilt or automatic legal action.*

---

## Tech Stack

* **Frontend:** Web-based UI (real-time demo simulation) using React.js
* **Backend:** Node.js / Python
* **AI Engine:** Gemini API
* **Real-Time Processing:** Streaming transcript analysis
* **Database:** Guardian details & report logs
* **Deployment:** Hackathon demo environment
* **IDE:** Google Antigravity
---

 ## Deployed App
 ```
 (https://voiceshield-ai.vercel.app)

 ```

## Setup & Installation

```bash
git clone https://github.com/garv0716/VoiceShield-AI
cd VoiceShield-AI
npm install
npm run dev
```
 *For demonstration purposes, live calls are simulated using microphone input or pre-recorded call transcripts.*

---

## Usage Instructions

1. Launch the web application
2. Simulate a call using:

   * Microphone input **or**
   * Preloaded transcript
3. Observe real-time:

   * Risk score updates
   * Safety alerts
   * Guardian notifications (if enabled)
4. For **High Risk** calls:

   * Review cyber cell report preview
   * Confirm escalation (demo simulation)

---

## Social Impact

* Protects elderly and vulnerable users from financial and emotional harm
* Prevents scams **before damage occurs**
* Encourages responsible cybercrime reporting
* Demonstrates ethical, transparent, and explainable AI usage

---

## Conclusion

**VoiceShield AI** transforms fraud detection from a reactive, post-event system into a **real-time, emotionally intelligent protection framework**.

By combining:

* AI-driven fraud analysis
* Guardian involvement
* Responsible cyber-cell escalation

The system delivers **strong social impact**, **real-world scalability**, and a compelling vision for the future of call safety.

---

## Contributing

Contributions are welcome and appreciated!  
If you have ideas to improve VoiceShield AI, fix bugs, or enhance features, feel free to fork the repo and submit a pull request.
