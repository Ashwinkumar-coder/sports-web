import React from 'react';
import { Mail } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';

export default function Mailbox({ notificationLogs }) {
  return (
    <Card className="space-y-4">
      <CardHeader className="flex justify-between items-center mb-2">
        <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider font-extrabold text-[var(--text-primary)]">
          <Mail className="w-4 h-4 text-[var(--accent)]" />
          Simulated Mailbox
        </CardTitle>
        <Badge variant="neutral" className="font-mono">
          Total: {notificationLogs.length}
        </Badge>
      </CardHeader>
      
      <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
        System-triggered emails (registration, updates, invites) appear below in real-time.
      </p>
      
      {notificationLogs.length === 0 ? (
        <p className="text-[var(--text-muted)] text-xs italic py-4 text-center">No email logs dispatched yet.</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {notificationLogs.map(log => (
            <div key={log.id} className="bg-[var(--bg-input)] border border-[var(--border-default)] p-3 rounded-xl text-xs space-y-2 transition-all hover:border-[var(--border-card-hover)]">
              <div className="flex justify-between items-center text-[9px] font-mono text-[var(--text-secondary)]">
                <span>To: <span className="font-bold text-[var(--text-primary)]">{log.recipient_email}</span></span>
                <span>{new Date(log.sent_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) + ' IST'}</span>
              </div>
              <div className="font-extrabold text-[var(--text-primary)] text-[11px]">{log.subject}</div>
              <div className="text-[var(--text-secondary)] whitespace-pre-wrap leading-tight text-[10px] bg-[var(--bg-page)] p-2 rounded-lg border border-[var(--border-default)] font-mono">
                {log.body}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
