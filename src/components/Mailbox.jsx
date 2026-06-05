export default function Mailbox({ notificationLogs }) {
  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 glass-panel space-y-4">
      <h3 className="font-bold text-slate-200 flex items-center gap-2">
        <svg className="w-4 h-4 text-sports-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
        Simulated Mailbox logs
      </h3>
      <p className="text-[10px] text-slate-500">Emails triggered by the system register/invite flows will log here in real-time for verify purposes.</p>
      
      {notificationLogs.length === 0 ? (
        <p className="text-slate-500 text-xs italic">No email logs dispatched yet.</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {notificationLogs.map(log => (
            <div key={log.id} className="bg-slate-900 border border-slate-800 p-3 rounded text-[11px] space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                <span>To: {log.recipient_email}</span>
                <span>{new Date(log.sent_at).toLocaleTimeString()}</span>
              </div>
              <div className="font-bold text-slate-300">{log.subject}</div>
              <div className="text-slate-400 whitespace-pre-wrap leading-tight text-[10px] bg-slate-950/50 p-2 rounded border border-slate-900 font-mono">
                {log.body}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
