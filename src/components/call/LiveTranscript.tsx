import { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import clsx from 'clsx';
import { User } from 'lucide-react';

export const LiveTranscript = () => {
    const transcript = useStore(state => state.transcript);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    return (
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-[200px] max-h-[400px]">
            {transcript.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-600 mb-2"></div>
                    <p className="text-sm">Conversation Log Empty. Tap "TAP TO SPEAK" to begin.</p>
                </div>
            ) : (
                transcript.map((line) => (
                    <div
                        key={line.id}
                        className={clsx(
                            "flex flex-col max-w-[85%]",
                            line.sender === 'receiver' ? "ml-auto items-end" : "mr-auto items-start"
                        )}
                    >
                        <span className="text-xs text-slate-500 mb-1 capitalize flex items-center">
                            {line.sender === 'caller' && <User className="w-3 h-3 mr-1" />}
                            {line.sender === 'receiver' ? 'You' : 'Caller'}
                        </span>
                        <div className={clsx(
                            "p-3 rounded-2xl text-sm leading-relaxed",
                            line.sender === 'receiver'
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-slate-800 text-slate-200 rounded-tl-none border border-white/5"
                        )}>
                            {line.text}
                        </div>
                        <span className="text-[10px] text-slate-600 mt-1">
                            {new Date(line.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    </div>
                ))
            )}
            <div ref={bottomRef} />
        </div>
    );
};
