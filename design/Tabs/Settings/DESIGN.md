# Design System Specification: The Cognitive Workspace

## 1. Overview & Creative North Star
**Creative North Star: "The Silent Orchestrator"**

This design system moves beyond the "chat bubble" cliché of typical AI interfaces. Instead, it adopts the persona of a high-end editorial workspace—think of a digital architect’s drafting table or a premium physical notebook. The goal is "Atmospheric Clarity." 

By leveraging intentional asymmetry, high-contrast typography scales, and a departure from traditional "boxed-in" UI, we create a sense of infinite cognitive space. We break the "template" look by using depth and tonal shifts rather than rigid lines, ensuring the user's focus remains entirely on the prompt engineering and AI output.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep obsidian tones, designed to reduce ocular strain during long-form research and iteration.

### The Surface Hierarchy (Nesting)
We reject the flat grid. Hierarchy is achieved through **Tonal Layering**. Imagine sheets of dark, polished basalt stacked upon one another.
*   **Base Layer:** `surface` (#101419) – The "tabletop."
*   **Secondary Content:** `surface_container_low` (#181c21) – Large structural sections.
*   **Primary Interaction/Cards:** `surface_container` (#1c2025) – The active workspace.
*   **Elevated Details:** `surface_container_high` (#262a30) – Popovers and active selection states.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders (`outline`) to define sections. Sectioning must be achieved through background shifts. A card should sit on the background because it is a different shade (`surface_container` on `surface`), not because it has a stroke.

### The "Glass & Gradient" Rule
To add a "signature" feel, floating elements (modals, command bars) must use glassmorphism: 
*   **Fill:** `surface_container_highest` (#31353b) at 80% opacity.
*   **Effect:** `backdrop-blur: 24px`.
*   **Accent:** Use a subtle linear gradient from `primary` (#adc6ff) to `primary_container` (#4d8eff) at 10% opacity for "active" work areas to give them a soft, inner glow.

---

## 3. Typography
We utilize a dual-font strategy to balance editorial authority with technical precision.

*   **Display & Headlines (Manrope):** Chosen for its geometric purity. Use `display-lg` (3.5rem) with negative letter-spacing (-0.02em) for hero moments. This creates an "Editorial Tech" feel.
*   **Body & Labels (Inter):** Chosen for maximum legibility at small sizes. 
*   **The Hierarchy Role:** 
    *   **Headlines:** Use `headline-sm` (1.5rem) for section titles to command attention without being bulky.
    *   **Body:** `body-md` (0.875rem) is the workhorse. Increase line-height to 1.6 for AI-generated text to improve readability.
    *   **Labels:** Use `label-sm` (0.6875rem) in `all-caps` with +0.05em tracking for metadata or "AI Status" indicators.

---

## 4. Elevation & Depth
Depth in this system is an "Atmospheric" property, not a structural one.

*   **The Layering Principle:** Place `surface_container_lowest` elements on `surface_container_low` regions to create "recessed" inputs. This mimics a physical carving in the UI.
*   **Ambient Shadows:** For floating menus, use a 48px blur with 6% opacity. The color should be `surface_container_lowest` (#0a0e13), creating a natural "lift" rather than a dirty grey smudge.
*   **The Ghost Border Fallback:** If a divider is strictly necessary for accessibility, use the `outline_variant` (#424754) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** High-contrast `primary` (#adc6ff) background with `on_primary` (#002e6a) text. Use `rounded-xl` (1.5rem) for a friendly, modern feel.
*   **Secondary (The "Textured" Button):** Use `secondary_container` (#304671) with no border. On hover, increase the brightness by 5%.
*   **Tertiary:** Ghost style. No background, only `primary` text. Use for low-emphasis actions.

### Input Fields (The Workspace Core)
*   **Default State:** `surface_container_low` background, no border.
*   **Active/Focus:** A "glow" effect rather than a thick border. Use a 2px outer shadow of `primary` at 20% opacity.
*   **Prompt Area:** Use `body-lg` for the actual input text to make the user feel their input is "headline-worthy."

### Chips & Tags
*   **Aesthetics:** Use `surface_container_highest` with `label-md` text. For AI-generated tags, use a subtle `tertiary_container` (#df7412) tint to distinguish human vs. machine data.

### Cards & Lists
*   **Constraint:** Zero dividers. 
*   **Execution:** Use `spacing-8` (2rem) of vertical white space to separate list items. For cards, use `rounded-xl` (1.5rem) and a background shift to `surface_container`.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts. For example, a wide primary prompt area with a significantly narrower, "recessed" sidebar.
*   **Do** use `surface_bright` (#36393f) sparingly for hover states on dark components to create a "shimmer" effect.
*   **Do** prioritize "Breathing Room." Use the `spacing-12` and `spacing-16` tokens generously between disparate functional groups.

### Don't:
*   **Don't** use 100% white text for body copy. Always use `on_surface_variant` (#c2c6d6) to keep the experience sophisticated and "soft" on the eyes.
*   **Don't** use "Drop Shadows" on cards that sit on the main background. Use background color shifts instead.
*   **Don't** use standard 4px or 8px corners. This system is defined by the `xl` (1.5rem) radius for a signature, fluid aesthetic.