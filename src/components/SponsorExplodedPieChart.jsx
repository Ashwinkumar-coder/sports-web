// src/components/SponsorExplodedPieChart.jsx
import React, { useState } from 'react';

const SLICE_COLORS = [
  '#d6ff00', '#06b6d4', '#a855f7', '#f43f5e', '#ec4899',
  '#3b82f6', '#10b981', '#f97316', '#eab308',
];

function toRad(deg) { return (deg * Math.PI) / 180; }

function getSlicePath(startAngle, endAngle, outerR, innerR, cx = 100, cy = 100) {
  const s = toRad(startAngle);
  const e = toRad(endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  const ox1 = cx + outerR * Math.cos(s);
  const oy1 = cy + outerR * Math.sin(s);
  const ox2 = cx + outerR * Math.cos(e);
  const oy2 = cy + outerR * Math.sin(e);

  const ix1 = cx + innerR * Math.cos(e);
  const iy1 = cy + innerR * Math.sin(e);
  const ix2 = cx + innerR * Math.cos(s);
  const iy2 = cy + innerR * Math.sin(s);

  return `M ${ox1} ${oy1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${ox2} ${oy2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
}

export default function SponsorExplodedPieChart({ sponsors }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!sponsors || sponsors.length === 0) {
    return (
      <p className="text-slate-500 italic text-[11px] text-center py-4">
        No sponsor data available.
      </p>
    );
  }

  const total = sponsors.reduce((sum, s) => sum + (s.amount || 0), 0);

  let currentAngle = -90;
  const slices = sponsors.map((s, i) => {
    const pct = total > 0 ? s.amount / total : 1 / sponsors.length;
    const sweep = pct * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sweep;
    currentAngle = endAngle;

    const mid = toRad((startAngle + endAngle) / 2);
    const isHovered = hoveredIdx === i;
    const ex = isHovered ? 14 : 6;
    const dx = Math.cos(mid) * ex;
    const dy = Math.sin(mid) * ex;
    const color = SLICE_COLORS[i % SLICE_COLORS.length];
    const outerR = isHovered ? 72 : 68;
    const innerR = 34;

    return { ...s, startAngle, endAngle, mid, dx, dy, outerR, innerR, color, pct, i };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
      {/* SVG Pie */}
      <div className="relative flex-shrink-0" style={{ width: 200, height: 200 }}>
        <svg viewBox="0 0 200 200" width="200" height="200" className="overflow-visible">
          <defs>
            <filter id="spGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="spShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
            </filter>
          </defs>

          {slices.map((slice) => {
            const isH = hoveredIdx === slice.i;
            return (
              <g
                key={slice.i}
                transform={`translate(${slice.dx},${slice.dy})`}
                style={{ transition: 'transform 0.25s ease' }}
                filter={isH ? 'url(#spGlow)' : 'url(#spShadow)'}
                onMouseEnter={() => setHoveredIdx(slice.i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                <path
                  d={getSlicePath(slice.startAngle, slice.endAngle, slice.outerR, slice.innerR)}
                  fill={slice.color}
                  stroke="#020617"
                  strokeWidth={isH ? 2.5 : 1.5}
                  opacity={isH ? 1 : 0.85}
                  style={{ transition: 'all 0.22s ease' }}
                />
              </g>
            );
          })}

          {/* Centre hole text */}
          <text x="100" y="96" textAnchor="middle" dominantBaseline="middle"
            fill="#94a3b8" fontSize="7" fontWeight="bold" fontFamily="monospace"
            className="uppercase tracking-widest pointer-events-none select-none">
            {hoveredIdx !== null ? slices[hoveredIdx].name.split(' ')[0] : 'SPONSORS'}
          </text>
          <text x="100" y="108" textAnchor="middle" dominantBaseline="middle"
            fill={hoveredIdx !== null ? slices[hoveredIdx].color : '#e2e8f0'}
            fontSize="9" fontWeight="900" fontFamily="monospace"
            className="pointer-events-none select-none">
            {hoveredIdx !== null
              ? `₹${slices[hoveredIdx].amount?.toLocaleString()}`
              : `${sponsors.length}`}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {slices.map((slice) => (
          <div
            key={slice.i}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border cursor-pointer transition-all duration-200 ${
              hoveredIdx === slice.i
                ? 'bg-slate-800/80 border-slate-600'
                : 'bg-slate-900/40 border-slate-800/50 hover:bg-slate-800/40'
            }`}
            onMouseEnter={() => setHoveredIdx(slice.i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-1 ring-white/10"
              style={{ background: slice.color }} />
            <span className="text-slate-200 text-[10px] font-semibold truncate flex-1" title={slice.name}>
              {slice.name}
            </span>
            <div className="flex flex-col items-end flex-shrink-0">
              <span className="text-[10px] font-mono font-extrabold" style={{ color: slice.color }}>
                ₹{slice.amount?.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        <div className="mt-1 pt-1.5 border-t border-slate-800 flex justify-between text-[9px] font-mono text-slate-400">
          <span className="uppercase tracking-wider">Total Pledged</span>
          <span className="font-extrabold text-slate-200">₹{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
