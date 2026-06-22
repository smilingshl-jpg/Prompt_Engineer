import { WorkspaceCenter } from '../tabs/WorkspaceCenter';
import { ModelsCenterLayout } from '../tabs/ModelsCenterLayout';

// Router component managing the active primary Workspace view
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CenterPanel({ promptState }: { promptState: any }) {
  const { activeTab } = promptState;

  if (activeTab === 'Models') return <ModelsCenterLayout promptState={promptState} />;
  
  if (activeTab === 'Library') {
    return (
      <main className="flex-1 bg-surface flex items-center justify-center animate-in fade-in duration-200 font-body">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-container border border-outline-variant/40 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-outline text-2xl">book_2</span>
          </div>
          <h2 className="font-headline text-lg font-bold text-on-surface">Template Library</h2>
          <p className="text-sm text-on-surface-variant">Coming soon — curated prompt templates for every use case.</p>
        </div>
      </main>
    )
  }
  
  return <WorkspaceCenter promptState={promptState} />;
}
