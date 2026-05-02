import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ShieldCheck, MessageSquare, ChevronRight, Activity } from 'lucide-react';

const TechnocracyCodec = ({ 
  dialogue = "",
  stepName = "",
  onTypingComplete = () => {} 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [isCalling, setIsCalling] = useState(true);
  const [signalLevel, setSignalLevel] = useState(Array(12).fill(0));

  useEffect(() => {
    setIsCalling(true);
    setDisplayedText('');
  }, [dialogue]);

  useEffect(() => {
    if (isCalling) {
      const timeout = setTimeout(() => setIsCalling(false), 1200);
      return () => clearTimeout(timeout);
    }

    if (displayedText.length < dialogue.length) {
      const timer = setTimeout(() => {
        setDisplayedText(dialogue.slice(0, displayedText.length + 1));
      }, 25);
      return () => clearTimeout(timer);
    } else {
      onTypingComplete();
    }
  }, [displayedText, dialogue, isCalling, onTypingComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignalLevel(prev => prev.map(() => Math.floor(Math.random() * 100)));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#05070a] p-4 font-mono uppercase tracking-wider border-2 border-slate-700 rounded-sm overflow-hidden relative">
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      {/* Header Info: NWO Style */}
      <div className="w-full flex justify-between text-slate-400 text-[10px] mb-4 px-2 border-b border-slate-800 pb-1">
        <div className="flex items-center gap-2">
          <ShieldCheck size={12} className="text-blue-500" />
          <span>TECH-UNION::SECURE_CHANNEL::INTERNAL</span>
        </div>
        <div className="flex gap-4">
          <span>THREAT_LEVEL: MINIMAL</span>
          <span className="text-blue-400">LOGGED BY: CONTROL</span>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-full max-w-2xl gap-8 relative z-10">
        
        {/* Left Side: Subject Identification */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-40 border border-slate-700 bg-slate-900/40 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="text-slate-600 animate-pulse">
               <Activity size={32} />
             </div>
            <span className="text-slate-500 text-[9px] mt-2">SUBJECT_ID</span>
            <div className="absolute top-0 left-0 p-1 border-b border-r border-slate-700 text-[8px] text-slate-700">NODE_B</div>
          </div>
          <div className="h-6 flex items-center gap-1 mt-2">
            {signalLevel.slice(0, 6).map((val, i) => (
              <div key={i} className="w-1.5 bg-blue-900/50" style={{ height: `${val}%` }} />
            ))}
          </div>
        </div>

        {/* Center: CALL Status */}
        <div className="flex flex-col items-center justify-center flex-1">
          {isCalling ? (
            <div className="text-blue-400 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-2" />
              <span className="text-sm font-bold tracking-[0.3em]">PROCESSING...</span>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center opacity-10">
               <span className="text-slate-500 text-5xl font-black italic">CONTROL</span>
               <div className="w-full h-px bg-slate-800 mt-2" />
            </div>
          )}
        </div>

        {/* Right Side: John Courage */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-40 border-2 border-slate-500 bg-slate-950 relative overflow-hidden shadow-inner">
            <img 
              src="https://i.imgur.com/bV8f6gr.png" 
              alt="John Courage" 
              className="w-full h-full object-cover object-top grayscale brightness-[0.9] contrast-[1.1]"
            />
            
            {/* Technocracy Blue Overlay */}
            <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay pointer-events-none" />
            
            {/* Scanning Line Effect */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500/30 shadow-[0_0_10px_#3b82f6] animate-[scan_3s_linear_infinite]" />
            
            <div className="absolute bottom-0 w-full bg-slate-800/90 text-slate-100 text-[10px] font-bold text-center py-0.5 border-t border-slate-600">
              COURAGE, J.
            </div>
          </div>
          <div className="h-6 flex items-center gap-1 mt-2">
            {signalLevel.slice(6).map((val, i) => (
              <div key={i} className="w-1.5 bg-blue-500" style={{ height: `${val}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Dialogue Box */}
      <div className="w-full mt-6 p-4 border border-slate-700 bg-slate-900/20 min-h-[110px] relative">
        <div className="absolute -top-2 left-2 bg-black px-2 text-[9px] text-slate-500">TRANSMISSION_FEED</div>
        {stepName && (
           <div className="absolute -top-2 right-2 bg-blue-900 text-white text-[9px] px-2 font-bold">
             {stepName}
           </div>
        )}
        <p className="text-slate-300 text-sm leading-relaxed">
          <span className="text-blue-500 mr-2">&gt;</span>
          {displayedText}
          <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse" />
        </p>
      </div>

      <div className="w-full flex justify-between mt-3 px-1 items-center opacity-60">
        <div className="text-[8px] text-slate-600 flex gap-4">
            <span>UPTIME: 144.02.1</span>
            <span>ENCRYPTION: NWO-RSA-4096</span>
        </div>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-slate-600 hover:text-blue-400 transition-colors"
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}} />
    </div>
  );
};

export default TechnocracyCodec
