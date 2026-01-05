import { Send } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useEffect, useState } from 'react';

export const GuardianToast = () => {
    const { settings, currentRiskScore } = useStore();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (currentRiskScore >= 70 && settings.guardianContact) {
            setShow(true);
            const timer = setTimeout(() => setShow(false), 5000); // Hide after 5s
            return () => clearTimeout(timer);
        }
    }, [currentRiskScore, settings.guardianContact]);

    if (!show || !settings.guardianContact) return null;

    return (
        <div className="fixed top-24 right-4 z-50 bg-emerald-900/90 text-white p-4 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center space-x-3 animate-in slide-in-from-right fade-in duration-500">
            <div className="bg-emerald-500 p-2 rounded-full animate-bounce">
                <Send className="w-5 h-5 text-white" />
            </div>
            <div>
                <h4 className="font-bold text-sm text-emerald-300">Guardian Alert Sent</h4>
                <p className="text-xs text-white/80">
                    Notified {settings.guardianContact} of high risk.
                </p>
            </div>
        </div>
    );
};
