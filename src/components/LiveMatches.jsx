import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

export default function LiveMatches({ matches, onSelectMatch }) {
  return (
    <Card className="space-y-4">
      <CardHeader className="flex justify-between items-center mb-2">
        <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider font-extrabold text-[var(--text-primary)]">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
          </span>
          Live & Scheduled
        </CardTitle>
        <Badge variant="neutral" className="font-mono">
          Total: {matches.length}
        </Badge>
      </CardHeader>
      
      {matches.length === 0 ? (
        <p className="text-[var(--text-muted)] text-xs italic py-4 text-center">No matches scheduled at the moment.</p>
      ) : (
        <div className="space-y-3">
          {matches.map(m => (
            <div key={m.id} className="bg-[var(--bg-input)] border border-[var(--border-default)] p-3 rounded-xl text-xs space-y-2.5 transition-all hover:border-[var(--border-card-hover)]">
              <div className="flex justify-between items-center text-[10px] uppercase font-mono">
                <span className="text-[var(--text-secondary)] font-bold">{m.tournament.name}</span>
                <Badge 
                  variant={m.status === 'live' ? 'primary' : 'neutral'}
                  glow={m.status === 'live'}
                  oscillate={m.status === 'live'}
                >
                  {m.status}
                </Badge>
              </div>

              <div className="font-bold text-[var(--text-primary)] flex justify-between">
                <span>{m.team_a.name}</span>
                <span className="font-mono">{m.team_a_runs}/{m.team_a_wickets} <span className="text-[var(--text-secondary)] text-[10px]">({m.team_a_overs} ov)</span></span>
              </div>

              <div className="font-bold text-[var(--text-primary)] flex justify-between">
                <span>{m.team_b.name}</span>
                <span className="font-mono">{m.team_b_runs}/{m.team_b_wickets} <span className="text-[var(--text-secondary)] text-[10px]">({m.team_b_overs} ov)</span></span>
              </div>

              {m.status === 'completed' && m.winner && (
                <div className="text-[10px] text-[var(--accent-text)] font-extrabold border-t border-[var(--border-default)] pt-2 flex items-center gap-1.5">
                  🏆 Winner: {m.winner.name}
                </div>
              )}

              {onSelectMatch && (
                <div className="border-t border-[var(--border-default)] pt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectMatch(m)}
                    className="text-[10px] py-1 px-2.5 h-auto font-bold tracking-wider"
                  >
                    View Stats
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
