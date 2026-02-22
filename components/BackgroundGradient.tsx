import React, { useEffect, useRef, useState } from 'react';

/**
 * Animated gradient background — adapted from 21st.dev/aceternity
 * Used as a subtle, low-opacity fixed layer behind all content.
 * Colors match IA Heroes brand: pink (#FF2878), teal (#243F4C), cyan (#61F2F2).
 */
export const BackgroundGradient: React.FC = () => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  // Set CSS variables on mount
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--gradient-bg-start', 'rgb(248, 250, 252)');   // slate-50
    root.style.setProperty('--gradient-bg-end', 'rgb(241, 245, 249)');     // slate-100
    root.style.setProperty('--grad-first', '255, 40, 120');                // pink (#FF2878)
    root.style.setProperty('--grad-second', '97, 242, 242');               // cyan (#61F2F2)
    root.style.setProperty('--grad-third', '99, 102, 241');                // indigo
    root.style.setProperty('--grad-fourth', '36, 63, 76');                 // primary (#243F4C)
    root.style.setProperty('--grad-fifth', '168, 85, 247');                // purple
    root.style.setProperty('--grad-pointer', '255, 40, 120');              // pink
    root.style.setProperty('--grad-size', '80%');
    root.style.setProperty('--grad-blend', 'hard-light');
  }, []);

  // Smooth mouse follow
  useEffect(() => {
    if (!interactiveRef.current) return;
    const newX = curX + (tgX - curX) / 20;
    const newY = curY + (tgY - curY) / 20;
    setCurX(newX);
    setCurY(newY);
    interactiveRef.current.style.transform = `translate(${Math.round(newX)}px, ${Math.round(newY)}px)`;
  }, [tgX, tgY]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(event.clientX - rect.left);
      setTgY(event.clientY - rect.top);
    }
  };

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  // Shared blob styles
  const blobBase = `absolute w-[var(--grad-size)] h-[var(--grad-size)] top-[calc(50%-var(--grad-size)/2)] left-[calc(50%-var(--grad-size)/2)]`;
  const blend = `[mix-blend-mode:var(--grad-blend)]`;

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
      style={{
        zIndex: 0,
        opacity: 0.07,
        background: 'linear-gradient(40deg, var(--gradient-bg-start), var(--gradient-bg-end))',
      }}
      onMouseMove={handleMouseMove}
    >
      {/* SVG Filter */}
      <svg className="hidden">
        <defs>
          <filter id="gradBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Gradient blobs container */}
      <div
        className={`h-full w-full ${isSafari ? 'blur-2xl' : ''}`}
        style={!isSafari ? { filter: 'url(#gradBlur) blur(40px)' } : undefined}
      >
        {/* Blob 1 — Pink */}
        <div
          className={`${blobBase} ${blend} animate-grad-first opacity-100`}
          style={{
            background: 'radial-gradient(circle at center, rgba(var(--grad-first), 1) 0, rgba(var(--grad-first), 0) 50%) no-repeat',
            transformOrigin: 'center center',
          }}
        />

        {/* Blob 2 — Cyan */}
        <div
          className={`${blobBase} ${blend} animate-grad-second opacity-100`}
          style={{
            background: 'radial-gradient(circle at center, rgba(var(--grad-second), 0.8) 0, rgba(var(--grad-second), 0) 50%) no-repeat',
            transformOrigin: 'calc(50% - 400px)',
          }}
        />

        {/* Blob 3 — Indigo */}
        <div
          className={`${blobBase} ${blend} animate-grad-third opacity-100`}
          style={{
            background: 'radial-gradient(circle at center, rgba(var(--grad-third), 0.8) 0, rgba(var(--grad-third), 0) 50%) no-repeat',
            transformOrigin: 'calc(50% + 400px)',
          }}
        />

        {/* Blob 4 — Primary teal */}
        <div
          className={`${blobBase} ${blend} animate-grad-fourth opacity-70`}
          style={{
            background: 'radial-gradient(circle at center, rgba(var(--grad-fourth), 0.8) 0, rgba(var(--grad-fourth), 0) 50%) no-repeat',
            transformOrigin: 'calc(50% - 200px)',
          }}
        />

        {/* Blob 5 — Purple */}
        <div
          className={`${blobBase} ${blend} animate-grad-fifth opacity-100`}
          style={{
            background: 'radial-gradient(circle at center, rgba(var(--grad-fifth), 0.8) 0, rgba(var(--grad-fifth), 0) 50%) no-repeat',
            transformOrigin: 'calc(50% - 800px) calc(50% + 800px)',
          }}
        />

        {/* Interactive pointer blob */}
        <div
          ref={interactiveRef}
          className={`absolute ${blend} w-full h-full -top-1/2 -left-1/2 opacity-70`}
          style={{
            background: 'radial-gradient(circle at center, rgba(var(--grad-pointer), 0.8) 0, rgba(var(--grad-pointer), 0) 50%) no-repeat',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default BackgroundGradient;
