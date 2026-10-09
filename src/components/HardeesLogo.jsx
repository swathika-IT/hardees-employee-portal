import React from 'react';

export default function HardeesLogo({ height = 46, className = '' }) {
  return (
    <div className={`hardees-logo-wrapper ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg width={height * 1.15} height={height} viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hardee's iconic golden smiling star */}
        <path d="M50 4L62 31L92 33L68 53L76 82L50 66L24 82L32 53L8 33L38 31L50 4Z" fill="#FFC928" stroke="#801820" strokeWidth="2.5" strokeLinejoin="round"/>
        {/* Smiling eye arches */}
        <path d="M38 37C39 33 43 33 44 37" stroke="#801820" strokeWidth="3" strokeLinecap="round"/>
        <path d="M56 37C57 33 61 33 62 37" stroke="#801820" strokeWidth="3" strokeLinecap="round"/>
        {/* Smiling happy mouth */}
        <path d="M42 46C46 51 54 51 58 46" stroke="#801820" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: "'Cinzel', 'Playfair Display', serif",
          fontWeight: 900,
          fontSize: `${height * 0.52}px`,
          color: '#C8202B',
          letterSpacing: '1.5px'
        }}>
          HARDEE'S
        </span>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: `${height * 0.22}px`,
          fontWeight: 700,
          color: '#801820',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginTop: '2px'
        }}>
          Charbroiled Burgers
        </span>
      </div>
    </div>
  );
}
