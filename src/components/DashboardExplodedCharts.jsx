// src/components/DashboardExplodedCharts.jsx
// Renders all 5 dashboard KPI panels as interactive exploded donut pie charts.
import React, { useState } from 'react';

/* ─────────────────────────────────────────────
   Generic helpers
───────────────────────────────────────────── */
function toRad(deg) { return (deg * Math.PI) / 180; }

/** Build an SVG arc-path for a donut slice. */
function slicePath(startDeg, endDeg, outerR, innerR, cx = 80, cy = 80) {
  const s = toRad(startDeg);
  const e = toRad(endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;

  const ox1 = cx + outerR * Math.cos(s);
  const oy1 = cy + outerR * Math.sin(s);
  const ox2 = cx + outerR * Math.cos(e);
  const oy2 = cy + outerR * Math.sin(e);

  const ix1 = cx + innerR * Math.cos(e);
  const iy1 = cy + innerR * Math.sin(e);
  const ix2 = cx + innerR * Math.cos(s);
  const iy2 = cy + innerR * Math.sin(s);

  return [
    `M ${ox1} ${oy1}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${ox2} ${oy2}`,
    `L ${ix1} ${iy1}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${ix2} ${iy2}`,
    'Z',
  ].join(' ');
}

/* ─────────────────────────────────────────────
   Single reusable ExplodedDonut panel
   props:
     title       – card heading string
     icon        – emoji prefix
     slices      – [{ label, value, sub, color }]
     centerLabel – text inside the donut hole
     centerValue – bold value inside hole
     currency    – bool → show ₹ prefix
     totalLabel  – if provided, show total row
     totalValue  – string
───────────────────────────────────────────── */
function ExplodedDonut({
  title, icon, slices,
  centerLabel, centerValue,
  currency = false,
  totalLabel, totalValue,
}) {
  const [hovered, setHovered] = useState(null);

  // Compute angles
  const total = slices.reduce((s, d) => s + d.value, 0);
  let cursor = -90; // start at top
  const segments = slices.map((d, i) => {
    const sweep = (d.value / total) * 360;
    const start = cursor;
    const end = cursor + sweep;
    cursor = end;
    const mid = toRad((start + end) / 2);
    const isH = hovered === i;
    const ex = isH ? 10 : 5;
    return { ...d, start, end, mid, ex, i, pct: Math.round((d.value / total) * 100) };
  });

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 card-3d space-y-3 hover:border-slate-700 transition-colors duration-200">
      {/* Header */}
      <h4 className="font-extrabold text-[11px] text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-1.5">
        {icon} {title}
      </h4>

      {/* Chart row */}
      <div className="flex items-center gap-4">
        {/* SVG donut */}
        <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
          <svg viewBox="0 0 160 160" width="160" height="160" className="overflow-visible">
            <defs>
              <filter id={`glow-${title.replace(/\s/g,'')}`} x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id={`shadow-${title.replace(/\s/g,'')}`}>
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.55" />
              </filter>
            </defs>

            {segments.map((seg) => {
              const isH = hovered === seg.i;
              const outerR = isH ? 66 : 61;
              const innerR = 32;
              const dx = Math.cos(seg.mid) * seg.ex;
              const dy = Math.sin(seg.mid) * seg.ex;
              return (
                <g
                  key={seg.i}
                  transform={`translate(${dx},${dy})`}
                  style={{ transition: 'transform 0.22s ease' }}
                  filter={isH
                    ? `url(#glow-${title.replace(/\s/g,'')})`
                    : `url(#shadow-${title.replace(/\s/g,'')})`}
                  onMouseEnter={() => setHovered(seg.i)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                >
                  <path
                    d={slicePath(seg.start, seg.end, outerR, innerR)}
                    fill={seg.color}
                    stroke="#020617"
                    strokeWidth={isH ? 2.5 : 1.5}
                    opacity={isH ? 1 : 0.82}
                    style={{ transition: 'all 0.22s ease' }}
                  />
                </g>
              );
            })}

            {/* Centre text */}
            <text x="80" y="75" textAnchor="middle" dominantBaseline="middle"
              fill="#64748b" fontSize="7" fontWeight="bold"
              fontFamily="monospace" className="uppercase pointer-events-none select-none tracking-widest">
              {hovered !== null ? slices[hovered].label.split(' ')[0] : centerLabel}
            </text>
            <text x="80" y="88" textAnchor="middle" dominantBaseline="middle"
              fill={hovered !== null ? slices[hovered].color : '#e2e8f0'}
              fontSize="10" fontWeight="900" fontFamily="monospace"
              className="pointer-events-none select-none">
              {hovered !== null
                ? `${currency ? '₹' : ''}${slices[hovered].sub || slices[hovered].value}`
                : centerValue}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {segments.map((seg) => (
            <div
              key={seg.i}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border cursor-pointer transition-all duration-200 ${hovered === seg.i
                  ? 'bg-slate-800/80 border-slate-600 shadow-lg'
                  : 'bg-slate-950/40 border-slate-900/60 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              onMouseEnter={() => setHovered(seg.i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-1 ring-white/10"
                style={{ background: seg.color }} />
              <span className="text-slate-300 text-[9px] font-bold font-mono truncate flex-1 uppercase tracking-wide"
                title={seg.label}>
                {seg.label}
              </span>
              <div className="flex flex-col items-end flex-shrink-0">
                <span className="text-[9px] font-mono font-extrabold" style={{ color: seg.color }}>
                  {seg.sub || seg.value}
                </span>
              </div>
            </div>
          ))}

          {/* Optional total row */}
          {totalLabel && (
            <div className="mt-0.5 pt-1.5 border-t border-slate-800 flex justify-between text-[9px] font-mono text-slate-400">
              <span className="uppercase tracking-wider">{totalLabel}</span>
              <span className="font-extrabold text-slate-200">{totalValue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main export: renders all 5 charts
───────────────────────────────────────────── */
export default function DashboardExplodedCharts() {
  return (
    <div className="space-y-4">

      {/* 1. Tournaments Status */}
      <ExplodedDonut
        icon="🏆"
        title="Tournaments Status"
        centerLabel="TOTAL"
        centerValue="32"
        slices={[
          { label: 'Live Tourneys',     value: 8,  sub: '8 Live',     color: '#ef4444' },
          { label: 'Upcoming Tourneys', value: 15, sub: '15 Upcoming', color: '#3b82f6' },
          { label: 'Finished Tourneys', value: 9,  sub: '9 Finished',  color: '#10b981' },
        ]}
      />

      {/* 2. Registered Teams */}
      <ExplodedDonut
        icon="🛡️"
        title="Registered Teams"
        centerLabel="TEAMS"
        centerValue="320"
        slices={[
          { label: 'Cricket  (12 T)',    value: 185, sub: '185 Teams', color: '#06b6d4' },
          { label: 'Kabaddi  (8 T)',     value: 75,  sub: '75 Teams',  color: '#a855f7' },
          { label: 'Football & Ath.', value: 60,  sub: '60 Teams',  color: '#f59e0b' },
        ]}
      />

      {/* 3. Active Platform Events */}
      <ExplodedDonut
        icon="🎯"
        title="Active Platform Events"
        centerLabel="EVENTS"
        centerValue="36"
        slices={[
          { label: 'State Championships', value: 12, sub: '12 Active',    color: '#10b981' },
          { label: 'District Qualifiers', value: 24, sub: '24 Scheduled', color: '#eab308' },
        ]}
      />

      {/* 4. Sponsor Contributions */}
      <ExplodedDonut
        icon="₹"
        title="Sponsor Contributions"
        centerLabel="PLEDGED"
        centerValue="₹45.8L"
        currency={true}
        totalLabel="Total Pledged"
        totalValue="₹45,80,000"
        slices={[
          { label: 'TCS Sports Fund',  value: 1500000, sub: '15 Lakhs', color: '#06b6d4' },
          { label: 'Murugappa Group',  value: 1200000, sub: '12 Lakhs', color: '#a855f7' },
          { label: 'TVS Motor Co',     value: 1000000, sub: '10 Lakhs', color: '#f43f5e' },
          { label: 'MRF Tyres Ltd',    value:  580000, sub: '5.8 Lakhs', color: '#f59e0b' },
          { label: 'Tamil Nadu Tour.', value:  300000, sub: '3 Lakhs',  color: '#10b981' },
        ]}
      />

      {/* 5. Coaches By Sport */}
      <ExplodedDonut
        icon="👥"
        title="Coaches By Sport"
        centerLabel="COACHES"
        centerValue="219"
        slices={[
          { label: 'Cricket Coaches',   value: 85, sub: '85 Coaches', color: '#d6ff00' },
          { label: 'Kabaddi Coaches',   value: 54, sub: '54 Coaches', color: '#06b6d4' },
          { label: 'Football Coaches',  value: 48, sub: '48 Coaches', color: '#f43f5e' },
          { label: 'Athletics Coaches', value: 32, sub: '32 Coaches', color: '#ec4899' },
        ]}
      />

    </div>
  );
}
