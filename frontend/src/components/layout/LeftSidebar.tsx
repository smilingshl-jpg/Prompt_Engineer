import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LeftSidebar({ promptState }: { promptState: any }) {
  const { history = [], loadHistoryItem, resetWorkspace } = promptState;
  const [panel, setPanel] = useState<'settings' | 'help' | null>(null);

  return (
    <>
      <aside className="w-[240px] shrink-0 bg-surface-container-low border-r border-outline-variant/40 flex flex-col h-full font-body text-sm">
        {/* New Chat */}
        <div className="p-3 border-b border-outline-variant/30">
          <button
            onClick={resetWorkspace}
            className="w-full bg-primary text-on-primary rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Prompt
          </button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="px-2 py-2 text-[10px] uppercase tracking-[0.12em] text-outline font-semibold">
            Recent
          </div>
          {history.length === 0 ? (
            <div className="px-3 py-6 flex flex-col items-center gap-2 text-center">
              <span className="material-symbols-outlined text-outline text-2xl">history</span>
              <span className="text-xs text-on-surface-variant/50">No history yet</span>
            </div>
          ) : (
            history.map((item: any, idx: number) => (
              <button
                key={item.id}
                onClick={() => loadHistoryItem(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all group flex items-start gap-2.5 mb-0.5 ${
                  idx === 0
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5 opacity-60">chat_bubble</span>
                <span className="truncate text-xs leading-relaxed">{item.originalPrompt || 'Draft Prompt'}</span>
              </button>
            ))
          )}
        </div>

        {/* Bottom actions */}
        <div className="p-2 border-t border-outline-variant/30 space-y-0.5">
          <button className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold text-primary border border-primary/20 hover:bg-primary/8 transition-colors mb-1.5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
            Upgrade to Pro
          </button>
          <button
            onClick={() => setPanel(panel === 'settings' ? null : 'settings')}
            className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 rounded-lg transition-all text-xs ${panel === 'settings' ? 'bg-surface-container text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-[16px]">settings</span>
            Settings
          </button>
          <button
            onClick={() => setPanel(panel === 'help' ? null : 'help')}
            className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 rounded-lg transition-all text-xs ${panel === 'help' ? 'bg-surface-container text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-[16px]">help_outline</span>
            Help
          </button>
        </div>
      </aside>

      {/* Settings Panel */}
      {panel === 'settings' && (
        <div
          className="fixed z-50 w-72 bg-surface-container rounded-xl shadow-2xl border border-outline-variant/40 p-5 space-y-5 animate-in slide-in-from-left-2 fade-in duration-200"
          style={{ left: '248px', bottom: '100px' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-on-surface text-sm">Settings</h3>
            <button onClick={() => setPanel(null)} className="text-outline hover:text-on-surface transition-colors p-1">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-outline font-semibold mb-3">Appearance</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">Dark Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-outline font-semibold mb-3">Data</div>
              <button
                onClick={() => { localStorage.removeItem('PROMPT_HISTORY'); window.location.reload(); }}
                className="w-full text-left text-xs text-error hover:bg-error/8 px-3 py-2 rounded-lg transition-colors"
              >
                Clear Prompt History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Panel */}
      {panel === 'help' && (
        <div
          className="fixed z-50 w-72 bg-surface-container rounded-xl shadow-2xl border border-outline-variant/40 p-5 space-y-4 animate-in slide-in-from-left-2 fade-in duration-200"
          style={{ left: '248px', bottom: '60px' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-on-surface text-sm">Quick Start</h3>
            <button onClick={() => setPanel(null)} className="text-outline hover:text-on-surface transition-colors p-1">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <div className="space-y-2">
            {[
              'Type your prompt in the center area',
              'Send to begin AI analysis',
              'Answer the quiz questions',
              'Confirm all to generate your prompt',
            ].map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-xs text-on-surface-variant leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-outline font-semibold mb-2">Shortcuts</div>
            <div className="space-y-1">
              {[['Send prompt', 'Enter'], ['New line', 'Shift + Enter']].map(([action, key]) => (
                <div key={action} className="flex justify-between items-center text-xs text-on-surface-variant py-1">
                  <span>{action}</span>
                  <kbd className="bg-surface-container-highest px-2 py-0.5 rounded text-[10px] font-mono">{key}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
