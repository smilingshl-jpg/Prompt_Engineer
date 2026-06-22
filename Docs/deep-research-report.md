# Prompt Engineering: A Comprehensive Guide and Best Practices

**Executive Summary:** Prompt engineering – the art of crafting inputs to LLMs – is crucial for eliciting accurate, coherent, and useful outputs. Best practices vary by task and model: for creative writing, open-ended, descriptive prompts with style cues improve creativity; for coding, explicit specifications (I/O formats, pre/post-conditions, examples) greatly enhance correctness【36†L528-L536】【31†L166-L172】; for summarization and Q&A, clear instructions, context delimitation, and examples drive relevance and factuality【31†L50-L57】【39†L219-L224】. Across tasks, techniques like **few-shot prompting** (providing in-context examples) boost performance over zero-shot at the cost of more tokens【3†L241-L250】【31†L101-L109】. **Chain-of-thought** prompts (forcing stepwise reasoning) markedly improve complex problem-solving accuracy in large models【3†L258-L266】【26†L61-L66】 but incur extra token and latency costs. Prompt length should balance detail with efficiency: include only necessary context, and constrain output (e.g. “3–5 sentences” or format templates) for predictable answers【31†L133-L140】【39†L219-L224】. Use the ChatGPT-style **system/developer role** for global instructions (tone/persona) and the user role for the task prompt【13†L1062-L1070】【31†L50-L57】. Temperature and decoding settings also matter: higher temperature yields more creative but riskier outputs, whereas temperature=0 is recommended for factual tasks【21†L196-L202】. To evaluate prompts, use task-specific metrics (accuracy/F1 for Q&A, ROUGE/BLEU for summarization, pass@k for code) plus efficiency measures (token count, latency). Human evaluation of coherence and relevance is also essential. We summarize trade-offs and recommendations in comparative tables below, illustrate a general prompt workflow, and provide sample templates and a practitioner’s checklist. 

## 1. Prompt Structure by Task

Different tasks call for different prompt styles. In general, **be explicit and specific**: define the task clearly, give context or role, and articulate the desired format or style【22†L89-L98】【31†L50-L57】. Key prompt patterns by task include:

- **Creative Writing:** Use *open-ended, descriptive prompts* with stylistic cues and context. For example:  
  *“Write a short inspiring poem about OpenAI and AI safety, in the style of Robert Frost.”*  
  This guides the model while leaving creative freedom【31†L64-L72】【22†L89-L98】. Include genre, tone, length, or famous-author analogies to constrain output without stifling creativity. High temperature (e.g. 0.7–1.0) is often used for variety, while specifying length (e.g. “about 150 words”) or structure (lines, stanzas) keeps output focused【31†L133-L140】【39†L212-L218】.

- **Coding / Code Generation:** Prompts should **explicitly specify all requirements and constraints**. Common elements are: required libraries or imports, input/output formats, pre-/post-conditions, error handling, and examples. For instance:  
  *“Write a Python function `convert_to_binary(n)` that converts the given integer `n` to its binary string. Assume `n` can be positive, negative, or zero. For negative `n`, prefix the binary with ‘-’. Include comments explaining each step.”*  
  This level of detail often turns failing prompts into correct ones, as shown by recent studies【37†L624-L632】【36†L528-L536】. The code-prompt guidelines emphasize clarity: e.g. “input list must be non-empty” (pre-condition) and “output should be a sorted list” (post-condition)【37†L624-L632】【36†L528-L536】. Adding short examples or doctests can further constrain the output format【37†L624-L632】【36†L538-L545】. Use of language hints (e.g. starting the prompt with `import` or defining a function signature) nudges the model into the correct syntax【31†L166-L172】. For coding, deterministic decoding (temperature=0) is recommended to maximize correctness.

- **Summarization:** Use *instructional prompts with clear format instructions*. Example:  
  *“Summarize the following article in 3–5 bullet points, focusing on the main findings.”*  
  Put the instruction first and delimit the source text (e.g. with quotes or triple quotes) as shown in OpenAI guidance【31†L50-L57】. Specify output format explicitly (e.g. “Use bullet points with at most 10 words each” or provide a templated example) to ensure consistency【31†L87-L96】【39†L219-L224】. If summarizing multiple documents, name them or number them. Few-shot examples (one or two sample summaries) can further calibrate style. Lower temperature (0–0.3) is preferred for factuality. Performance is typically measured by ROUGE or semantic-similarity metrics against reference summaries.

