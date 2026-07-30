"use client";

import React, { useMemo } from "react";

/**
 * AppBackground component - V1.0 FINAL POLISH
 * Official Premium Visual Identity for PUFI HUB.
 * Luxury Web3 aesthetic with immersive depth and elegant motion.
 * 
 * Performance: CSS + Tailwind Only (GPU Accelerated).
 * Optimized for World App WebView (Battery & Performance).
 */
export default function AppBackground() {
  // Generate stable "random" values for the galaxy dust to satisfy purity rules
  const dustStyles = useMemo(() => {
    const generateShadows = (count: number, colors: string[]) => {
      return Array.from({ length: count }).map((_, i) => {
        // Use deterministic-ish values based on index to simulate randomness without Math.random if needed,
        // but here we just want it to be stable after mount.
        // Actually, Math.random inside useMemo is usually fine for "stable randomness",
        // but the linter might still flag it. Let's use a pseudo-random approach.
        const x = (i * 137.5) % 100; // Golden angle based distribution
        const y = (i * 161.8) % 100;
        const color = colors[i % colors.length];
        return `${x}vw ${y}vh ${color}`;
      }).join(',');
    };

    return {
      dust1: generateShadows(50, ['rgba(255,255,255,0.4)', 'rgba(167,139,250,0.3)']),
      dust2: generateShadows(40, ['rgba(255,255,255,0.2)', 'rgba(59,130,246,0.2)']),
      dust3: generateShadows(40, ['rgba(255,255,255,0.3)', 'rgba(236,72,153,0.2)'])
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#070B1A]">
      {/* 
          OPTIMIZED LUXURY ANIMATIONS 
          Ultra-slow, barely noticeable motion for premium feel.
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cosmic-drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(1%, 1%) scale(1.02); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes aurora-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-cosmic-drift { animation: cosmic-drift 40s ease-in-out infinite; }
        .animate-aurora-pulse { animation: aurora-pulse 30s ease-in-out infinite; }
        
        .galaxy-dust-1 {
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${dustStyles.dust1};
        }
        .galaxy-dust-2 {
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: ${dustStyles.dust2};
        }
        .galaxy-dust-3 {
          width: 1.5px;
          height: 1.5px;
          background: transparent;
          box-shadow: ${dustStyles.dust3};
        }
      `}} />

      {/* LAYER 1: Deep Space Base */}
      <div className="absolute inset-0 bg-[#070B1A]" />

      {/* LAYER 2 & 3: Nebula Clouds & Aurora (Immersive Depth) */}
      <div className="absolute inset-0 animate-cosmic-drift overflow-hidden">
        
        {/* Top Left Nebula (Purple/Violet) */}
        <div className="absolute -top-[20%] -left-[10%] h-[80%] w-[80%] rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.12)_0%,transparent_70%)] blur-[120px]" />
        
        {/* Bottom Right Nebula (Deep Blue) */}
        <div className="absolute -bottom-[15%] -right-[5%] h-[75%] w-[75%] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.1)_0%,transparent_70%)] blur-[100px]" />
        
        {/* Center Glow (Elegant Radiance) */}
        <div className="absolute top-1/2 left-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_60%)] blur-[100px]" />

        {/* Aurora Accents (Blue/Magenta) */}
        <div className="absolute top-[10%] right-[10%] h-[50%] w-[50%] opacity-40 animate-aurora-pulse">
           <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_60%)] blur-[100px]" />
        </div>
        
        <div className="absolute bottom-[20%] left-[5%] h-[40%] w-[40%] opacity-30 animate-aurora-pulse" style={{ animationDelay: '-15s' }}>
           <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(236,72,153,0.05)_0%,transparent_60%)] blur-[80px]" />
        </div>

      </div>

      {/* LAYER 4: Galaxy Dust (100-150 Particles) */}
      <div className="absolute inset-0 overflow-hidden opacity-80">
        <div className="galaxy-dust-1" />
        <div className="galaxy-dust-2" />
        <div className="galaxy-dust-3" />
      </div>

      {/* LAYER 5: Soft Ambient Glow (Subtle Vignette) */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(7,11,26,0.8)]" />
      
      {/* LUXURY OVERLAY: Grain/Noise for Texture */}
      <div className="absolute inset-0 bg-white/[0.005] mix-blend-overlay pointer-events-none" />

      {/* CONTENT SAFE AREA SUPPORT */}
      <div className="fixed inset-0 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pointer-events-none" />
    </div>
  );
}
