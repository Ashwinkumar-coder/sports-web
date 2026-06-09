import React from 'react';
import { Card, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Coins, History, HeartHandshake } from 'lucide-react';

export default function SponsorView({
  activeTab,
  dashboardData,
  tournaments,
  sponsorAmount,
  setSponsorAmount,
  handleSponsorTournament
}) {
  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-6 text-xs">
        {/* Aggregates */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] p-6 rounded-2xl flex items-center justify-between shadow-[var(--shadow-card)]">
          <div>
            <span className="text-[var(--text-secondary)] text-[10px] font-extrabold uppercase tracking-widest block">Total Sponsorship Contributed</span>
            <span className="text-3xl font-black text-[var(--accent)] mt-1.5 block font-display">₹{dashboardData.total_sponsored.toFixed(2)}</span>
          </div>
          <Coins className="w-10 h-10 text-[var(--accent)] opacity-40 shrink-0" />
        </div>

        {/* Sponsorship history */}
        <Card>
          <CardHeader className="mb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="w-5 h-5 text-[var(--accent)]" />
              Your Sponsorship Pledges
            </CardTitle>
          </CardHeader>
          {dashboardData.sponsorships.length === 0 ? (
            <p className="text-[var(--text-muted)] text-xs italic py-4 text-center">You have not sponsored any tournament yet.</p>
          ) : (
            <div className="space-y-2.5 mt-2">
              {dashboardData.sponsorships.map(s => (
                <div key={s.id} className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] flex justify-between items-center text-xs hover:border-[var(--border-card-hover)] transition-all">
                  <div>
                    <span className="font-bold text-[var(--text-primary)]">{s.tournament_name}</span>
                    <span className="block text-[10px] text-[var(--text-secondary)] uppercase font-mono mt-0.5">{s.tournament_status}</span>
                  </div>
                  <span className="font-mono font-bold text-[var(--accent)]">+ ${s.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  }

  
  if (activeTab === 'fund_tournament') {
    const fundedTourneys = tournaments.filter(t => t.is_approved);
    return (
      <div className="space-y-6 text-xs">
        <Card>
          <CardHeader className="mb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[var(--accent)]" />
              Sponsor Tournaments
            </CardTitle>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Select an active tournament to provide financial sponsorships.</p>
          </CardHeader>
          
          <div className="flex gap-3 items-center mb-5 mt-2">
            <label className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-extrabold">Pledge Amount ($):</label>
            <input
              type="number"
              autoComplete="off"
              className="w-32 rounded-xl px-3 py-1.5 text-xs font-mono"
              value={sponsorAmount}
              onChange={(e) => setSponsorAmount(e.target.value)}
            />
          </div>

          {fundedTourneys.length === 0 ? (
            <p className="text-[var(--text-muted)] text-xs italic py-4 text-center">No active tournaments available for sponsorship at this time.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fundedTourneys.map(t => (
                <div key={t.id} className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] flex flex-col justify-between gap-3 text-xs hover:border-[var(--border-card-hover)] transition-all">
                  <div>
                    <div className="font-extrabold text-[var(--text-primary)] text-sm">{t.name}</div>
                    <div className="text-[10px] text-[var(--text-secondary)] mt-1.5 uppercase font-semibold">Status: <Badge variant="primary">{t.status}</Badge></div>
                  </div>
                  <Button
                    onClick={() => handleSponsorTournament(t.id)}
                    className="w-full text-xs py-2 uppercase"
                  >
                    Fund Tournament
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  }

  return null;
}