- **Q&A / Factual Question Answering:** Ask direct questions or commands. E.g.:  
  *“Who discovered penicillin? Explain briefly.”* or *“Answer in 2–3 sentences: What causes the seasons on Earth?”*  
  Always include the question context (if any) and specify answer length or style. Provide any necessary background in the prompt. For factual queries, use temperature=0 to minimize hallucination【21†L196-L202】. If the LLM is not designed as a Q&A engine, phrasing as a task (e.g. “Answer the user question:”) can help. Evaluate outputs with accuracy or F1 against known answers.

- **Reasoning / Multi-step Problems:** For complex reasoning, incorporate *chain-of-thought* or step-by-step instructions. For example:  
  *“Math word problem: [problem]. *Show your work step by step*, then give the answer.”*  
  Leading with “Let’s think step by step” or providing one worked example can dramatically improve correctness【3†L258-L266】【26†L61-L66】. Large models (GPT-4, PaLM) can leverage CoT to reach over 90% accuracy on math problems【3†L269-L272】【26†L61-L66】. However, CoT outputs are longer (more tokens) and slower. If efficiency is critical, one can instead use “intermediate chain-of-thought” with pruning or answer-first prompts, but at some accuracy cost. Evaluate using task metrics (e.g. math correctness).

- **Instruction-Following / General Tasks:** When giving complex tasks or dialogues, it’s best to craft prompts that a “smart assistant” can interpret. Use the system role to define the assistant’s persona (e.g. “You are a helpful tutor”) and the user role for the request【13†L1062-L1070】. If the model is instruction-tuned, clear single-turn instructions often suffice. Otherwise, few-shot examples of the conversation style can help. Always be as detailed as needed: define the format of the answer and any specific requirements in the prompt【31†L50-L57】【31†L87-L96】.

The table below summarizes prompt styles and trade-offs by task:

| **Task**             | **Prompt Style**                                      | **Trade-offs / Notes**                                                                       |
|----------------------|-------------------------------------------------------|----------------------------------------------------------------------------------------------|
| Creative Writing     | Open-ended narrative prompts with genre/style cues.    | + High creativity. – Use higher temp for variety. Must constrain length/format to avoid rambling. |
| Code Generation      | Detailed specs: function signature, I/O, conditions, examples【36†L528-L536】【31†L166-L172】. | + Correctness improves greatly; – More tokens and careful detail needed. Deterministic (temp=0). |
| Summarization        | Instruction + context + format (bullets/length)【31†L50-L57】【39†L219-L224】.  | + Structured answers; – Risk of truncation (set `max_tokens`). Use medium temperature if creative summary. |
| Q&A                  | Direct question with context, explicit answer length.  | + Clarity; – Can still hallucinate. Temp=0 for facts. Evaluate accuracy.   |
| Reasoning            | Chain-of-thought prompts (“step by step”)【3†L258-L266】【26†L61-L66】.     | + Accuracy on complex problems↑; – Token cost↑ and slower. May not help trivial Qs. |
| Instruction-Following| System-level instructions + clear user query format.   | + Ensures compliance with style; – Requires careful role use. Provide examples for rare tasks. |

## 2. Prompt Components and Formatting

Good prompts combine instructions, context, and constraints in a logical order. **Put the task instruction first**, then any context/input (often delimited by quotes or section markers)【31†L50-L57】. For example:

```
Instruction: Summarize the text below in 3 bullet points.
Text: """
[Your long article here]
"""
```

This structure (“Instruction: … Text: …”) helps the model parse the goal separately from the content【31†L50-L57】. When using Chat-style interfaces, follow these roles:

- **System/Developer role:** Use a system message or “developer” role to set overall instructions or persona (e.g. “You are a data science tutor”). Such high-level instructions are given higher priority by the model【13†L1062-L1070】. For example, using `instructions: "You are a helpful assistant."` or a developer-role message achieves this effect【13†L1066-L1070】.
- **User role:** Place the actual task request or examples here.
- **Assistant role (few-shot):** If giving demonstrations, format them as previous assistant messages. For few-shot in ChatGPT, you can interleave user/assistant pairs (Q->A examples) before the real query.

OpenAI’s documentation emphasizes separating instruction and context with markers (e.g. `"""` or `###`)【31†L50-L57】. This avoids confusion in the model’s input. Always **articulate output format** through examples or labeled templates【31†L87-L96】. E.g., to extract information:
```
Question: [Text here]
Desired format:
- Title: [Movie Title]
- Year: [Release Year]
```
The model will then follow the shown structure. Similarly, **precise constraints** improve control: say *“max 200 words”*, *“3 bullet points”*, or *“answer in Spanish”* explicitly【31†L133-L140】【39†L219-L224】.

