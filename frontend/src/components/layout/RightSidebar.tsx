import { WorkspaceRight } from '../tabs/WorkspaceRight';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RightSidebar({ promptState }: { promptState: any }) {
  const { activeTab } = promptState;

  if (activeTab === 'Models') {
    return (
      <aside className="w-[240px] shrink-0 bg-surface-container-low border-l border-outline-variant/40 p-5 overflow-y-auto space-y-6 animate-in slide-in-from-right-3 fade-in duration-200 font-body">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-outline font-semibold mb-4">Usage · 24h</div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-xs text-on-surface-variant">Token Consumption</span>
                <span className="text-sm font-bold text-on-surface font-headline">428.5k</span>
              </div>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[65%] transition-all" />
              </div>
              <p className="text-[10px] text-outline mt-1">65% of daily quota</p>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (activeTab === 'Library') {
    return (
      <aside className="w-[240px] shrink-0 bg-surface-container-low border-l border-outline-variant/40 p-5 flex flex-col items-center justify-center animate-in slide-in-from-right-3 fade-in duration-200 font-body">
        <span className="material-symbols-outlined text-outline text-2xl mb-2">book_2</span>
        <p className="text-xs text-on-surface-variant text-center">Templates coming soon</p>
      </aside>
    );
  }

  return <WorkspaceRight promptState={promptState} />;
}
