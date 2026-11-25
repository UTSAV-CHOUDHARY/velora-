import React, { useState } from 'react';
import {
  BOTANICAL_ELIXIR_IMAGE,
  RUNWAY_GOWN_IMAGE,
  SILK_COUTURE_IMAGE,
} from '../data/products';

interface MaisonSectionProps {
  onOpenSalon: () => void;
}

const ATELIER_CHAPTERS = [
  {
    id: 'drapery',
    index: '01',
    title: '01. Silk & Hand Stitching',
    heading: 'Crafted in Mumbai & New Delhi',
    copy: 'Every dress is hand-draped by skilled Indian karigars using pure Mulberry silk and soft silk-velvet so the outfit fits naturally and moves gracefully.',
    metric: '42 hrs of handwork in every signature gown',
    image: RUNWAY_GOWN_IMAGE,
    alt: 'VELORA evening gown on studio dress form',
  },
  {
    id: 'alchemy',
    index: '02',
    title: '02. Natural Ingredients',
    heading: 'Pure Saffron, Sandalwood & Rosehip',
    copy: 'Our face serums and lipsticks contain zero harsh chemicals or silicones. We use Pampore saffron, Mysore sandalwood, and Kannauj rose extracts cold-pressed in small batches.',
    metric: '99.4% natural cold-pressed plant ingredients',
    image: BOTANICAL_ELIXIR_IMAGE,
    alt: 'VELORA frosted amber glass serum bottles',
  },
  {
    id: 'salon',
    index: '03',
    title: '03. Store Visit & Styling',
    heading: 'Personal Fittings Across India',
    copy: 'Book a one-on-one visit at our Mumbai, New Delhi, or Bengaluru stores—or book a video call with our stylists for custom wedding, party, and festive fittings.',
    metric: 'Flagship stores · Mumbai · New Delhi · Bengaluru · Video Call',
    image: SILK_COUTURE_IMAGE,
    alt: 'Pure champagne ivory Mulberry silk fabric',
  },
];

export const MaisonSection: React.FC<MaisonSectionProps> = ({ onOpenSalon }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = ATELIER_CHAPTERS[activeIdx];

  return (
    <section
      id="maison"
      className="mx-auto max-w-[1380px] px-4 sm:px-8 lg:px-14 py-16 sm:py-24 border-t border-[#E3DBD0]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        {/* Left Editorial Narrative & Interactive Craft Tabs */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-[#8B6C36] uppercase font-medium">
              About VELORA · India
            </p>
            <h2
              className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1E1915] leading-[1.08]"
              style={{ textWrap: 'balance' }}
            >
              Indian Craftsmanship Meets Modern Design
            </h2>

            {/* Chapter Switcher */}
            <div className="mt-8 flex flex-wrap gap-2">
              {ATELIER_CHAPTERS.map((chap, idx) => (
                <button
                  key={chap.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    idx === activeIdx
                      ? 'bg-[#1E1915] text-[#FAF7F2]'
                      : 'bg-[#FAF7F2] border border-[#DDD3C5] text-[#4A3F35] hover:border-[#A58347]'
                  }`}
                >
                  {chap.title}
                </button>
              ))}
            </div>

            {/* Active Chapter Copy */}
            <div className="mt-8 rounded-2xl bg-[#FAF7F2] border border-[#E5DDD2] p-6 sm:p-8">
              <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#1E1915]">
                {current.heading}
              </h3>
              <p className="mt-3 text-sm sm:text-[15px] text-[#4A3F35] leading-relaxed">
                {current.copy}
              </p>
              <p className="mt-5 pt-4 border-t border-[#ECE4D9] text-xs tracking-[0.1em] uppercase text-[#8B6C36] font-medium tabular-nums">
                {current.metric}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onOpenSalon}
              className="px-6 py-3 rounded-full bg-gradient-to-b from-[#B49052] to-[#98763D] hover:from-[#A58347] hover:to-[#876632] text-[#FAF7F2] text-[11px] font-medium tracking-[0.16em] shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              BOOK A STORE VISIT
            </button>
            <span className="text-xs text-[#5C4F43]">
              Kala Ghoda, Mumbai &amp; Mehrauli, New Delhi · Open Daily
            </span>
          </div>
        </div>

        {/* Right Editorial Photography */}
        <div className="lg:col-span-6 flex">
          <div className="relative w-full min-h-[360px] lg:min-h-full rounded-2xl overflow-hidden border border-[#E3DBD0] bg-[#EAE2D6]">
            <img
              src={current.image}
              alt={current.alt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#1E1915]/80 via-[#1E1915]/35 to-transparent text-[#FAF7F2]">
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#E4CFA8]">
                {current.index} · Our Craft
              </p>
              <p className="mt-1 font-display text-xl sm:text-2xl">{current.heading}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