### Few-Shot vs. Zero-Shot vs. Instruction-Tuning

- **Zero-Shot:** Give just the instruction (plus context). This is simplest but often less accurate. It works well for straightforward tasks or very capable models. If it fails, proceed to few-shot.
- **Few-Shot:** Include a few example input-output pairs in the prompt before asking the model to “complete” the task. Carefully chosen, diverse examples guide the model’s behavior【3†L241-L250】. However, few-shot uses more tokens (higher cost and latency) and prompts may hit context limits for long tasks【3†L241-L250】.
- **Instruction-Tuned Models:** Models like ChatGPT/GPT-4 are trained to follow instructions. With these, providing just a clear instruction (zero-shot) often works well. Nonetheless, some tasks still benefit from examples or step-by-step cues, depending on complexity. For completely reliable behavior, fine-tuning or tools like `GenerateAnything` can also be used【7†L185-L193】.

A practical workflow is: **Start zero-shot** with a well-crafted instruction; if results are unsatisfactory, add 2–5 relevant examples (few-shot)【31†L101-L109】. If still insufficient, consider fine-tuning (beyond the scope here).

### Chain-of-Thought vs. Conciseness

**Chain-of-Thought (CoT):** Instructing the model to show its reasoning steps dramatically improves performance on difficult reasoning problems【3†L258-L266】【26†L61-L66】. For example, adding “Let’s think step by step.” or giving an example of multi-step reasoning can boost math accuracy from ~80% to ~90% on benchmark problems【3†L269-L272】【26†L61-L66】. The trade-off is that CoT outputs are longer (more tokens, higher latency). Use CoT for critical reasoning tasks, especially with large models (GPT-4, PaLM). 

**Concise Answering:** If speed or brevity is more important (e.g. simple Q&A), instruct the model to give a short answer without rationale. This reduces token usage but may slightly lower accuracy on complex problems. Some research suggests that in very simple cases, non-CoT prompts can even outperform CoT (to avoid “overthinking” trivial questions), but generally CoT is best for hard tasks【26†L61-L66】.

## 3. Model and Decoding Settings

### Model Choice and Size

Use the **latest, most capable model** available for best results【7†L32-L35】. Larger models (GPT-4, GPT-4o, Llama-3) generally understand prompts better, perform more complex tasks, and are more robust to prompt phrasing than smaller ones【8†L1023-L1032】【21†L196-L202】. Smaller or open-source models (GPT-Neo, Vicuna, etc.) may require simpler or more detailed prompts to match performance. When possible, compare models on your task: pin a model version in production and monitor with evaluation prompts【13†L1045-L1054】.

### Decoding Parameters

- **Temperature:** Controls randomness. Higher temperature (0.7–1.0) yields more varied, creative outputs (useful for creative writing or brainstorming)【21†L196-L202】. Lower temperature (0–0.3) yields more deterministic, precise outputs (ideal for code, factual Q&A, summarization)【21†L196-L202】. It does *not* directly affect accuracy; use temp=0 to maximize factual consistency.
- **Top-k / Top-p:** Typically leave defaults (top-p=0.95) unless you need more diversity control. Lowering top-p (or k) can constrain output vocabulary for consistency.
- **Max Tokens / Stop Sequences:** Set a `max_tokens` limit if you want a hard cap (e.g. summary length), and use stop sequences (like special tokens or punctuation) to truncate output exactly. 
- **Prompt Length:** More context/examples improve performance up to a point, but very long prompts increase cost and risk exceeding token limits. Strive for brevity in examples (concise I/O pairs) and cut irrelevant details.

## 4. Empirical Results & Trade-offs

Several studies quantify prompt strategies:

