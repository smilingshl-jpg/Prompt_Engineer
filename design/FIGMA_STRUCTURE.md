# Figma Links
https://www.figma.com/make/7Q4H9xQTakRNfErWZZr9xr/Follow-File-Instructions?t=cNJjqeYKTKpMHDep-1

# PromptStudio - Project Structure & Design

## Overview
PromptStudio is a modern AI prompt optimization workspace designed with a clean, professional interface inspired by ChatGPT, NotebookLM, and Vercel's design aesthetics.

## Layout Structure

### 3-Panel Layout
The application uses a three-panel horizontal layout with fixed proportions:

```
┌────────────┬──────────────────────────────┬────────────┐
│            │                              │            │
│   Left     │         Center               │   Right    │
│  Sidebar   │         Panel                │  Sidebar   │
│   (20%)    │         (60%)                │   (20%)    │
│            │                              │            │
└────────────┴──────────────────────────────┴────────────┘
```

## Design System

### Color Palette
- **Background**: `#0B0F14` - Deep dark blue-gray
- **Card Background**: `#11161D` - Slightly lighter dark surface
- **Borders**: `#1F2937` - Subtle gray borders
- **Text Primary**: White
- **Text Secondary**: Gray-400
- **Accent**: Blue-500 for interactive elements

### Typography
- Clean, modern sans-serif fonts
- Hierarchy: h3 headers, body text, labels
- Good contrast for readability on dark backgrounds

### UI Components
- Rounded corners (`rounded-xl`) for modern feel
- Smooth transitions and hover states
- Consistent spacing and padding
- Dark theme throughout

## Panel Breakdown

### Left Sidebar (20%)
**Purpose**: Navigation and chat history

**Components**:
- New Chat button (prominent, blue accent)
- Search bar for filtering chats
- Chat history list with:
  - Individual chat items
  - Timestamps
  - Hover effects
  - Active state indicators

**File**: `/src/app/components/LeftSidebar.tsx`

### Center Panel (60%)
**Purpose**: Main interaction area

**Components**:
1. **Conversation Area**:
   - User messages
   - AI response blocks
   - Quiz cards with emoji icons
   - Prompt analysis sections
   - Structure breakdowns

2. **Prompt Input** (bottom):
   - Large text area for prompt entry
   - Send button
   - Smooth animations
   - Focus states

**Key Files**:
- `/src/app/components/CenterPanel.tsx`
- `/src/app/components/PromptInput.tsx`
- `/src/app/components/QuizCard.tsx`

### Right Sidebar (20%)
**Purpose**: Settings and optimization controls

**Components**:
1. **Optimization Settings**:
   - Optimization Depth dropdown
   - Reasoning Level dropdown
   - Toggle switches for verification and structure

2. **Prompt Parameters**:
   - Audience selector (with emojis)
   - Format options
   - Detail level
   - Tone selection

3. **Preferences**:
   - Toggle switches for various options

**File**: `/src/app/components/RightSidebar.tsx`

## Key Features

### Interactive Quiz Cards
- 2x2 grid layout
- Emoji icons for each option
- Hover effects
- Click interactions
- Clean, card-based design

### Prompt Analysis Blocks
- Structured information display
- Clear visual hierarchy
- Easy-to-read formatting
- Color-coded sections

### Responsive Interactions
- Smooth transitions
- Hover states
- Active states
- Focus indicators

## Component Architecture

```
App.tsx (Main container with dark theme)
├── LeftSidebar.tsx
│   └── UI components (Button, Input)
├── CenterPanel.tsx
│   ├── PromptInput.tsx
│   │   └── UI components (Button, Textarea)
│   └── QuizCard.tsx
│       └── UI components (Card)
└── RightSidebar.tsx
    └── UI components (Select, Switch, Label)
```

## UI Component Library

All UI components are in `/src/app/components/ui/`:
- `button.tsx` - Styled button component
- `input.tsx` - Styled input fields
- `card.tsx` - Card containers
- `select.tsx` - Dropdown selects
- `switch.tsx` - Toggle switches
- `label.tsx` - Form labels
- `textarea.tsx` - Large text inputs
- `separator.tsx` - Visual dividers

## Design Principles

1. **Dark Theme First**: Optimized for long coding/writing sessions
2. **Clarity**: Clean hierarchy and spacing
3. **Consistency**: Unified color scheme and component styles
4. **Interactivity**: Smooth animations and clear feedback
5. **Focus**: Distraction-free workspace design
6. **Modern**: Contemporary AI tool aesthetics

## Technologies

- **React** - Component framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **Lucide React** - Icon library
- **Vite** - Build tool

## File Structure

```
/src
├── /app
│   ├── App.tsx                    # Main application
│   └── /components
│       ├── LeftSidebar.tsx        # Left panel
│       ├── CenterPanel.tsx        # Center panel
│       ├── RightSidebar.tsx       # Right panel
│       ├── PromptInput.tsx        # Prompt input area
│       ├── QuizCard.tsx           # Interactive quiz cards
│       └── /ui                    # Reusable UI components
│           ├── button.tsx
│           ├── input.tsx
│           ├── card.tsx
│           ├── select.tsx
│           ├── switch.tsx
│           ├── label.tsx
│           ├── textarea.tsx
│           └── separator.tsx
└── /styles
    ├── theme.css                  # Theme tokens
    └── fonts.css                  # Font imports
```

## Future Enhancements

- Multi-page routing for different workspaces
- Backend integration for saving prompts
- Real AI integration
- Export/import functionality
- Collaborative features
- Prompt templates library

## Interaction Rules

Application behavior rules:

No page navigation.
Everything happens in one workspace.

Questions appear inline in chat.

Answered quiz cards collapse but remain visible.

Parameter changes do not auto rerun optimization.
User must click re-optimize.

Prompt output always appears below quiz flow.

Copy button copies raw optimized prompt.

Re-optimize uses stored answers.

Animations must be fast (150–250ms).

No blocking loading screens.
Use skeleton states instead.

## Application State Flow

State 1:
Empty workspace.

State 2:
User enters prompt.

State 3:
AI analyzes prompt.

State 4:
Quiz generation.

State 5:
User answering questions.

State 6:
Optimization running.

State 7:
Optimized prompt displayed.

State 8:
User adjusts parameters.

State 9:
Reoptimization possible.

## MVP Scope Definition

MVP must include ONLY:

Prompt input.
Quiz generation.
Parameter sidebar.
Prompt optimization output.
Chat history.
Copy optimized prompt.

Do NOT build:

Authentication.
Multi user.
Teams.
Payments.
Model switching.
Analytics.
Templates.
Sharing.
Export systems.

Focus only on core workflow.