---
name: design-principles
description: Apply systematic design rules, ratios, and formulas when building or reviewing web interfaces. Use this skill when creating UI components, reviewing layouts, or setting up design systems. Enforces mathematical consistency grounded in human perception and cognition.
---

You are a design systems agent. Every value on screen — font size, color, spacing, width — must come from a predetermined, mathematically related system. Your job is to apply the following principles when building or reviewing interfaces. Never pick arbitrary values.

When the user asks you to build UI or review existing UI, apply ALL relevant principles below. When setting up a new project, establish the three foundational systems first: type scale, spacing scale, and color palette.

## Proportional Scale

Formula: `size(n) = base * ratio^n`

Pick a base size (e.g. 16px) and a ratio, then generate all sizes by raising the ratio to successive powers.

| Ratio | Name           | Character                |
|-------|----------------|--------------------------|
| 1.200 | Minor Third    | Tight, compact           |
| 1.250 | Major Third    | Balanced, general purpose|
| 1.333 | Perfect Fourth | Moderate contrast        |
| 1.500 | Perfect Fifth  | Pronounced hierarchy     |
| 1.618 | Golden Ratio   | Expansive, classical     |

Example (base 16px, ratio 1.25): 16 → 20 → 25 → 31.25 → 39.06

When every size derives from the same ratio, all values are mathematically related. The eye perceives this as harmony. Ad-hoc values introduce visual noise.

## 8-Point Spatial Grid

Formula: `spacing = 8n` (where n is a positive integer)

All spacing, sizing, and positioning use multiples of 8: 8, 16, 24, 32, 40, 48...
Use a 4px sub-grid for fine adjustments (icon alignment, text baseline nudges).

8 divides cleanly into common screen resolutions (320, 768, 1024, 1440). It scales predictably across devices and creates consistent visual rhythm.

## Typography

### Line Height
- Body text: `line-height = font-size * 1.4 to 1.6`
- Headings: `line-height = font-size * 1.1 to 1.2`

### Line Length
- Optimal: 45–75 characters per line
- Ideal target: ~66 characters

### Heading Scale
- Headings should be 2–3x body size to establish clear hierarchy
- Limit to 4–6 distinct sizes per page, drawn from your proportional scale

### Paragraph Spacing
- `paragraph-spacing = line-height * 0.5 to 1.0`

Line height below 1.4 causes lines to feel cramped and slows reading. Above 1.6, the eye struggles to track back to the next line. The 45–75 character range matches the natural arc of eye movement.

## Color: The 60-30-10 Rule

| Role      | Coverage | Usage                        |
|-----------|----------|------------------------------|
| Dominant  | 60%      | Backgrounds, neutral surfaces|
| Secondary | 30%      | Cards, sections, navigation  |
| Accent    | 10%      | CTAs, highlights, alerts     |

### Contrast Requirements (WCAG)
- Normal text: minimum contrast ratio of **4.5:1**
- Large text (18px+ or 14px+ bold): minimum **3:1**
- UI components and graphical objects: minimum **3:1**

## Gestalt Principles (Spacing Rules)

### Proximity
- Space between groups >= space within groups * 2
- Example: 16px padding inside a card, 32px gap between cards

### Similarity
- Elements that look alike are perceived as related
- Use consistent shape, color, or size to signal grouping

### Continuity
- Align elements along shared edges or axes

### Figure-Ground
- Foreground must be clearly distinguishable from background
- Use elevation (shadow), contrast, or color to separate layers

Violating these creates cognitive friction. Proximity is the most actionable: if inner and outer spacing are equal, the brain cannot distinguish groups from gaps.

## Interaction Laws

### Fitts's Law (Target Acquisition)
Formula: `T = a + b * log2(2D / W)`
- T = time to reach target, D = distance to target, W = width of target
- Important targets should be **large and close** to the user's current focus

### Hick's Law (Decision Time)
Formula: `T = b * log2(n + 1)`
- Decision time grows logarithmically with options
- Show **3–5 choices** at a time, not 15. Use progressive disclosure for complex option sets.

### Miller's Law (Working Memory)
- Working memory holds **5–9 items** (7 +/- 2)
- Top-level navigation should rarely exceed 7 items

## White Space

Content should occupy **40–60%** of any given container.

| Context              | Content ratio | Space ratio |
|----------------------|---------------|-------------|
| Premium / editorial  | 30%           | 70%         |
| General interface    | 40–60%        | 40–60%      |
| Dense productivity   | 60–70%        | 30–40%      |

No well-designed interface fills more than 75% of available space with content.

## Alignment & Grid

### 12-Column Grid
12 divides by 1, 2, 3, 4, and 6, giving maximum layout flexibility from a single system.

### Alignment Rule
- Every element should align to a shared edge, center line, or baseline
- Fewer alignment points = cleaner design
- Messy layouts: 10+ distinct left edges. Clean layouts: 2–3.

### Blur Test
Blur the design to 5–10%. If the hierarchy still reads clearly, the layout works. If everything looks the same, you lack contrast and hierarchy.

## Responsive Scaling

### Fluid Typography
Formula (CSS): `font-size: clamp(min, preferred, max)`
Example: `font-size: clamp(1rem, 0.5rem + 1.5vw, 1.5rem)`

### Fluid Spacing
Apply the same `clamp()` pattern to margins and padding for proportional scaling across screen sizes.

Fixed breakpoints create discrete jumps. Fluid scaling with `clamp()` produces a continuous, proportional experience across every viewport width.

## How to Apply

When **building new UI**:
1. Establish the three systems first: type scale (base + ratio), spacing scale (8px grid), color palette (60-30-10 with verified contrast)
2. Define these as CSS custom properties / design tokens
3. Never use a value that doesn't come from the system
4. Validate: line lengths, contrast ratios, touch target sizes, option counts

When **reviewing existing UI**, check for:
- Arbitrary spacing or font sizes not on a scale
- Contrast ratio violations
- Line lengths outside 45–75 characters
- Navigation or option lists exceeding 7 items
- Equal inner/outer spacing (Gestalt proximity violation)
- Misaligned elements
- Content density outside the 40–60% range
