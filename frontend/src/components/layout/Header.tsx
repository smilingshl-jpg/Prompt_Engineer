// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Header({ promptState }: { promptState: any }) {
  const { activeTab, setActiveTab } = promptState;

  const navItems = ['Workspace', 'Library', 'Models'];

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full px-6 h-14 bg-surface-container-low/80 backdrop-blur-md border-b border-outline-variant/40 font-body">
      {/* Logo + Nav */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-sm" style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}>edit_note</span>
          </div>
          <span className="font-headline text-base font-bold text-on-surface tracking-tight">PromptStudio</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeTab === tab
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[16px]">search</span>
          <input
            className="bg-surface-container border border-outline-variant/40 outline-none rounded-lg pl-9 pr-4 py-1.5 text-xs w-56 focus:border-primary/50 focus:bg-surface-container-high transition-all placeholder:text-outline text-on-surface"
            placeholder="Search workspace..."
            type="text"
          />
        </div>
        <button className="text-on-surface-variant hover:text-on-surface p-2 hover:bg-surface-container rounded-lg transition-all">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:text-on-surface p-2 hover:bg-surface-container rounded-lg transition-all">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-on-primary font-headline font-bold text-xs ml-1">
          SP
        </div>
      </div>
    </header>
  );
}