- **Few-Shot Gains:** Providing 3–5 high-quality examples typically outperforms zero-shot on difficult tasks【3†L241-L250】, especially with large models. However, each example adds prompt tokens, which increases latency and cost. For instance, GPT-3’s few-shot prompts with examples can improve accuracy on QA benchmarks, but using 5 examples might raise the token count by thousands【3†L241-L250】.
- **Chain-of-Thought Gains:** The Wei *et al.* (2022) study shows CoT prompting can raise performance on math and commonsense tasks by 10–20 points (e.g. 90.2% vs ~17% on GSM8K)【3†L258-L266】【26†L61-L66】. But CoT answers may use 3–5× more tokens. Later work (Self-Consistency, Tree-of-Thoughts) further boosts accuracy but also multiplies inference cost by sampling multiple reasoning paths【3†L288-L297】【5†L660-L668】.
- **Prompt Optimization:** Recent research used automated loops to refine code prompts, discovering that adding details (pre/post-conditions, I/O specs) turned failing prompts into passing ones. The median improvement was large: e.g. one case study saw accuracy jump 8–50% when using optimized prompts【5†L720-L729】.
- **Model Variants:** Empirical tests by OpenAI indicate GPT-4 and reasoning-optimized models internally use CoT, while GPT-3.5 needs explicit CoT instructions for best results【8†L1023-L1032】【13†L1045-L1054】. In practice, GPT-4-based chat models often require simpler prompts and fewer examples than GPT-3.5 for the same task.
- **Decoding Effects:** Prompting studies confirm temperature=0 yields best factual accuracy, and moderate temperature (~0.7) is ideal for tasks where creative variation is beneficial【21†L196-L202】. Extremely high temperature can reduce coherence.

In summary, there is a **quality–cost tradeoff**: richer prompts (few-shot, CoT, detailed specs) increase output quality on hard tasks, but also increase token count and latency. Practitioners should benchmark different prompt variants on their specific task and measure metrics like answer accuracy vs. tokens used. For example, if two prompt variants yield 95% vs 93% accuracy but one uses half the tokens, the leaner prompt may be preferred in production.

## 5. Robustness and Adversarial Phrasing

Prompt phrasing can affect LLM behavior. Simple rewordings or trick instructions can cause biases or mistakes. As a robustness measure, consider:
- **Synonym Robustness:** Test paraphrased prompts to see if answers change. Small phrasing differences should not drastically alter factual answers.
- **Prompt Injection:** Sanitize any user-provided content in prompts to avoid malicious commands embedded in input. Always explicitly instruct the model to *ignore* out-of-band commands and to follow only the specified format【31†L142-L150】.
- **Batch vs Online:** If prompts are part of an application, use guardrails (rate limits, monitoring, finetuned filtering) to catch unexpected outputs. Metrics like “self-consistency” score can quantify answer confidence.

There is limited formal study of adversarial prompt robustness, but practitioners should assume that ambiguous phrasing can mislead the model. The best defense is clarity: state exactly what you want the model to do and not do, as in “describe X *without* mentioning Y” rather than just “do not mention Y”【31†L142-L150】. This “tell it what to do” strategy reduces misinterpretation.

## 6. Evaluation Methodology

To select and refine prompts, establish a consistent evaluation process:

1. **Test Benchmarks:** For your task, compile a representative set of test cases or examples. For each prompt variant, run the model (multiple times if randomness matters) and compute relevant metrics:
   - *Accuracy/F1* for classification or QA (compare to ground truth).
   - *ROUGE/BLEU* for summarization or translation (against reference).
   - *Exact Match/pass@k* for code tasks (test-generated code on unit tests).
   - *Human Ratings* (1–5) for subjective criteria like coherence, relevance, style, or creativity. If possible, have several reviewers.
2. **Cost & Latency:** Record the average token usage (prompt+response) and wall-clock inference time for each prompt style/model setting. Include these in your trade-off analysis.
3. **Behavioral Tests:** Check for consistency by slight prompt variations. Measure the variance in responses.
4. **Iterative Tuning:** Use automated tools (OpenAI’s Evals or similar frameworks) to log prompt vs output and track regressions when updating prompts or models【13†L1045-L1053】.
5. **Quantitative Metrics:** In addition to task metrics, consider perplexity (lower is generally better for fluency), as well as embed-based similarity (e.g. BERTScore) for open-ended text.

Citations for established metrics: BLEU/ROUGE are standard for text generation【46†L105-L114】; Code can use *pass@k* (proportion of generated samples passing tests). For open-ended tasks without gold answers (e.g. creative writing), use rubric-based or crowd-sourced scoring. Always fix a random seed or sample size for fair comparisons.

## 7. Prompt Templates and Examples

Here are **template prompts** for each task type, illustrating these principles:

- **Creative Writing:**  
  ```
  Write a [adjective] [genre] story about [topic], in the style of [author or tone]. 
  The story should be [length, e.g. 200 words] and include [specific elements if any].
  ```
  *Example:* “Write a short inspiring sci-fi story about first contact, in the style of Isaac Asimov. The story should be about 150 words long and end on a hopeful note.”

