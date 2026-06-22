import { useState, useEffect } from 'react';
import type { QuizQuestion } from '../../services/aiService';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WorkspaceCenter({ promptState }: { promptState: any }) {
  const {
    setDraftPrompt,
    isAnalyzing, analysisText,
    questions, answers, confirmedQuestions, toggleAnswer, appendContextAnswer, confirmQuestion,
    handleAnalyze,
    isOptimizing, finalPrompt,
    selectedModel, setSelectedModel
  } = promptState;

  const [inputVal, setInputVal] = useState("");
  const [quizCollapsed, setQuizCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contextInputs, setContextInputs] = useState<Record<string, string>>({});
  const [showContext, setShowContext] = useState<Record<string, boolean>>({});

  // Reset local state when a new set of questions loads
  useEffect(() => {
    setQuizCollapsed(false);
    setContextInputs({});
    setShowContext({});
  }, [questions]);

  const handleSend = () => {
    if (!inputVal.trim() || isAnalyzing || isOptimizing) return;
    setDraftPrompt(inputVal);
    handleAnalyze(inputVal);
    setInputVal("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = finalPrompt;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isEmpty = !isAnalyzing && !isOptimizing && !analysisText && !finalPrompt;

  return (
    <section className="flex-1 bg-surface flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">

        {/* Welcome / Empty state */}
        {isEmpty && (
          <div className="h-full flex flex-col items-center justify-center px-8 py-16 gap-8">
            <div className="space-y-3 text-center max-w-md">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>edit_note</span>
              </div>
              <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Craft a better prompt</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Describe what you want to build or create. PromptStudio will analyze it, ask clarifying questions, and generate a highly optimized prompt.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-xl w-full">
              {[
                { icon: '💻', label: 'Write a React component for...', hint: 'Code' },
                { icon: '✍️', label: 'Draft a blog post about...', hint: 'Writing' },
                { icon: '🔍', label: 'Analyze this dataset and...', hint: 'Analysis' },
              ].map(({ icon, label, hint }) => (
                <button
                  key={hint}
                  onClick={() => setInputVal(label)}
                  className="bg-surface-container border border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container-high text-left rounded-xl p-4 transition-all group"
                >
                  <div className="text-xl mb-2">{icon}</div>
                  <div className="text-[10px] uppercase tracking-widest text-outline font-semibold mb-1">{hint}</div>
                  <p className="text-xs text-on-surface-variant leading-relaxed group-hover:text-on-surface transition-colors">{label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading state */}
        {(isAnalyzing || isOptimizing) && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined animate-spin text-primary text-xl">autorenew</span>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-on-surface">
                {isAnalyzing ? 'Analyzing your prompt…' : 'Building optimized prompt…'}
              </p>
              <p className="text-xs text-on-surface-variant">
                {isAnalyzing ? 'Identifying missing context and dimensions' : 'Applying your answers across all parameters'}
              </p>
            </div>
          </div>
        )}

        {/* Quiz view */}
        {!isAnalyzing && analysisText && (() => {
          const totalQ = questions.length;
          const answeredQ = Object.keys(confirmedQuestions).length;
          const allDone = totalQ > 0 && answeredQ === totalQ;

          return (
            <div className="max-w-3xl mx-auto px-6 py-8 space-y-5 animate-in slide-in-from-bottom-3 fade-in duration-250">
              {/* Header row */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1.5">
                    <h2 className="font-headline text-lg font-bold text-on-surface">Let's refine your prompt</h2>
                    <div className="flex items-center gap-2 shrink-0">
                      {allDone && (
                        <span className="flex items-center gap-1.5 text-[11px] text-tertiary font-semibold bg-tertiary/10 px-2.5 py-1 rounded-lg">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          All done
                        </span>
                      )}
                      {totalQ > 0 && (
                        <button
                          onClick={() => setQuizCollapsed(c => !c)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 px-2.5 py-1 rounded-lg transition-all hover:text-primary"
                        >
                          <span className="tabular-nums">{answeredQ}/{totalQ}</span>
                          <span className="material-symbols-outlined text-sm transition-transform duration-200" style={{ transform: quizCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>expand_more</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{analysisText}</p>
                </div>
              </div>

              {/* Questions grid */}
              {!quizCollapsed && (
                <div className="grid grid-cols-2 gap-3">
                  {questions.map((q: QuizQuestion) => {
                    const isAnswered = !!confirmedQuestions[q.id];
                    return (
                      <div
                        key={q.id}
                        className={`bg-surface-container rounded-xl p-4 border transition-all flex flex-col ${
                          isAnswered
                            ? 'border-primary/30 opacity-55'
                            : 'border-outline-variant/40 hover:border-primary/30 card-glow'
                        }`}
                      >
                        {/* Card header */}
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="text-xl leading-none">{q.emoji}</span>
                          <span className="font-headline font-bold text-sm text-on-surface">{q.title}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">{q.description}</p>

                        {isAnswered ? (
                          <div className="mt-auto flex items-center gap-2 bg-primary/8 text-primary text-xs font-semibold px-3 py-2 rounded-lg">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            <span className="truncate">{answers[q.id]?.join(', ')}</span>
                          </div>
                        ) : (
                          <div className="mt-auto space-y-2.5 pt-2.5 border-t border-outline-variant/20">
                            {/* Option chips */}
                            <div className="flex flex-wrap gap-1.5">
                              {q.options?.map((opt, idx) => {
                                const selected = answers[q.id]?.includes(opt.label);
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => toggleAnswer(q.id, opt.label)}
                                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${
                                      selected
                                        ? 'bg-primary text-on-primary border-primary'
                                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:border-primary/40 hover:text-on-surface'
                                    }`}
                                  >
                                    <span>{opt.icon}</span>
                                    <span>{opt.label}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Add Context */}
                            <button
                              onClick={() => setShowContext(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                              className="flex items-center gap-1 text-[11px] text-on-surface-variant hover:text-primary transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">{showContext[q.id] ? 'remove' : 'add'}</span>
                              Add Context
                            </button>
                            {showContext[q.id] && (
                              <textarea
                                value={contextInputs[q.id] || ''}
                                onChange={e => setContextInputs(prev => ({ ...prev, [q.id]: e.target.value }))}
                                placeholder="Any extra detail for this question…"
                                rows={2}
                                className="w-full text-xs bg-surface-container-low border border-outline-variant/40 focus:border-primary/50 rounded-lg p-2.5 text-on-surface placeholder:text-outline/50 resize-none outline-none transition-colors"
                              />
                            )}

                            {/* Confirm */}
                            <div className="flex justify-end">
                              <button
                                onClick={() => {
                                  if (contextInputs[q.id]?.trim()) appendContextAnswer(q.id, contextInputs[q.id]);
                                  confirmQuestion(q.id);
                                }}
                                disabled={!answers[q.id] || answers[q.id].length === 0}
                                className="text-[11px] uppercase tracking-widest font-bold bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface-variant px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* Final prompt */}
        {!isOptimizing && finalPrompt && (
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-4 animate-in fade-in zoom-in-98 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-tertiary/10 border border-tertiary/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-tertiary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <div className="flex-1 flex items-center justify-between">
                <h2 className="font-headline text-lg font-bold text-on-surface">Optimized Prompt</h2>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    copied ? 'text-tertiary bg-tertiary/10 border border-tertiary/20' : 'text-primary bg-primary/10 hover:bg-primary/15 border border-primary/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-5 text-on-surface-variant text-sm whitespace-pre-wrap font-body leading-relaxed max-h-[500px] overflow-y-auto">
              {finalPrompt}
            </div>
          </div>
        )}

      </div>

      {/* Input bar */}
      <div className="p-4 border-t border-outline-variant/30 bg-surface shrink-0">
        <div className="max-w-3xl mx-auto bg-surface-container border border-outline-variant/40 focus-within:border-primary/40 rounded-xl transition-all">
          <div className="flex items-end gap-3 px-4 pt-3.5 pb-2">
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              className="flex-1 bg-transparent border-none focus:outline-none text-on-surface font-body text-sm resize-none placeholder:text-outline/60 leading-relaxed"
              placeholder="Describe what you want to create or optimize…"
              rows={3}
            />
            <button
              onClick={handleSend}
              disabled={!inputVal.trim() || isAnalyzing || isOptimizing}
              className="p-2.5 bg-primary text-on-primary rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed mb-1 shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>

          {/* Toolbar row */}
          <div className="flex justify-between items-center px-4 pb-2.5 pt-1 border-t border-outline-variant/20">
            <div className="flex gap-3">
              <button className="flex items-center gap-1.5 text-[11px] text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-sm">attach_file</span>
                Attach
              </button>
              <button className="flex items-center gap-1.5 text-[11px] text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                Enhance
              </button>
            </div>
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent border border-outline-variant/40 hover:border-outline rounded-lg py-1 pl-2.5 pr-7 text-[11px] text-on-surface-variant outline-none cursor-pointer focus:border-primary/50 transition-colors appearance-none"
              >
                <optgroup label="OpenAI">
                  <option value="gpt-4o" className="bg-surface-container">GPT-4o</option>
                  <option value="gpt-4o-mini" className="bg-surface-container">GPT-4o Mini</option>
                </optgroup>
                <optgroup label="Anthropic">
                  <option value="claude-3-5-sonnet-latest" className="bg-surface-container">Claude 3.5 Sonnet</option>
                  <option value="claude-3-5-haiku-latest" className="bg-surface-container">Claude 3.5 Haiku</option>
                </optgroup>
                <optgroup label="Google">
                  <option value="gemini-2.5-flash" className="bg-surface-container">Gemini 2.5 Flash</option>
                  <option value="gemini-2.0-flash" className="bg-surface-container">Gemini 2.0 Flash</option>
                  <option value="gemini-1.5-pro" className="bg-surface-container">Gemini 1.5 Pro</option>
                </optgroup>
              </select>
              <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[14px]">expand_more</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
