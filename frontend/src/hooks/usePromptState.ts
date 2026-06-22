import { useState, useEffect } from 'react';
import { analyzePrompt, optimizePrompt, type QuizQuestion, type OptimizationParams } from '../services/aiService';

export interface PromptHistoryItem {
  id: string;
  timestamp: number;
  originalPrompt: string;
  optimizedPrompt: string;
  model: string;
  answers: Record<string, string[]>;
  confirmedQuestions: Record<string, boolean>;
  questions: import('../services/aiService').QuizQuestion[];
  analysisText: string;
  params: OptimizationParams;
}

export function usePromptState() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('OPENAI_API_KEY') || '');
  const [anthropicKey, setAnthropicKey] = useState(() => localStorage.getItem('ANTHROPIC_API_KEY') || '');
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('GEMINI_API_KEY') || '');
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('SELECTED_MODEL') || 'gpt-4o');
  
  const [activeTab, setActiveTab] = useState('Workspace');

  const [optimizationParams, setOptimizationParams] = useState<OptimizationParams>({
    depth: 'Standard Refinement',
    reasoning: 'Logical/Direct',
    verification: true,
    strictStructure: false,
    audience: 'Senior Engineer',
    format: 'Technical Brief',
    tone: 'Analytical',
    responseLength: 'Standard',
    jargonLevel: 'Some Technical',
    perspective: 'Neutral',
    language: 'English (US)',
    persona: 'Auto',
    taskType: 'Auto-detect',
    examplesInclusion: 'None',
    chainPrompting: false,
    antiHallucination: 'Basic',
    temperatureHint: 'Balanced',
    biasMitigation: false,
    outputWordLimit: 'None',
    sectionCount: 'Auto',
    iterationDepth: '1x Pass',
  });

  const [history, setHistory] = useState<PromptHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('PROMPT_HISTORY');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [draftPrompt, setDraftPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [confirmedQuestions, setConfirmedQuestions] = useState<Record<string, boolean>>({});
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState('');

  // Save values to localStorage when they change
  useEffect(() => {
    localStorage.setItem('OPENAI_API_KEY', apiKey);
    localStorage.setItem('ANTHROPIC_API_KEY', anthropicKey);
    localStorage.setItem('GEMINI_API_KEY', geminiKey);
    localStorage.setItem('SELECTED_MODEL', selectedModel);
  }, [apiKey, anthropicKey, geminiKey, selectedModel]);

  const handleAnalyze = async (prompt: string) => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);
    setDraftPrompt(prompt);
    setAnswers({});
    setConfirmedQuestions({});
    setFinalPrompt('');
    
    try {
      const keys = { openai: apiKey, anthropic: anthropicKey, gemini: geminiKey };
      const result = await analyzePrompt(prompt, selectedModel, keys);
      setAnalysisText(result.analysis || "I've analyzed your request. Let's refine it.");
      setQuestions(result.questions || []);
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "Failed to analyze prompt.";
      alert(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleAnswer = (questionId: string, answerLabel: string) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (current.includes(answerLabel)) {
        return { ...prev, [questionId]: current.filter(a => a !== answerLabel) };
      } else {
        return { ...prev, [questionId]: [...current, answerLabel] };
      }
    });
  };

  const appendContextAnswer = (questionId: string, context: string) => {
    if (!context.trim()) return;
    setAnswers(prev => {
      const current = (prev[questionId] || []).filter(a => !a.startsWith('📝 '));
      return { ...prev, [questionId]: [...current, `📝 ${context.trim()}`] };
    });
  };

  const confirmQuestion = async (questionId: string) => {
    const newConfirmed = { ...confirmedQuestions, [questionId]: true };
    setConfirmedQuestions(newConfirmed);
    
    // If all questions are answered, trigger optimization
    if (Object.keys(newConfirmed).length === questions.length) {
      setIsOptimizing(true);
      try {
        const keys = { openai: apiKey, anthropic: anthropicKey, gemini: geminiKey };
        const optimized = await optimizePrompt(draftPrompt, answers, selectedModel, keys, optimizationParams);
        setFinalPrompt(optimized);

        // Save to History
        const newItem: PromptHistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          originalPrompt: draftPrompt,
          optimizedPrompt: optimized,
          model: selectedModel,
          answers: answers,
          confirmedQuestions: newConfirmed,
          questions: questions,
          analysisText: analysisText,
          params: optimizationParams
        };
        setHistory(prev => {
          const updated = [newItem, ...prev].slice(0, 50); // Keep max 50 items
          localStorage.setItem('PROMPT_HISTORY', JSON.stringify(updated));
          return updated;
        });

      } catch (error: unknown) {
        console.error(error);
        alert("Failed to optimize prompt.");
      } finally {
        setIsOptimizing(false);
      }
    }
  };

  const resetWorkspace = () => {
    setDraftPrompt('');
    setAnalysisText('');
    setQuestions([]);
    setAnswers({});
    setConfirmedQuestions({});
    setFinalPrompt('');
  };

  const loadHistoryItem = (id: string) => {
    const item = history.find(h => h.id === id);
    if (item) {
      // Reset ALL quiz state first to prevent bleed from previous session
      setQuestions(item.questions || []);
      setAnalysisText(item.analysisText || '');
      setAnswers(item.answers || {});
      setConfirmedQuestions(item.confirmedQuestions || {});
      setDraftPrompt(item.originalPrompt);
      setFinalPrompt(item.optimizedPrompt);
      setOptimizationParams(item.params);
      setSelectedModel(item.model);
      setIsAnalyzing(false);
      setIsOptimizing(false);
      setActiveTab('Workspace');
    }
  };

  return {
    history, loadHistoryItem, resetWorkspace,
    activeTab, setActiveTab,
    optimizationParams, setOptimizationParams,
    apiKey, setApiKey,
    anthropicKey, setAnthropicKey,
    geminiKey, setGeminiKey,
    selectedModel, setSelectedModel,
    draftPrompt, setDraftPrompt,
    isAnalyzing, analysisText,
    questions, answers, confirmedQuestions, toggleAnswer, appendContextAnswer, confirmQuestion,
    handleAnalyze,
    isOptimizing, finalPrompt
  };
}
