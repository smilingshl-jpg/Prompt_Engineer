# PromptStudio Wireframe Specification

## Layout Structure

Application uses a 3 panel workspace layout.

Left panel:
Chat history navigation.

Center panel:
Active prompt optimization workspace.

Right panel:
Optimization controls and parameters.

## Left Sidebar

Purpose:
Navigation between prompt sessions.

Components:

New Chat Button
Search Chats Input
Chat History List
Collapse Sidebar Button

Chat Item Structure:

Icon
Chat title
Last modified time

Behavior:

Click loads chat.
Hover shows highlight.
Chats auto named by AI.

## Center Workspace

Purpose:
Main prompt optimization workflow.

Components:

Prompt Input Box
AI Analysis Block
Quiz Question Card
Answer Selection Buttons
Prompt Structure Display
Optimized Prompt Display
Copy Button

Workflow:

User enters prompt.

AI analyzes prompt.

System detects missing information.

Adaptive quiz generated.

Questions appear inline.

User selects answers.

Answered questions collapse.

Prompt structure builds live.

Multipass optimization runs.

Final optimized prompt displayed.

## Quiz Card Component

Structure:

Question title.
Answer buttons.
Small explanation text.

Answer Button Structure:

Icon
Label (1-2 words)
Soft colored background

Behavior:

Click answer triggers next question.

Questions adapt to prompt type.

Max questions: 8
Min questions: 1

Answered questions collapse but remain visible.

## Prompt Structure Block

Displays:

Goal
Audience
Output format
Constraints
Quality level
Verification rules

Updates live as questions answered.

## Optimized Prompt Block

Displays:

Final optimized prompt text.

Buttons:

Copy prompt button.

Re-optimize button.

## Right Optimization Panel

Purpose:
Allow parameter editing and deep optimization control.

Sections:

Optimization Settings:

Optimization depth selector.
Reasoning level selector.
Verification toggle.

Prompt Parameters:

Audience selector.
Format selector.
Detail level selector.
Tone selector.

Preferences:

Always structured toggle.
Always include examples toggle.
Always verify toggle.

Behavior:

Changing parameters allows reoptimization.

Parameters persist for session.

## Interaction Rules

Questions appear instantly.

Transitions should be fast.

UI must always show:

History
Current prompt
Optimization controls

No modal dialogs.

No page switching.

Everything in one workspace.

## State Flow

State 1:
No prompt entered.

State 2:
Prompt entered.

State 3:
Quiz active.

State 4:
Optimization running.

State 5:
Output displayed.

## MVP Components

Prompt input.
Quiz system.
Parameter panel.
Optimized prompt output.
Chat history.

## Non MVP

Workflow expansion.
Prompt comparison.
Multi model routing.
Monetization.
Team features.
