import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Phone, MessageSquare, ChevronRight } from 'lucide-react';

// The Codec Component now accepts the text and a callback when it finishes typing
const DanteCodec = ({ 
  dialogue = "",
  stepName = "",
  onTypingComplete = () => {} 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [isCalling, setIsCalling] = useState(true);
  const [signalLevel, setSignalLevel] = useState(Array(12).fill(0));

  // Reset the animation whenever the dialogue prop changes
  useEffect(() => {
    setIsCalling(true);
    setDisplayedText('');
  }, [dialogue]);

  // Typewriter and Calling effect logic
  useEffect(() => {
    if (isCalling) {
      const timeout = setTimeout(() => setIsCalling(false), 1500); // Ring for 1.5s
      return () => clearTimeout(timeout);
    }

    if (displayedText.length < dialogue.length) {
      const timer = setTimeout(() => {
        setDisplayedText(dialogue.slice(0, displayedText.length + 1));
      }, 30); // Typing speed
      return () => clearTimeout(timer);
    } else {
      onTypingComplete();
    }
  }, [displayedText, dialogue, isCalling, onTypingComplete]);

  // Frequency bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSignalLevel(prev => prev.map(() => Math.floor(Math.random() * 100)));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-black p-4 font-mono uppercase tracking-widest border-4 border-emerald-900 rounded-lg overflow-hidden relative">
      {/* Global Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* Header Info */}
      <div className="w-full flex justify-between text-emerald-500 text-xs mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 animate-pulse rounded-full" />
          <span>VA-NET SECURE CONNECTION</span>
        </div>
        <span>FREQ: 140.48 MHz</span>
      </div>

      <div className="flex flex-row items-center justify-between w-full max-w-2xl gap-8">
        
        {/* Left Side: User/Static */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-40 border-2 border-emerald-500 bg-emerald-950/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://media.giphy.com/media/oEI9uWUqnW9Fe/giphy.gif')] bg-cover" />
            <span className="text-emerald-500 text-[10px] z-10">USER_NODE</span>
          </div>
          <div className="h-8 flex items-end gap-1 mt-2">
            {signalLevel.slice(0, 6).map((val, i) => (
              <div key={i} className="w-2 bg-emerald-500 transition-all duration-75" style={{ height: `${val}%` }} />
            ))}
          </div>
        </div>

        {/* Center: CALL Status */}
        <div className="flex flex-col items-center justify-center flex-1">
          {isCalling ? (
            <div className="text-emerald-400 animate-bounce flex flex-col items-center">
              <Phone size={48} />
              <span className="mt-2 text-xl font-bold italic">CALLING...</span>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
               <div className="text-emerald-500/10 text-6xl font-black select-none">ADEPT</div>
            </div>
          )}
        </div>

        {/* Right Side: Dante with Enhanced MGS Filters */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-40 border-2 border-emerald-400 bg-black relative overflow-hidden shadow-[0_0_20px_rgba(52,211,153,0.4)]">
            {/* 1. The Base Image */}
            <img 
              src="https://i.imgur.com/1JJV7Go.png" 
              onError={(e) => { e.target.src = 'https://i.imgur.com/uRovvA0.png'; }}
              alt="Dante" 
              className="w-full h-full object-cover object-top grayscale contrast-[1.5] brightness-[0.7]"
            />
            
            {/* 2. Color Overlay (Mix Blend makes white areas green) */}
            <div className="absolute inset-0 bg-emerald-500 mix-blend-color" />
            
            {/* 3. Screen Tint (Gives it that glowing green feel) */}
            <div className="absolute inset-0 bg-emerald-500/20 pointer-events-none" />

            {/* 4. Intra-Portrait Scanlines */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] opacity-30" />
            
            {/* 5. Name Plate */}
            <div className="absolute bottom-0 w-full bg-emerald-500 text-black text-[10px] font-black text-center py-0.5 tracking-widest">
              DANTE
            </div>
          </div>
          
          <div className="h-8 flex items-end gap-1 mt-2">
            {signalLevel.slice(6).map((val, i) => (
              <div key={i} className="w-2 bg-emerald-400 transition-all duration-75" style={{ height: `${val}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Dialogue Box */}
      <div className="w-full mt-6 p-4 border-2 border-emerald-700 bg-emerald-950/40 min-h-[120px] relative">
        <MessageSquare className="absolute -top-3 -left-3 text-emerald-500 bg-black" size={24} />
        {stepName && (
           <div className="absolute -top-3 right-4 bg-emerald-500 text-black font-black text-[10px] px-2 py-0.5">
             {stepName}
           </div>
        )}
        <p className="text-emerald-400 text-sm md:text-base leading-relaxed">
          {displayedText}
          <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse" />
        </p>
      </div>

      {/* Footer Status */}
      <div className="w-full flex justify-between mt-2 px-1 items-center">
        <div className="text-[8px] text-emerald-900 flex gap-4">
            <span>PROC: ADEPT-CORE V4.2</span>
            <span>SIGNAL: ENCRYPTED</span>
        </div>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-emerald-600 hover:text-emerald-400 transition-colors"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
};

export default DanteCodec {
  const wizardSteps = [
    {
      stepName: "STEP 1 : INITIALIZATION",
      text: "Listen closely, initiate. The Digital Web is shifting. Your Paradox signature is spiking, and we need to stabilize your avatar before the Technocracy locks onto your coordinates. Ready to begin the Awakening?"
    },
    {
      stepName: "STEP 2 : TRADITION SELECTION",
      text: "Good. First, we need to define your paradigm. Who taught you to bend reality? Select your Tradition from the terminal below."
    },
    {
      stepName: "STEP 3 : ATTRIBUTE ALLOCATION",
      text: "Interesting choice. Now, allocate your attributes. Focus on your mind, but don't neglect your physical form. A weak vessel breaks under the weight of true magick."
    },
    {
      stepName: "STEP 4 : SPHERE MASTERY",
      text: "This is the crucial moment. Define your understanding of the Spheres. What aspects of reality can you currently hack?"
    }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTypingFinished, setIsTypingFinished] = useState(false);

  const handleNextStep = () => {
    if (currentStepIndex < wizardSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setIsTypingFinished(false);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setIsTypingFinished(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-3xl">
        
        <DanteCodec 
          dialogue={wizardSteps[currentStepIndex].text}
          stepName={wizardSteps[currentStepIndex].stepName}
          onTypingComplete={() => setIsTypingFinished(true)}
        />
        
        <div className="mt-6 flex items-center justify-between">
          <button 
            onClick={handlePreviousStep}
            disabled={currentStepIndex === 0}
            className={`px-4 py-2 border border-emerald-800 text-emerald-500 font-mono text-sm transition-colors ${currentStepIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-emerald-900/30'}`}
          >
            &lt; PREV STEP
          </button>
          
          <p className="text-emerald-900/60 text-xs font-mono uppercase tracking-tighter">
            VIRTUAL ADEPT UPLINK // STEP {currentStepIndex + 1}/{wizardSteps.length}
          </p>

          <button 
            onClick={handleNextStep}
            disabled={currentStepIndex === wizardSteps.length - 1 || !isTypingFinished}
            className={`px-4 py-2 flex items-center gap-2 border border-emerald-500 text-black font-mono font-bold text-sm transition-colors ${currentStepIndex === wizardSteps.length - 1 || !isTypingFinished ? 'bg-emerald-800/50 border-emerald-800 text-emerald-900 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400'}`}
          >
            NEXT STEP <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
