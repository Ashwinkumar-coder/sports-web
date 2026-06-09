import fs from 'fs';

const src = fs.readFileSync('src/components/StaticCharts.jsx', 'utf-8');

const CLASSIC_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', 
  '#ec4899', '#f43f5e', '#4ade80', '#2dd4bf', '#38bdf8'
];

let colorIndex = 0;
const newSrc = src.replace(/(registrations:\s*\d+[^]*?color:\s*)'#[a-fA-F0-9]{6}'/g, (match, p1) => {
  const c = CLASSIC_COLORS[colorIndex % CLASSIC_COLORS.length];
  colorIndex++;
  return p1 + "'" + c + "'";
});

fs.writeFileSync('src/components/StaticCharts.jsx', newSrc);
console.log('Replaced colors with classic vibrant palette!');
