import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import {
  Sparkles,
  ArrowRight,
  Play,
  Image,
  Command,
  Sliders,
  Cpu,
  Layers,
  CheckCircle,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

const VIDEO_SRC = 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32124-large.mp4';

// Sleek geometric LogoMark SVG
const LogoMark = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-white"
  >
    <path
      d="M16 2L2 10V22L16 30L30 22V10L16 2Z"
      stroke="url(#logo-grad)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M16 8L8 12.5V19.5L16 24L24 19.5V12.5L16 8Z"
      fill="url(#logo-grad-fill)"
      stroke="url(#logo-grad)"
      strokeWidth="1"
    />
    <circle cx="16" cy="16" r="3.5" fill="white" className="animate-pulse" />
    <defs>
      <linearGradient id="logo-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f43f5e" />
        <stop offset="0.5" stopColor="#a855f7" />
        <stop offset="1" stopColor="#06b6d4" />
      </linearGradient>
      <linearGradient id="logo-grad-fill" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f43f5e" stopOpacity="0.2" />
        <stop offset="1" stopColor="#06b6d4" stopOpacity="0.2" />
      </linearGradient>
    </defs>
  </svg>
);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Boomerang Video State
  const [isReversed, setIsReversed] = useState(false);
  
  // Interactive Generator State
  const [promptInput, setPromptInput] = useState('Cinematic shot of neon cybercity, volumetric smoke, cyberpunk aesthetics');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('Cinematic');
  const [selectedRatio, setSelectedRatio] = useState('16:9');
  const [activeTab, setActiveTab] = useState('Gallery');

  // GSAP Mouse Parallax Implementation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height } = container.getBoundingClientRect();
      
      // Relative values between -0.5 and 0.5
      const xRel = (clientX / width) - 0.5;
      const yRel = (clientY / height) - 0.5;

      // Parallax effect on the abstract background grid/glows
      gsap.to('.parallax-ambient', {
        x: xRel * 40,
        y: yRel * 40,
        duration: 1.2,
        ease: 'power2.out',
      });

      // Parallax 3D tilt effect on the main central content
      gsap.to('.parallax-main-card', {
        x: xRel * -15,
        y: yRel * -15,
        rotateX: yRel * -8,
        rotateY: xRel * 8,
        transformPerspective: 1200,
        duration: 1,
        ease: 'power2.out',
      });

      // Subtle opposite movement for the left/right content blocks
      gsap.to('.parallax-side-left', {
        x: xRel * 10,
        y: yRel * 10,
        duration: 1.5,
        ease: 'power3.out',
      });

      gsap.to('.parallax-side-right', {
        x: xRel * -10,
        y: yRel * -10,
        duration: 1.5,
        ease: 'power3.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Programmatic Boomerang Video Loop (Reverse on end)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let reverseIntervalId: any;

    const handleEnded = () => {
      setIsReversed(true);
    };

    const handleTimeUpdate = () => {
      if (isReversed && video.currentTime <= 0.1) {
        setIsReversed(false);
        video.play().catch(() => {});
      }
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);

    if (isReversed) {
      video.pause();
      // Reverse playback at 30 FPS by decrementing currentTime
      reverseIntervalId = setInterval(() => {
        if (video.currentTime > 0.05) {
          video.currentTime -= 0.033; // ~30fps step
        } else {
          setIsReversed(false);
          video.play().catch(() => {});
        }
      }, 33);
    }

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      if (reverseIntervalId) clearInterval(reverseIntervalId);
    };
  }, [isReversed]);

  // Handle Interactive Visual Generation
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedImage(null);

    // Simulate progress sequence
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          // Set a beautiful futuristic gradient image mock
          setGeneratedImage(
            selectedStyle === 'Cinematic'
              ? 'radial-gradient(circle at 70% 30%, #ff007a 0%, #7928ca 50%, #050515 100%)'
              : selectedStyle === 'Cyberpunk'
              ? 'linear-gradient(135deg, #00f2fe 0%, #4facfe 30%, #000000 100%)'
              : 'linear-gradient(225deg, #f43f5e 0%, #111827 80%, #030712 100%)'
          );
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const navItems = ['Gallery', 'Styles', 'API', 'Pricing', 'Blog'];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden flex flex-col justify-between"
    >
      {/* 1. SEAMLESS LOOP / BOOMERANG BACKGROUND VIDEO LAYER */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-[0.22] contrast-[1.15] saturate-[0.65]"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
        {/* Sleek dark ambient overlays */}
        <div className="absolute inset-0 bg-[#050505]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050505_90%)]" />
      </div>

      {/* 2. GLOWING AMBIENT FIELD (gsap target) */}
      <div className="parallax-ambient absolute -top-40 -left-40 w-96 h-96 bg-[#7928ca]/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="parallax-ambient absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#00dfd8]/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* 3. PREMIUM FIXED TOP NAVIGATION */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer">
          <LogoMark />
          <div>
            <span className="font-display font-black text-sm md:text-base tracking-widest text-white block leading-none">
              MICROVISUALS
            </span>
            <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase block mt-1">
              AI CINEMATOGRAPHY
            </span>
          </div>
        </div>

        {/* RESTORED ORIGINAL NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest text-white/50">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`hover:text-white transition-colors uppercase relative py-1 cursor-pointer font-bold ${
                activeTab === item ? 'text-white' : ''
              }`}
            >
              <span>{item}</span>
              {activeTab === item && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-[#ff007a] to-[#00dfd8]" />
              )}
            </button>
          ))}
        </nav>

        {/* Action Button */}
        <div>
          <button className="relative px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[10px] font-mono font-bold uppercase tracking-widest text-white transition-all duration-300 cursor-pointer shadow-lg shadow-black/40">
            Console
          </button>
        </div>
      </header>

      {/* 4. MAIN CENTRAL LANDING SPACE */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: ORIGINAL LEFT DESCRIPTIVE PARAGRAPH */}
        <div className="parallax-side-left lg:col-span-3 text-left space-y-6 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="space-y-4"
          >
            <div className="w-12 h-[2px] bg-gradient-to-r from-[#ff007a] to-[#7928ca]" />
            <p className="text-[13px] text-white/60 leading-relaxed font-sans font-medium">
              "Forma's AI understands context, composition, and style like a creative director would."
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40 tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-[#ff007a]" />
              <span>DIRECTORIAL INTELLIGENCE</span>
            </div>
          </motion.div>
        </div>

        {/* CENTER COLUMN: MASSIVE TYPOGRAPHY & INTERACTIVE DEMO */}
        <div className="lg:col-span-6 flex flex-col items-center text-center space-y-8">
          
          {/* Main Titles */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full text-[9px] font-mono tracking-widest text-white/60 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              <span>NEXT GENERATION V2.8 RELEASE</span>
            </div>

            {/* RESTORED ORIGINAL HERO TITLE */}
            <h1 className="select-none text-5xl sm:text-6xl md:text-8xl font-display font-black tracking-tight text-white leading-none uppercase">
              MicroVisuals
            </h1>
          </motion.div>

          {/* PARALLAX 3D GLASS CARD (GSAP TARGET) */}
          <div className="parallax-main-card w-full max-w-lg glass-panel rounded-2xl p-6 md:p-8 space-y-6 text-left relative overflow-hidden">
            {/* Glossy top reflection shimmer */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00dfd8] animate-ping" />
                <span className="text-[10px] font-mono text-white/50 tracking-wider uppercase">Visual Synthesizer</span>
              </div>
              <SlidersHorizontal className="w-4 h-4 text-white/30" />
            </div>

            {/* Form */}
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 font-sans tracking-wide pr-10"
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white/40 hover:text-white transition-colors"
                >
                  <Command className="w-4 h-4" />
                </button>
              </div>

              {/* Advanced visual controls */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Art Style</label>
                  <div className="flex gap-1.5">
                    {['Cinematic', 'Cyberpunk', 'Surreal'].map((style) => (
                      <button
                        type="button"
                        key={style}
                        onClick={() => setSelectedStyle(style)}
                        className={`px-2.5 py-1.5 rounded-lg border text-[9.5px] font-mono tracking-wider transition-all cursor-pointer ${
                          selectedStyle === style
                            ? 'bg-white/10 border-white/30 text-white font-bold'
                            : 'bg-transparent border-white/5 text-white/40 hover:border-white/15'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Aspect Ratio</label>
                  <div className="flex gap-1.5 justify-end">
                    {['16:9', '9:16', '1:1'].map((ratio) => (
                      <button
                        type="button"
                        key={ratio}
                        onClick={() => setSelectedRatio(ratio)}
                        className={`px-2.5 py-1.5 rounded-lg border text-[9.5px] font-mono tracking-wider transition-all cursor-pointer ${
                          selectedRatio === ratio
                            ? 'bg-white/10 border-white/30 text-white font-bold'
                            : 'bg-transparent border-white/5 text-white/40 hover:border-white/15'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress bar and image viewport */}
              <div className="border border-white/5 bg-black/20 rounded-xl overflow-hidden min-h-[140px] flex flex-col items-center justify-center relative p-4">
                {isGenerating ? (
                  <div className="w-full text-center space-y-3 z-10 p-4">
                    <RefreshCw className="w-6 h-6 text-[#00dfd8] animate-spin mx-auto" />
                    <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase block">
                      SYNTHESIZING MATRIX ({generationProgress}%)
                    </span>
                    <div className="w-full bg-white/5 h-[3px] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#ff007a] via-[#7928ca] to-[#00dfd8] transition-all duration-150"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div className="absolute inset-0 z-0 flex items-center justify-center animate-fade-in" style={{ background: generatedImage }}>
                    <div className="absolute inset-0 bg-[#050505]/30" />
                    <div className="z-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase text-[#00dfd8] flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>RENDER COMPLETED</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2 text-white/30">
                    <Image className="w-7 h-7 mx-auto stroke-[1.5]" />
                    <p className="text-[11px] font-sans font-medium">Ready to produce cinemagraphs</p>
                  </div>
                )}
              </div>

              {/* RESTORED ORIGINAL DUAL CALL-TO-ACTIONS */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full sm:w-1/2 group relative px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff007a] to-[#7928ca] hover:from-[#f43f5e] hover:to-[#a855f7] text-white font-mono text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-500/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Start generating</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPromptInput('Surreal digital sculpture of glowing quartz minerals floating in cosmic void');
                    setSelectedStyle('Surreal');
                  }}
                  className="w-full sm:w-1/2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-mono text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  <Layers className="w-3.5 h-3.5 text-[#00dfd8]" />
                  <span>See templates</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: ORIGINAL RIGHT DESCRIPTIVE PARAGRAPH */}
        <div className="parallax-side-right lg:col-span-3 text-right space-y-6 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="space-y-4 flex flex-col items-end"
          >
            <div className="w-12 h-[2px] bg-gradient-to-r from-[#7928ca] to-[#00dfd8]" />
            <p className="text-[13px] text-white/60 leading-relaxed font-sans font-medium text-right">
              "Describe what you see in your head — get images that actually match."
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40 tracking-wider">
              <span>PIXEL COMPOSITION MODEL</span>
              <Sliders className="w-3.5 h-3.5 text-[#00dfd8]" />
            </div>
          </motion.div>
        </div>

      </main>

      {/* 5. MINIMAL DESKTOP SUB-SECTIONS TO PREVENT AN EMPTY BOTTOM */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel glass-panel-hover rounded-xl p-5 space-y-2">
          <span className="text-[9px] font-mono text-[#ff007a] font-bold uppercase">Dynamic Rendering</span>
          <h4 className="text-sm font-bold tracking-tight">Zero Generation Delay</h4>
          <p className="text-xs text-white/50 leading-relaxed font-medium">
            Forma's native server compilation allows instantaneous vector layouts and micro-cinematography preview streams.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover rounded-xl p-5 space-y-2">
          <span className="text-[9px] font-mono text-[#7928ca] font-bold uppercase">Creative Directing</span>
          <h4 className="text-sm font-bold tracking-tight">Contextual Semantic Model</h4>
          <p className="text-xs text-white/50 leading-relaxed font-medium">
            Trained directly on thousands of cinematography assets to correctly output real aspect ratios and camera focal lengths.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover rounded-xl p-5 space-y-2">
          <span className="text-[9px] font-mono text-[#00dfd8] font-bold uppercase">Open API Layer</span>
          <h4 className="text-sm font-bold tracking-tight">Automated Production</h4>
          <p className="text-xs text-white/50 leading-relaxed font-medium">
            Trigger dynamic graphic renderings programmatically via simple webhook integrations and server-side SDKs.
          </p>
        </div>
      </div>

      {/* 6. AMBIENT PREMIUM FOOTER */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between border-t border-white/5 text-[10px] font-mono text-white/30 gap-3 sm:gap-0">
        <span>© 2026 MICROVISUALS LABS INC. ALL RIGHTS RESERVED</span>
        <span className="flex items-center gap-1.5 text-white/50">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span>PRODUCTION CLUSTER SYSTEM ONLINE</span>
        </span>
      </footer>
    </div>
  );
}
