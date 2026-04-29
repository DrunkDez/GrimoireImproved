import React, { useState } from 'react';
import { Monitor, Cpu, Globe, Zap, ShieldAlert, Binary, Fingerprint } from 'lucide-react';

const CharacterTypeCard = ({ 
  id, 
  title, 
  subtitle, 
  description, 
  image, 
  color, 
  isSelected, 
  onSelect,
  icon: Icon 
}) => {
  return (
    <div 
      onClick={() => onSelect(id)}
      className={`group relative flex flex-col items-center p-6 border-2 transition-all duration-300 cursor-pointer overflow-hidden
        ${isSelected 
          ? `border-${color}-400 bg-${color}-950/40 shadow-[0_0_30px_rgba(52,211,153,0.2)]` 
          : `border-slate-800 bg-slate-900/20 grayscale hover:grayscale-0 hover:border-slate-600`
        }`}
    >
      {/* Custom CSS Glitch Effect (Replaced the broken GIF) */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none overflow-hidden transition-opacity duration-300`}>
        <div className={`absolute inset-0 bg-${color}-500/20 animate-pulse`} />
        <div className="absolute inset-0 flex flex-wrap gap-2 p-2 overflow-hidden text-[8px] font-mono leading-none break-all text-emerald-500/30">
          {Array(20).fill("01011010_REALITY_ERROR_").map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      {/* Portrait with Identity Filter */}
      <div className={`w-32 h-40 border-2 mb-4 relative overflow-hidden transition-transform duration-500 group-hover:scale-105
        ${isSelected ? `border-${color}-400 shadow-[0_0_15px_rgba(var(--tw-color-${color}-400),0.5)]` : 'border-slate-700'}`}
      >
        <img 
          src={image} 
          alt={title} 
          className={`w-full h-full object-cover grayscale contrast-125 brightness-75 
            ${color === 'emerald' ? 'sepia-[0.4] hue-rotate-[90deg]' : 'sepia-[0.2] hue-rotate-[180deg]'}`}
          onError={(e) => { e.target.src = 'https://i.imgur.com/uRovvA0.png'; }}
        />
        <div className={`absolute inset-0 bg-${color}-500/10 mix-blend-color`} />
        {/* Scanlines inside image */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20" />
      </div>

      <Icon size={24} className={`mb-2 ${isSelected ? `text-${color}-400` : 'text-slate-500'}`} />
      
      <h3 className={`text-xl font-black italic tracking-tighter transition-colors
        ${isSelected ? `text-${color}-400` : 'text-slate-400'}`}>
        {title}
      </h3>
      
      <p className={`text-[10px] font-bold mb-4 tracking-[0.2em]
        ${isSelected ? `text-${color}-500` : 'text-slate-600'}`}>
        {subtitle}
      </p>

      <p className="text-center text-xs leading-relaxed text-slate-400 font-mono italic opacity-0 group-hover:opacity-100 transition-opacity">
        "{description}"
      </p>

      {isSelected && (
        <div className={`absolute top-2 right-2 flex items-center gap-1 text-[8px] font-bold text-${color}-400`}>
          <div className={`w-1.5 h-1.5 bg-${color}-400 animate-pulse rounded-full`} />
          LOCKED
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [selectedType, setSelectedType] = useState(null);

  const types = [
    {
      id: 'traditions',
      title: 'THE TRADITIONS',
      subtitle: 'RECLAIM REALITY',
      description: "You believe magick is an art, a soul's expression. Hack the consensus to wake humanity up.",
      image: 'https://i.imgur.com/1JJV7Go.png', // Dante
      color: 'emerald',
      icon: Zap
    },
    {
      id: 'technocracy',
      title: 'THE UNION',
      subtitle: 'ENFORCE ORDER',
      description: "Reality is a system. You are the administrator. Protect the masses from the chaos of the deviant.",
      image: 'https://i.imgur.com/bV8f6gr.png', // John Courage
      color: 'blue',
      icon: ShieldAlert
    }
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono uppercase selection:bg-emerald-500 selection:text-black overflow-hidden">
      {/* Background HUD elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-10 left-10 border-l border-t border-slate-700 w-40 h-40" />
        <div className="absolute bottom-10 right-10 border-r border-b border-slate-700 w-40 h-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
        
        {/* Animated Background Text Streams */}
        <div className="absolute top-0 right-0 p-4 text-[8px] text-emerald-900 select-none hidden md:block">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
              [SEC_LOG_{i}]: DATA_STREAM_STABLE_IDENT_{Math.random().toString(16).slice(2, 8)}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Terminal Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 text-emerald-500 mb-2">
            <Monitor size={20} className="animate-pulse" />
            <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter">CALIBRATION_PROTOCOL</h1>
          </div>
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-emerald-900 to-transparent" />
          <p className="text-slate-500 text-[10px] mt-4 tracking-[0.4em]">
            CHOOSE YOUR PARADIGM // DEFINE YOUR AXIS
          </p>
        </div>

        {/* Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {types.map((type) => (
            <CharacterTypeCard 
              key={type.id}
              {...type}
              isSelected={selectedType === type.id}
              onSelect={setSelectedType}
            />
          ))}
        </div>

        {/* Action Footer */}
        <div className="mt-12 flex flex-col items-center">
          <div className="flex gap-12 mb-8 opacity-40">
            <div className="flex items-center gap-2 text-[9px] text-slate-500 italic">
               <Fingerprint size={12} /> ID_AUTH_PENDING
            </div>
            <div className="flex items-center gap-2 text-[9px] text-slate-500 italic">
               <Globe size={12} /> GLOBAL_UPLINK_READY
            </div>
          </div>

          <button 
            disabled={!selectedType}
            className={`px-12 py-3 font-black text-lg transition-all duration-300 relative
              ${selectedType 
                ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95' 
                : 'bg-slate-900 text-slate-700 cursor-not-allowed border border-slate-800'}`}
          >
            {selectedType ? 'INITIALIZE AVATAR' : 'AWAITING SELECTION...'}
          </button>
        </div>
      </div>

      {/* Global Scanlines Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px]" />
    </div>
  );
}