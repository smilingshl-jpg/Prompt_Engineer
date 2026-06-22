import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type QuizOption = {
  label: string;
  icon: string;
};

export type QuizQuestion = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  options: QuizOption[];
};

export async function analyzePrompt(userPrompt: string, model: string, keys: { openai: string, anthropic: string, gemini: string }) {
  // Role defined first per research best practice, then task, then format template
  const systemPrompt = `ROLE: You are an expert prompt analysis engine for PromptStudio.

TASK: Given a vague initial prompt, identify what critical details are missing that would make the prompt highly effective. You must produce between 6 and 8 clarifying questions that collectively capture the full depth and intent of the request.

INSTRUCTION: Think step by step about every dimension of the prompt that is ambiguous or underspecified before generating questions. Each question MUST cover a completely different dimension — never ask two questions that probe the same concept. Cover as many of these distinct dimensions as are relevant: Goal/Purpose, Target Audience, Output Format, Tone/Style, Scope/Depth, Constraints/Limitations, Context/Background, Success Criteria, and Delivery Medium. If the prompt is complex or has many unknowns, generate 8 questions; otherwise generate 6. Do not ask about things already explicitly stated in the prompt.

OUTPUT FORMAT: Output ONLY strict JSON matching this schema exactly. No markdown wrappers, no explanation, just raw JSON:
{
  "analysis": "1-2 sentence explanation of what key details are missing from the prompt",
  "questions": [
    {
      "id": "q1",
      "emoji": "🎯",
      "title": "Short question category label (e.g. Goal, Audience, Format, Tone, Scope, Constraints, Context, Success Criteria)",
      "description": "The actual question to ask the user, phrased clearly and concisely.",
      "options": [
        { "label": "Short answer option label", "icon": "💻" }
      ]
    }
  ]
}

CONSTRAINTS:
- Generate between 6 and 8 questions. Never generate fewer than 6 or more than 8.
- Every question must address a distinct, non-overlapping dimension of the prompt. Reject any question that is semantically similar to another.
- Each question must have 4-6 well-differentiated answer options that cover the realistic range of user intent.
- Emojis must be semantically relevant to each option label.
- Question titles must reflect the specific dimension being explored (e.g. "Tone", "Scope", "Audience", "Output Format").
- Do NOT output anything outside the JSON object.`;

  if (model.includes('gpt')) {
    if (!keys.openai) throw new Error("OpenAI API Key required. Check your Settings.");
    const openai = new OpenAI({ apiKey: keys.openai, dangerouslyAllowBrowser: true });
    const response = await openai.chat.completions.create({
      model: model,
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }]
    });
    return JSON.parse(response.choices[0].message.content || '{"questions": []}');
  } 
  
  if (model.includes('claude')) {
    if (!keys.anthropic) throw new Error("Anthropic API Key required! Note: Anthropic strictly blocks browser calls by default unless you use a CORS proxy.");
    const anthropic = new Anthropic({ apiKey: keys.anthropic, dangerouslyAllowBrowser: true });
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt + "\n\n(IMPORTANT: Output strictly raw JSON. Do not use markdown wrappers.)" }]
    });
    const content = (response.content[0] as any).text;
    const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson || '{"questions": []}');
  }

  if (model.includes('gemini')) {
    if (!keys.gemini) throw new Error("Gemini API Key required! Check your Settings.");
    const genAI = new GoogleGenerativeAI(keys.gemini);
    const geminiModel = genAI.getGenerativeModel({ model: model, systemInstruction: systemPrompt });
    const result = await geminiModel.generateContent(userPrompt + "\nOutput strict JSON matching exactly the requested schema.");
    const cleanJson = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson || '{"questions": []}');
  }

  throw new Error("Invalid model selected");
}

export interface OptimizationParams {
  // Optimization
  depth: string;
  reasoning: string;
  verification: boolean;
  strictStructure: boolean;
  // Parameters
  audience: string;
  format: string;
  tone: string;
  // Language & Style
  responseLength: string;
  jargonLevel: string;
  perspective: string;
  language: string;
  // Prompt Engineering
  persona: string;
  taskType: string;
  examplesInclusion: string;
  chainPrompting: boolean;
  // Quality Controls
  antiHallucination: string;
  temperatureHint: string;
  biasMitigation: boolean;
  // Output Constraints
  outputWordLimit: string;
  sectionCount: string;
  iterationDepth: string;
}

