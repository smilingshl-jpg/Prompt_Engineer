// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ModelsCenterLayout({ promptState }: { promptState: any }) {
  const { apiKey, setApiKey, anthropicKey, setAnthropicKey, geminiKey, setGeminiKey, selectedModel, setSelectedModel } = promptState;

  const apiKeys = [
    { label: 'OpenAI', key: apiKey, setter: setApiKey, placeholder: 'sk-…', icon: 'api', color: 'text-primary', accent: 'border-primary/30' },
    { label: 'Anthropic', key: anthropicKey, setter: setAnthropicKey, placeholder: 'sk-ant-…', icon: 'psychology', color: 'text-secondary', accent: 'border-secondary/30' },
    { label: 'Google Gemini', key: geminiKey, setter: setGeminiKey, placeholder: 'AIza…', icon: 'diamond', color: 'text-tertiary', accent: 'border-tertiary/30' },
  ];

  const models = [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      desc: 'Multimodal intelligence with 128k context window.',
      tags: [{ label: 'Recommended', color: 'text-primary bg-primary/10' }, { label: 'Vision', color: 'text-on-surface-variant bg-surface-container-highest' }],
      icon: 'bolt', iconColor: 'text-primary', ring: 'border-primary ring-primary/20',
    },
    {
      id: 'claude-3-5-sonnet-latest',
      name: 'Claude 3.5 Sonnet',
      desc: 'Exceptional reasoning and long-form context handling.',
      tags: [{ label: 'Premium', color: 'text-secondary bg-secondary/10' }, { label: 'Coding', color: 'text-on-surface-variant bg-surface-container-highest' }],
      icon: 'auto_awesome', iconColor: 'text-secondary', ring: 'border-secondary ring-secondary/20',
    },
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      desc: 'Lightning-fast multimodal generative intelligence.',
      tags: [{ label: 'Speed', color: 'text-tertiary bg-tertiary/10' }],
      icon: 'diamond', iconColor: 'text-tertiary', ring: 'border-tertiary ring-tertiary/20',
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto bg-surface font-body">
      <div className="max-w-3xl mx-auto px-8 py-10 space-y-12">

        {/* API Keys */}
        <section className="space-y-5">
          <div>
            <h2 className="font-headline text-xl font-bold text-on-surface tracking-tight">API Keys</h2>
            <p className="text-xs text-on-surface-variant mt-1">Keys are stored locally in your browser and never sent to our servers.</p>
          </div>
          <div className="space-y-2">
            {apiKeys.map(({ label, key, setter, placeholder, icon, color, accent }) => (
              <div key={label} className={`bg-surface-container border ${accent} hover:border-opacity-60 rounded-xl px-4 py-3.5 flex items-center gap-4 transition-all`}>
                <span className={`material-symbols-outlined ${color} text-[20px] shrink-0`}>{icon}</span>
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] uppercase font-semibold tracking-widest text-on-surface-variant mb-0.5">{label}</label>
                  <input
                    type="password"
                    value={key}
                    onChange={e => setter(e.target.value)}
                    placeholder={placeholder}
                    className="bg-transparent border-none text-on-surface font-mono text-sm w-full focus:ring-0 p-0 placeholder:text-outline/50 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Models */}
        <section className="space-y-5">
          <div>
            <h2 className="font-headline text-xl font-bold text-on-surface tracking-tight">Active Model</h2>
            <p className="text-xs text-on-surface-variant mt-1">Select the model used for analysis and optimization.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {models.map(({ id, name, desc, tags, icon, iconColor, ring }) => {
              const active = selectedModel === id;
              return (
                <div
                  key={id}
                  onClick={() => setSelectedModel(id)}
                  className={`bg-surface-container rounded-xl p-5 border cursor-pointer transition-all flex items-start gap-4 ${active ? `${ring} ring-1` : 'border-outline-variant/30 hover:border-outline-variant/60'}`}
                >
                  <div className="p-2.5 bg-surface-container-high rounded-lg shrink-0">
                    <span className={`material-symbols-outlined ${iconColor} text-[20px]`}>{icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-bold text-sm text-on-surface mb-1">{name}</h3>
                    <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">{desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map(({ label, color }) => (
                        <span key={label} className={`text-[10px] ${color} px-2 py-0.5 rounded-md font-semibold uppercase tracking-tight`}>{label}</span>
                      ))}
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 transition-all ${active ? 'border-current bg-current' : 'border-outline-variant/50'}`} style={{ color: active ? 'var(--color-primary)' : undefined }} />
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </main>
  );
}
