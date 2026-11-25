import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, MoveHorizontal, Pause, Play } from 'lucide-react';
import { HERO_ARCH_IMAGE, HERO_ARCHIVE_CHAPTERS } from '../data/products';
import { HeroArchiveChapter, ProductCategory } from '../types';
import { atelierAudio } from '../utils/audio';

interface HeroSectionProps {
  onExploreCategory: (category: ProductCategory) => void;
  onInspectProduct: (productId: string) => void;
}

const WAVEFORM_HEIGHTS = [
  28, 45, 36, 72, 92, 54, 84, 65, 96, 48, 76, 52, 88, 60, 42, 68, 90, 56, 38, 62, 48, 32,
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCategory,
  onInspectProduct,
}) => {
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(4);
  const [revolveDeg, setRevolveDeg] = useState(0);
  const [tiltYDeg, setTiltYDeg] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef<number | null>(null);
  const dragStartDeg = useRef<number>(0);

  const activeChapter: HeroArchiveChapter = HERO_ARCHIVE_CHAPTERS[activeChapterIdx];

  useEffect(() => {
    if (!isPlayingAudio) return;
    const interval = window.setInterval(() => {
      setElapsedSec((prev) => (prev >= 48 ? 0 : prev + 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isPlayingAudio]);

  useEffect(() => {
    return () => {
      atelierAudio.stop();
    };
  }, []);

  const toggleSoundscape = () => {
    if (isPlayingAudio) {
      atelierAudio.stop();
      setIsPlayingAudio(false);
    } else {
      atelierAudio.start();
      setIsPlayingAudio(true);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    dragStartDeg.current = revolveDeg;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    const nextDeg = Math.max(-22, Math.min(22, dragStartDeg.current + delta * 0.14));
    setRevolveDeg(nextDeg);
    setTiltYDeg(Math.max(-6, Math.min(6, delta * 0.04)));

    if (delta > 65) {
      setActiveChapterIdx((prev) => (prev + 1) % HERO_ARCHIVE_CHAPTERS.length);
      dragStartX.current = e.clientX;
    } else if (delta < -65) {
      setActiveChapterIdx((prev) =>
        (prev - 1 + HERO_ARCHIVE_CHAPTERS.length) % HERO_ARCHIVE_CHAPTERS.length
      );
      dragStartX.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragStartX.current = null;
    setRevolveDeg(0);
    setTiltYDeg(0);
  };

  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#F2ECE3] flex flex-col justify-between pt-20 sm:pt-24 pb-6 sm:pb-8"
    >
      {/* Architectural Warm Sunlight Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 52% 45%, rgba(255,252,245,0.75) 0%, rgba(242,236,227,0.92) 55%, rgba(231,222,209,0.95) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-[12%] w-[45vw] h-[110vh] rotate-[24deg] opacity-35"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,253,248,0.85) 45%, transparent 100%)',
        }}
      />

      {/* Left & Right Vertical Architectural Coordinates */}
      <div
        aria-hidden="true"
        className="hidden xl:flex absolute left-5 top-1/2 -translate-y-1/2 -rotate-90 origin-center pointer-events-none z-20"
      >
        <span className="text-[10px] tracking-[0.22em] text-[#6B5D50] whitespace-nowrap uppercase">
          VELORA COLLECTION NO. 04 · CLOTHING &amp; BEAUTY
        </span>
      </div>
      <div
        aria-hidden="true"
        className="hidden xl:flex absolute right-5 top-1/2 -translate-y-1/2 rotate-90 origin-center pointer-events-none z-20"
      >
        <span className="text-[10px] tracking-[0.22em] text-[#6B5D50] whitespace-nowrap uppercase tabular-nums">
          19° 04&apos; N, 72° 52&apos; E · MUMBAI
        </span>
      </div>

      {/* Main Hero Canvas */}
      <div className="relative z-10 mx-auto w-full max-w-[1380px] px-4 sm:px-8 lg:px-14 flex-1 flex flex-col justify-between">
        {/* Centerpiece + Editorial Headline Layer */}
        <div className="relative flex-1 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-4 py-2 sm:py-4">
          {/* Left Editorial Headline */}
          <div className="lg:col-span-6 relative z-20 text-left max-w-xl">
            <h1
              className="font-display text-[clamp(2.75rem,5.4vw,5.15rem)] font-medium leading-[0.98] tracking-[-0.015em] text-[#1C1713]"
              style={{ textWrap: 'balance' }}
            >
              Beyond Fashion.
              <br />
              Into Identity.
            </h1>
            <p className="mt-4 sm:mt-5 font-display italic text-lg sm:text-[22px] text-[#3F352C] leading-snug">
              The Autumn-Winter Edition — Silk, Velvet &amp; Natural Skincare
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToCollection}
                className="px-6 py-2.5 rounded-full bg-[#1E1915] hover:bg-[#352C25] text-[#FAF7F2] text-[11px] font-medium tracking-[0.16em] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                SHOP COLLECTION (14)
              </button>
              <button
                type="button"
                onClick={() => onInspectProduct(activeChapter.featuredProductId)}
                className="px-5 py-2.5 rounded-full border border-[#CBBFA8] bg-[#FAF7F2]/70 hover:bg-[#FAF7F2] text-[#3A2D22] text-[11px] font-medium tracking-[0.15em] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                VIEW {activeChapter.title}
              </button>
            </div>
          </div>

          {/* Center-Right Interactive 3D Fluted Arch Centerpiece */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-start">
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              role="region"
              aria-label="Interactive 3D Product Showcase. Drag horizontally to rotate."
              className={`relative w-full max-w-[440px] sm:max-w-[500px] lg:max-w-[540px] aspect-[3/4] max-h-[58vh] lg:max-h-[68vh] select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{
                perspective: '1200px',
              }}
            >
              <div
                className="w-full h-full transition-transform duration-300 ease-out rounded-t-full overflow-hidden shadow-[0_30px_70px_rgba(30,25,21,0.14)] border border-[#D8CBB8]/80 bg-[#ECE4D8]"
                style={{
                  transform: `rotateY(${revolveDeg}deg) rotateX(${tiltYDeg}deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                <img
                  src={HERO_ARCH_IMAGE}
                  alt="VELORA signature silk gown and saffron glow serum displayed inside a gold arch"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  className="w-full h-full object-cover object-center transition-transform duration-500"
                />

                {/* Interactive Featured Item Caption */}
                <div className="absolute inset-x-4 bottom-4 rounded-xl bg-[#FAF7F2]/90 backdrop-blur-md border border-[#E5DDD2] px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.18em] text-[#8B6C36] font-medium uppercase">
                      {activeChapter.index} · {activeChapter.category}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-[#1E1915] truncate">
                      {activeChapter.subtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspectProduct(activeChapter.featuredProductId);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#1E1915] hover:bg-[#A58347] text-[#FAF7F2] text-[10px] tracking-[0.14em] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    VIEW ITEM
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Controls Row */}
        <div className="relative z-20 mt-4 flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-4">
          {/* Bottom-Left: Ambient Music Player */}
          <div className="w-full lg:w-[320px] rounded-2xl bg-[#FAF7F2]/90 backdrop-blur-md border border-[#E4DDD2] px-4 py-3 shadow-[0_8px_24px_rgba(30,25,21,0.06)] flex items-center gap-3.5">
            <button
              type="button"
              onClick={toggleSoundscape}
              aria-label={isPlayingAudio ? 'Pause ambient music' : 'Play ambient music'}
              className="w-9 h-9 rounded-full bg-[#EFE9DF] hover:bg-[#E4DACB] border border-[#DDD2C2] flex items-center justify-center text-[#3A2D22] transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A58347]"
            >
              {isPlayingAudio ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium tracking-[0.14em] text-[#2A211B] uppercase truncate">
                STUDIO MUSIC: CALM AMBIENCE
              </p>
              <div className="mt-1.5 flex items-center justify-between gap-3">
                <div
                  className="flex items-center gap-[3px] h-4 flex-1"
                  aria-hidden="true"
                >
                  {WAVEFORM_HEIGHTS.map((height, idx) => (
                    <span
                      key={idx}
                      className={`w-[2px] rounded-full transition-colors ${
                        isPlayingAudio
                          ? 'bg-[#A58347] waveform-bar-active'
                          : 'bg-[#C5B9A7]'
                      }`}
                      style={{
                        height: `${Math.max(22, height * 0.16)}px`,
                        animationDelay: `${idx * 65}ms`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-[#5C4F43] tabular-nums shrink-0">
                  {formatTimer(elapsedSec)}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom-Right: Drag to Rotate + 3-Card Preview Dock */}
          <div className="w-full lg:w-auto lg:min-w-[540px] max-w-[600px]">
            <div className="flex items-center justify-between gap-4 px-1 mb-2">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.16em] text-[#4A3F35] uppercase">
                <MoveHorizontal className="w-3.5 h-3.5 text-[#8B6C36]" />
                <span>DRAG IMAGE TO ROTATE · 3D VIEW</span>
              </div>
              <button
                type="button"
                onClick={scrollToCollection}
                className="flex items-center gap-1.5 text-[10px] tracking-[0.16em] text-[#2A211B] hover:text-[#A58347] uppercase transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>SCROLL TO SHOP</span>
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 rounded-2xl bg-[#FAF7F2]/90 backdrop-blur-md border border-[#E4DDD2] p-2.5 sm:p-3 shadow-[0_10px_30px_rgba(30,25,21,0.07)]">
              {HERO_ARCHIVE_CHAPTERS.map((chapter, idx) => {
                const selected = idx === activeChapterIdx;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => {
                      setActiveChapterIdx(idx);
                      onExploreCategory(chapter.category);
                    }}
                    className={`group text-left rounded-xl p-1 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A58347] ${
                      selected
                        ? 'bg-[#EFE8DC] ring-1 ring-[#A58347]/60'
                        : 'hover:bg-[#F3EDE4]'
                    }`}
                  >
                    <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-[#E7DED1]">
                      <img
                        src={chapter.image}
                        alt={chapter.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-1.5 px-1 flex items-center gap-1.5">
                      <span className="text-[10px] text-[#8B6C36] font-medium tabular-nums">
                        {chapter.index}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.08em] text-[#1E1915] truncate">
                        {chapter.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
