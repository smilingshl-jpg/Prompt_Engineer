import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WorkspaceRight({ promptState }: { promptState: any }) {
  const { optimizationParams: p, setOptimizationParams } = promptState;
  const set = (key: string, val: unknown) => setOptimizationParams({ ...p, [key]: val });

  // All sections open by default
  const [open, setOpen] = useState<Record<string, boolean>>({
    optimization: true,
    parameters: true,
    language: false,
    engineering: false,
    quality: false,
    constraints: false,
  });
  const toggle = (key: string) => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  const Section = ({ id, icon, iconColor, label, children }: {
    id: string; icon: string; iconColor: string; label: string; children: React.ReactNode;
  }) => (
    <div className="border-b border-outline-variant/30 last:border-0">
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-container-high transition-colors group"
      >
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-[15px] ${iconColor}`}>{icon}</span>
          <span className="font-headline font-bold text-[11px] uppercase tracking-wider text-on-surface">{label}</span>
        </div>
        <span
          className="material-symbols-outlined text-[16px] text-outline group-hover:text-on-surface-variant transition-all duration-200"
          style={{ transform: open[id] ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        >
          expand_more
        </span>
      </button>
      {open[id] && (
        <div className="px-4 pb-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  );

  const Select = ({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void; options: string[];
  }) => (
    <div className="space-y-1">
      <label className="text-[10px] uppercase tracking-widest text-outline font-semibold">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary/50 outline-none rounded-lg text-xs py-1.5 pl-3 pr-7 text-on-surface appearance-none cursor-pointer transition-colors hover:border-outline"
        >
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[14px]">expand_more</span>
      </div>
    </div>
  );

  const Toggle = ({ label, checked, onChange, hint }: {
    label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string;
  }) => (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <span className="text-xs text-on-surface-variant">{label}</span>
        {hint && <p className="text-[10px] text-outline leading-tight mt-0.5">{hint}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-8 h-4.5 rounded-full relative transition-colors shrink-0 ${checked ? 'bg-primary' : 'bg-surface-container-highest'}`}
        style={{ height: '18px', width: '32px' }}
      >
        <span
          className="absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform shadow-sm"
          style={{ transform: checked ? 'translateX(14px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  );

  return (
    <aside className="w-[240px] shrink-0 bg-surface-container-low border-l border-outline-variant/40 overflow-y-auto font-body flex flex-col">

      {/* ── 1. Optimization ── */}
      <Section id="optimization" icon="tune" iconColor="text-primary" label="Optimization">
        <Select label="Depth" value={p.depth} onChange={v => set('depth', v)}
          options={['Standard Refinement', 'Deep Recursive', 'Maximum Creative']} />
        <Select label="Reasoning" value={p.reasoning} onChange={v => set('reasoning', v)}
          options={['Logical/Direct', 'Chain of Thought', 'Expert Peer Review']} />
        <Select label="Iteration" value={p.iterationDepth} onChange={v => set('iterationDepth', v)}
          options={['1x Pass', '2x Refinement', '3x Polish']} />
        <Toggle label="Verification checklist" checked={p.verification} onChange={v => set('verification', v)} />
        <Toggle label="Strict structure" checked={p.strictStructure} onChange={v => set('strictStructure', v)} />
      </Section>

      {/* ── 2. Parameters ── */}
      <Section id="parameters" icon="variables" iconColor="text-secondary" label="Parameters">
        <Select label="Audience" value={p.audience} onChange={v => set('audience', v)}
          options={['Senior Engineer', 'Product Manager', 'Beginner Learner', 'Executive', 'General Public']} />
        <Select label="Output Format" value={p.format} onChange={v => set('format', v)}
          options={['Technical Brief', 'Narrative Summary', 'Step-by-Step Guide', 'Bullet Points', 'Essay']} />
        <Select label="Tone" value={p.tone} onChange={v => set('tone', v)}
          options={['Analytical', 'Persuasive', 'Empathetic', 'Formal', 'Casual']} />
      </Section>

      {/* ── 3. Language & Style ── */}
      <Section id="language" icon="translate" iconColor="text-tertiary" label="Language & Style">
        <Select label="Response Length" value={p.responseLength} onChange={v => set('responseLength', v)}
          options={['Concise', 'Standard', 'Exhaustive']} />
        <Select label="Jargon Level" value={p.jargonLevel} onChange={v => set('jargonLevel', v)}
          options={['Plain English', 'Some Technical', 'Heavy Technical']} />
        <Select label="Perspective" value={p.perspective} onChange={v => set('perspective', v)}
          options={['Neutral', 'First Person', 'Third Person']} />
        <Select label="Language" value={p.language} onChange={v => set('language', v)}
          options={['English (US)', 'English (UK)', 'Spanish', 'French', 'German', 'Japanese', 'Chinese']} />
      </Section>

      {/* ── 4. Prompt Engineering ── */}
      <Section id="engineering" icon="psychology" iconColor="text-secondary" label="Prompt Engineering">
        <Select label="Persona / Role" value={p.persona} onChange={v => set('persona', v)}
          options={['Auto', 'Expert Analyst', 'Creative Writer', 'Teacher', 'Researcher', 'Software Engineer', 'Product Designer']} />
        <Select label="Task Type" value={p.taskType} onChange={v => set('taskType', v)}
          options={['Auto-detect', 'Coding', 'Writing', 'Analysis', 'Research', 'Brainstorming', 'Summarization']} />
        <Select label="Examples" value={p.examplesInclusion} onChange={v => set('examplesInclusion', v)}
          options={['None', '1–2 Examples', 'Many Examples']} />
        <Toggle
          label="Chain prompting"
          hint="Splits task into sequential sub-prompts"
          checked={p.chainPrompting}
          onChange={v => set('chainPrompting', v)}
        />
      </Section>

      {/* ── 5. Quality Controls ── */}
      <Section id="quality" icon="verified" iconColor="text-tertiary" label="Quality Controls">
        <Select label="Anti-Hallucination" value={p.antiHallucination} onChange={v => set('antiHallucination', v)}
          options={['Off', 'Basic', 'Strict']} />
        <Select label="Temperature Hint" value={p.temperatureHint} onChange={v => set('temperatureHint', v)}
          options={['Deterministic', 'Balanced', 'Creative']} />
        <Toggle
          label="Bias mitigation"
          hint="Adds fairness & balance instructions"
          checked={p.biasMitigation}
          onChange={v => set('biasMitigation', v)}
        />
      </Section>

      {/* ── 6. Output Constraints ── */}
      <Section id="constraints" icon="straighten" iconColor="text-outline" label="Output Constraints">
        <Select label="Word Limit" value={p.outputWordLimit} onChange={v => set('outputWordLimit', v)}
          options={['None', '~200w', '~500w', '~1000w', '~2000w']} />
        <Select label="Section Count" value={p.sectionCount} onChange={v => set('sectionCount', v)}
          options={['Auto', '3', '5', '7+']} />
      </Section>

    </aside>
  );
}
