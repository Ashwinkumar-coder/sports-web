import React, { useState, useRef } from 'react';
import geoPaths from './districtsGeoPaths.json';

const NAME_MAPPING = {
  'the nilgiris': 'nilgiris',
  'tuticorin': 'thoothukudi',
  'kanniyakumari': 'kanyakumari',
  'sivaganga': 'sivagangai',
  'tirupathur': 'tirupattur',
  'thiruvallur': 'tiruvallur',
  'thiruvarur': 'tiruvarur',
  'trichy': 'tiruchirappalli'
};

const normalizeName = (name) => {
  if (!name) return '';
  const lower = name.toLowerCase().trim();
  return NAME_MAPPING[lower] || lower;
};

export default function TamilNaduMap({ selectedMapDistrict, setSelectedMapDistrict, districts38 = [] }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const MAX_REG = districts38.length > 0 ? Math.max(...districts38.map((d) => d.registrations)) : 1;
  const hovered = selectedMapDistrict !== null ? districts38[selectedMapDistrict] : null;
  const barWidth = hovered ? (hovered.registrations / MAX_REG) * 100 : 0;
  const top5 = [...districts38].sort((a, b) => b.registrations - a.registrations).slice(0, 5);

  const containerW = containerRef.current?.clientWidth ?? 310;
  const containerH = containerRef.current?.clientHeight ?? 395;
  const tipW = 210;
  const tipH = 140;
  const tipX = mousePos.x + 18 + tipW > containerW ? mousePos.x - tipW - 12 : mousePos.x + 18;
  const tipY = mousePos.y - tipH / 2 < 0 ? 8 : mousePos.y + tipH > containerH ? containerH - tipH - 8 : mousePos.y - tipH / 2;

  // Process and sort districts based on geoPaths so they match the SVG drawing order
  const mappedDistricts = geoPaths.map((geo) => {
    const normalizedGeoName = normalizeName(geo.name);
    const districtIndex = districts38.findIndex((d) => normalizeName(d.name) === normalizedGeoName);
    const data = districtIndex >= 0 ? districts38[districtIndex] : null;
    return { ...geo, data, districtIndex };
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-[#080e1c]"
      style={{ aspectRatio: '310 / 395' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSelectedMapDistrict(null)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#080e1c] to-black opacity-80" />

      <svg
        viewBox="0 0 310 395"
        className="w-full h-full relative z-10"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
      >
        <defs>
          <filter id="glowHover" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g>
          {mappedDistricts.map((dist, i) => {
            const isHov = selectedMapDistrict === dist.districtIndex && dist.districtIndex !== -1;
            const hasHover = selectedMapDistrict !== null;
            const [cx, cy] = dist.centroid || [0, 0];

            return (
              <g key={i}>
                <path
                  d={dist.path}
                  fill={dist.data ? dist.data.color : '#1e293b'}
                  stroke={isHov ? '#ffffff' : '#080e1c'}
                  strokeWidth={isHov ? 1.2 : 0.4}
                  strokeLinejoin="round"
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    opacity: hasHover ? (isHov ? 1 : 0.3) : 0.9,
                    filter: isHov ? 'url(#glowHover)' : 'none',
                  }}
                  onMouseEnter={() => {
                    if (dist.districtIndex >= 0) setSelectedMapDistrict(dist.districtIndex);
                  }}
                />
                {/* Permanent District Label */}
                {cx > 0 && cy > 0 && (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none select-none font-bold uppercase"
                    style={{
                      fontSize: '5px',
                      fill: '#ffffff',
                      opacity: hasHover ? (isHov ? 1 : 0.1) : 0.85,
                      textShadow: '0px 0px 2px rgba(0,0,0,0.8), 0px 1px 1px rgba(0,0,0,0.8)',
                    }}
                  >
                    {dist.name}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* ── HOVER TOOLTIP WITH BAR CHART ── */}
      {hovered && (
        <div
          className="absolute pointer-events-none z-30"
          style={{ left: tipX, top: tipY, width: tipW }}
        >
          <div
            className="rounded-xl border p-3 shadow-2xl backdrop-blur-xl"
            style={{
              background: 'rgba(7,14,32,0.96)',
              borderColor: hovered.color + '55',
              boxShadow: `0 0 24px ${hovered.color}33`,
            }}
          >
            {/* District name */}
            <div
              className="text-xs font-black uppercase tracking-widest mb-1"
              style={{ color: hovered.color }}
            >
              {hovered.name}
            </div>

            {/* Count */}
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-white text-xl font-extrabold">
                {hovered.registrations.toLocaleString()}
              </span>
              <span className="text-slate-400 text-[10px] font-semibold">players</span>
            </div>

            {/* Main bar */}
            <div className="mb-2">
              <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                <span className="uppercase tracking-wider font-bold">Total Players</span>
                <span style={{ color: hovered.color, fontWeight: 'bold' }}>{hovered.registrations.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800/70 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    background: `linear-gradient(90deg, ${hovered.color}99, ${hovered.color})`,
                    boxShadow: `0 0 6px ${hovered.color}88`,
                  }}
                />
              </div>
            </div>

            {/* Mini comparison bars for top-5 */}
            <div className="space-y-[3px]">
              {top5.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span
                    className="text-[8px] font-bold truncate"
                    style={{ width: 58, color: d.name === hovered.name ? d.color : '#64748b' }}
                  >
                    {d.name}
                  </span>
                  <div className="flex-1 bg-slate-800/50 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(d.registrations / MAX_REG) * 100}%`,
                        background: d.name === hovered.name
                          ? `linear-gradient(90deg, ${d.color}aa, ${d.color})`
                          : '#334155',
                        boxShadow: d.name === hovered.name ? `0 0 4px ${d.color}77` : 'none',
                      }}
                    />
                  </div>
                  <span
                    className="text-[8px] font-mono"
                    style={{ color: d.name === hovered.name ? d.color : '#475569' }}
                  >
                    {(d.registrations / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}