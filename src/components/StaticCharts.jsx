import React from 'react';
import { Award, MapPin, TrendingUp, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './ui/Card';

export default function StaticCharts() {
  const districtData = [
    { name: 'Chennai', registrations: 8420, color: 'from-cyan-400 to-blue-500', percentage: 94 },
    { name: 'Coimbatore', registrations: 6150, color: 'from-purple-400 to-indigo-500', percentage: 76 },
    { name: 'Madurai', registrations: 4890, color: 'from-emerald-400 to-teal-500', percentage: 62 },
    { name: 'Trichy', registrations: 3950, color: 'from-pink-400 to-rose-500', percentage: 50 },
    { name: 'Salem', registrations: 3210, color: 'from-amber-400 to-yellow-500', percentage: 41 },
  ];

  const sportsRegistrationData = [
    { sport: 'Cricket', count: '14,250 Players', percentage: 40, color: '#06b6d4' },
    { sport: 'Kabaddi', count: '8,400 Players', percentage: 25, color: '#a855f7' },
    { sport: 'Athletics', count: '9,120 Players', percentage: 15, color: '#10b981' },
    { sport: 'Football', count: '7,850 Players', percentage: 12, color: '#f43f5e' },
    { sport: 'Basketball', count: '4,200 Players', percentage: 8, color: '#eab308' },
  ];

  const getDotStyle = (color) => {
    return { backgroundColor: color };
  };

  const getWidthStyle = (percent) => {
    return { width: percent + '%' };
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="border-t border-[var(--border-default)] pt-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-[var(--accent)] animate-pulse" />
          38nSports Analytics & National Statistics
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 bg-slate-900/40 border border-slate-800 shadow-xl hover:border-slate-700 transition duration-300">
          <CardHeader className="p-0 mb-4 flex justify-between items-start">
            <div>
              <CardTitle className="text-xs uppercase tracking-wider font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--accent)]" />
                Top Districts Registration (Tamil Nadu)
              </CardTitle>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-semibold">
                District-wise active registrations out of 38 districts
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400 animate-bounce" />
          </CardHeader>

          <div className="space-y-3">
            {districtData.map((district) => {
              return (
                <div key={district.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[var(--text-primary)] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                      {district.name}
                    </span>
                    <span className="text-[var(--text-secondary)] font-mono">
                      {district.registrations.toLocaleString() + ' (' + district.percentage + '%)'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-850">
                    <div
                      className={`bg-gradient-to-r ${district.color} h-full rounded-full`}
                      style={getWidthStyle(district.percentage)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-default)] flex justify-between items-center text-[10px] text-[var(--text-secondary)] font-semibold font-mono">
            <span>Overall TN Reporting: 38/38 Districts</span>
            <span className="text-[var(--accent-text)]">42,820 Registrations</span>
          </div>
        </Card>

        <Card className="p-5 bg-slate-900/40 border border-slate-800 shadow-xl hover:border-slate-700 transition duration-300">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xs uppercase tracking-wider font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--accent)]" />
              Discipline Distribution (Sports Pie Chart)
            </CardTitle>
            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-semibold">
              Discipline registration ratios of athletes
            </p>
          </CardHeader>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
            <div className="relative w-36 h-36 shrink-0">
              <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--bg-page)" strokeWidth="4.5" />
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#06b6d4" strokeWidth="4.5" strokeDasharray="40 60" strokeDashoffset="0" />
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#a855f7" strokeWidth="4.5" strokeDasharray="25 75" strokeDashoffset="-40" />
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray="15 85" strokeDashoffset="-65" />
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f43f5e" strokeWidth="4.5" strokeDasharray="12 88" strokeDashoffset="-80" />
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#eab308" strokeWidth="4.5" strokeDasharray="8 92" strokeDashoffset="-92" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-slate-100">5 Sports</span>
                <span className="text-[8px] uppercase font-mono tracking-widest text-slate-500 font-bold">Top Ratios</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 w-full text-xs font-mono">
              {sportsRegistrationData.map((item) => {
                return (
                  <div key={item.sport} className="flex justify-between items-center bg-slate-950/40 px-2 py-1 rounded border border-slate-900/50 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={getDotStyle(item.color)}></span>
                      <span className="text-slate-300 font-semibold">{item.sport}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold font-mono">{item.percentage + '%'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