export async function optimizePrompt(
  userPrompt: string, 
  answers: Record<string, string[]>, 
  model: string, 
  keys: { openai: string, anthropic: string, gemini: string },
  params: OptimizationParams
) {
  // Detect if the prompt is coding/technical in nature
  const codingKeywords = ['code', 'function', 'script', 'api', 'build', 'implement', 'debug', 'app', 'program', 'algorithm', 'class', 'component', 'react', 'python', 'javascript', 'typescript', 'database', 'query', 'endpoint', 'deploy', 'refactor', 'test', 'module', 'library', 'framework', 'backend', 'frontend'];
  const combinedText = (userPrompt + ' ' + JSON.stringify(answers)).toLowerCase();
  const isCodingPrompt = codingKeywords.some(kw => combinedText.includes(kw));

  const codingCtx = isCodingPrompt ? `

CODING-SPECIFIC REQUIREMENTS — ALL sections below are MANDATORY for any prompt involving code, scripts, APIs, or technical implementation. Do not condense or skip any section:

## Tech Stack & Environment
Specify: programming language and exact version (e.g. Python 3.11, Node 18.x), frameworks/libraries with versions, runtime environment (browser, server, containerized), and any hard tooling constraints (e.g. no external packages allowed).

## Input / Output Specification
For every function, endpoint, or component being built:
- Define exact input format: parameter names, data types, shape, validation rules, pre-conditions
- Define exact output format: return type, HTTP status codes if applicable, response schema, post-conditions
- Include at least one concrete input -> expected output example as a doctest or inline comment.

## Implementation Steps
A numbered, ordered list of concrete, actionable developer tasks. Each step must be specific enough to act on immediately without interpretation. Example of a good step: "3. Create a POST /api/users endpoint that accepts { name: string, email: string }, validates both fields are non-empty strings, inserts into the users table, and returns { id, name, email } with HTTP 201 on success." Do NOT write vague steps.

## Success Criteria & Tests
Define exactly what 'done' means. Include:
- At least 3 specific test cases: input value -> expected output value
- Edge cases that must pass (empty string, null, boundary value, concurrent request, etc.)
- Acceptance criteria the final implementation must satisfy before review.

## Error Handling & Edge Cases
Explicitly list each known failure mode and how to handle it:
- Invalid inputs (wrong type, missing field, out-of-range value)
- External failures (network timeout, database down, third-party API error)
- Security concerns (input sanitization, auth checks, rate limiting)

## Dependencies & Assumptions
- Exact install commands for all required packages (e.g. npm install zod@3.22.0)
- All required environment variables with description of what each does
- Assumptions about existing codebase, database schema, or infrastructure` : '';

  const paramCtx = `
STUDIO CONFIGURATION (apply all settings exactly as specified):

[OPTIMIZATION]
- Depth: ${params.depth}
- Reasoning: ${params.reasoning}${params.reasoning === 'Chain of Thought' ? ' — structure the prompt so the AI reasons step by step before giving a final answer' : params.reasoning === 'Expert Peer Review' ? ' — frame the prompt as if written by a domain expert who has reviewed it with peers' : ''}
- Iteration: ${params.iterationDepth}${params.iterationDepth === '2x Refinement' ? ' — instruct the AI to produce an initial answer, then self-critique and improve it' : params.iterationDepth === '3x Polish' ? ' — instruct the AI to draft, critique, rewrite, then polish' : ''}
${params.strictStructure ? '- STRICT STRUCTURE: Use ## Markdown headers for every section. No section may be absent, merged, or reordered.' : ''}
${params.verification ? "- VERIFICATION CHECKLIST: End the prompt with a '## Verification Checklist' section listing 3-5 specific, testable acceptance criteria." : ''}

[AUDIENCE & STYLE]
- Target Audience: ${params.audience} — calibrate vocabulary and assumed knowledge for this audience.
- Tone: ${params.tone}
- Perspective: ${params.perspective}
- Jargon Level: ${params.jargonLevel}
- Response Length: ${params.responseLength}${params.responseLength === 'Concise' ? ' — instruct the AI to be brief and direct, no filler' : params.responseLength === 'Exhaustive' ? ' — instruct the AI to be thorough and cover every edge case' : ''}
- Output Language: ${params.language}

[PROMPT ENGINEERING]
- Output Format: ${params.format}
- Persona/Role: ${params.persona === 'Auto' ? 'Infer the best expert role from the task context' : `The AI should adopt the persona of a ${params.persona}`}
- Task Type: ${params.taskType}
- Examples: ${params.examplesInclusion}${params.examplesInclusion !== 'None' ? ' — include concrete worked examples in the prompt' : ''}
${params.chainPrompting ? '- CHAIN PROMPTING: Break the task into a sequence of chained sub-prompts, each building on the previous output.' : ''}

[QUALITY CONTROLS]
- Anti-Hallucination: ${params.antiHallucination}${params.antiHallucination === 'Basic' ? " — add instruction: 'If you are uncertain, say so explicitly'" : params.antiHallucination === 'Strict' ? " — add instructions: 'Cite your reasoning for every claim. If you cannot verify something, state that clearly. Do not fabricate details.'" : ''}
- Temperature Hint: ${params.temperatureHint}${params.temperatureHint === 'Deterministic' ? ' — instruct the AI to be precise and consistent, avoid creative variation' : params.temperatureHint === 'Creative' ? ' — instruct the AI to explore multiple angles and generate diverse ideas' : ''}
${params.biasMitigation ? '- BIAS MITIGATION: Add an instruction to present multiple perspectives fairly and avoid loaded language.' : ''}

[OUTPUT CONSTRAINTS]
${params.outputWordLimit !== 'None' ? `- Word Limit: Target approximately ${params.outputWordLimit} in the final response.` : ''}
${params.sectionCount !== 'Auto' ? `- Section Count: Structure the output into exactly ${params.sectionCount} sections.` : ''}
${codingCtx}`;

  // Research report rule: role first, then explicit task, then format rules, then content
  const systemPrompt = `ROLE: You are a world-class prompt engineer who writes structured, professional, high-performance prompts for production AI systems.

TASK: Rewrite the user's vague initial prompt into a highly structured, professional prompt using their quiz answers to add specific detail. Think step by step about what makes a prompt truly excellent for this particular task type before writing the output.

FORMAT RULES — apply ALL of the following:
1. Put the core TASK INSTRUCTION first — before any background or context.
2. Use clear ## Markdown headers to organize every section (e.g. ## Goal, ## Audience, ## Format, ## Constraints, ## Context).
3. Be explicit and precise — replace vague terms with specific, testable requirements.
4. Include an explicit OUTPUT FORMAT specification stating exactly how the response should be structured, its length, and its style.
5. State all constraints explicitly (length limits, what to always include, what to never include).
6. Do NOT include meta-commentary about the prompt itself. Output ONLY the final ready-to-use prompt text — nothing else.

${paramCtx}`;
  const combinedPrompt = `Initial Prompt: ${userPrompt}\nClarifications provided by user:\n${JSON.stringify(answers, null, 2)}`;

  if (model.includes('gpt')) {
    if (!keys.openai) throw new Error("OpenAI API Key required");
    const openai = new OpenAI({ apiKey: keys.openai, dangerouslyAllowBrowser: true });
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: combinedPrompt }
      ]
    });
    return response.choices[0].message.content || '';
  }

  if (model.includes('claude')) {
    if (!keys.anthropic) throw new Error("Anthropic API Key required");
    const anthropic = new Anthropic({ apiKey: keys.anthropic, dangerouslyAllowBrowser: true });
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: combinedPrompt }]
    });
    return (response.content[0] as any).text || '';
  }

  if (model.includes('gemini')) {
    if (!keys.gemini) throw new Error("Gemini API Key required");
    const genAI = new GoogleGenerativeAI(keys.gemini);
    const geminiModel = genAI.getGenerativeModel({ model: model, systemInstruction: systemPrompt });
    const result = await geminiModel.generateContent(combinedPrompt);
    return result.response.text() || '';
  }

  return '';
}
