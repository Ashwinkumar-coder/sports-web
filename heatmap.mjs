import fs from 'fs';

const src = fs.readFileSync('src/components/StaticCharts.jsx', 'utf-8');

// The original base color for dark was something like #1d4ed8. We can interpolate between #0f172a (low) and #d6ff00 (high) or #00f2fe (high).
// Let's use a nice cyan/lime gradient.
function interpolateColor(color1, color2, factor) {
    if (arguments.length < 3) { factor = 0.5; }
    var result = color1.slice(1).match(/.{2}/g).map((hex, i) => {
        return Math.round(parseInt(hex, 16) + factor * (parseInt(color2.slice(1).match(/.{2}/g)[i], 16) - parseInt(hex, 16))).toString(16).padStart(2, '0');
    });
    return "#" + result.join("");
}

// Find all registrations to get min and max
const regRegex = /registrations:\s*(\d+)/g;
let match;
let maxReg = 0;
while ((match = regRegex.exec(src)) !== null) {
  const r = parseInt(match[1], 10);
  if (r > maxReg) maxReg = r;
}

let newSrc = src.replace(/(registrations:\s*(\d+)[^]*?color:\s*)'#[a-fA-F0-9]{6}'/g, (fullMatch, p1, regStr) => {
  const reg = parseInt(regStr, 10);
  // Intensity from 0.2 to 1.0 based on registration count
  const factor = Math.max(0.15, reg / maxReg);
  // low: dark teal #0f766e, high: neon lime #d6ff00
  const color = interpolateColor('#0f766e', '#d6ff00', factor);
  return p1 + "'" + color + "'";
});

fs.writeFileSync('src/components/StaticCharts.jsx', newSrc);
console.log('Applied heatmap colors!');