- **Code Generation:**  
  ```
  # Task: [describe function goal in plain language]
  # Language: Python
  # Constraints: [list requirements, e.g. no external libraries, efficient, etc.]
  # Input/Output: [specify data types/structures, edge cases]
  # Example: [if possible, show one input->output mapping or doctest]
  def [function_signature]:
      """
      [Detailed docstring with I/O explanation and conditions.]
      """
      ```
  *Example:* As given earlier for `convert_to_binary(n)`.

- **Summarization:**  
  ```
  Summarize the following [type of text, e.g. article] in [3–5] bullet points, focusing on [main aspects].
  Text: """
  [Paste or describe the content here]
  """
  ```
  *Example:* “Summarize the news article below in 5 concise bullet points, highlighting the cause and impact of the events.”

- **Q&A:**  
  ```
  [Any relevant context or user role statement]. 
  Question: “[Ask the question clearly].”
  Answer briefly (1–2 sentences).
  ```
  *Example:* “As a science teacher, answer the question: ‘What causes ocean tides?’ in no more than 2 sentences.”

- **Reasoning (CoT):**  
  ```
  Problem: [Describe the multi-step problem, e.g. math word problem].
  Explain your reasoning step by step, then give the final answer.
  ```
  *Example:* “Alice and Bob have 8 marbles altogether. Alice has 3 more than Bob. How many marbles does Alice have? Show work step by step, then answer.”

- **Instruction-Following:**  
  Use a system message like: “You are a [role/persona] that answers the user’s requests.” Then the user prompt:  
  ```
  [Clear instruction, e.g. “Please list…” or “Write an email to X that says Y.”]
  ```
  Always test that the model follows the role (e.g. formal tone, no personal opinions). 

Each template should be adjusted to the specific content. The key is: **make expectations explicit**. As OpenAI notes, “show and tell – models respond better when shown specific format requirements”【7†L74-L83】【31†L87-L96】.

## 8. Prompting Workflow (Diagram)

```mermaid
flowchart TD
  A[Define Task and Goals] --> B[Choose Model & Style]
  B --> C[Draft Prompt with Instructions/Constraints]
  C --> D[Add Examples or Role as Needed]
  D --> E[Set Parameters (temp, length, etc.)]
  E --> F[Generate Output from LLM]
  F --> G[Evaluate Output (metrics, tokens)]
  G --> H{Satisfactory?}
  H -- No --> C
  H -- Yes --> I[Deployment/Use]
```

This flowchart illustrates the iterative process: define what you want, craft the prompt (with roles, examples, constraints), run the model, evaluate the results, and refine the prompt as needed.

## 9. Evaluation Checklist

- [ ] **Task Definition:** Have I clearly defined the task in the prompt (what to do, format, style)?
- [ ] **Prompt Role:** Did I use a system role or instruction to set context/persona if needed【13†L1062-L1070】?
- [ ] **Clarity:** Are the instructions specific and unambiguous (avoid vague terms like “not too much”)【31†L133-L140】?
- [ ] **Format Examples:** Have I shown the desired output format or given examples for it【31†L87-L96】【39†L202-L210】?
- [ ] **Appropriate Complexity:** If the task is complex, should I break it into sub-steps or use chain-of-thought【3†L258-L266】?
- [ ] **Shot Type:** Did I try zero-shot first, then add few-shot examples if needed【31†L101-L109】?
- [ ] **Model & Params:** Am I using the right model size? Is the temperature set appropriately (low for facts, higher for creativity)【21†L196-L202】?
- [ ] **Constraints:** Have I explicitly stated output constraints (length, format, content rules)【31†L133-L140】【39†L219-L224】?
- [ ] **Evaluation Plan:** Do I have metrics or criteria to judge the output (quality, cost, latency)? 
- [ ] **Robustness Check:** Have I rephrased the prompt slightly to test stability? Are there risks of misinterpretation?
- [ ] **Human-Friendly:** Is the prompt understandable by a human (clear grammar, no contradictions)?
- [ ] **Iteration:** Did I refine the prompt after inspecting initial outputs?

Following this checklist ensures a thorough prompt design and evaluation process.

**Sources:** We synthesize recent research and official guidance, including OpenAI’s prompt engineering best practices【31†L50-L57】【21†L196-L202】, academic surveys【3†L241-L250】【3†L258-L266】, and specific studies on code-generation prompting【36†L528-L536】【37†L624-L632】. These works collectively inform the recommendations above.