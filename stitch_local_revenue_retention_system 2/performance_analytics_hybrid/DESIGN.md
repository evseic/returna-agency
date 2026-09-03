---
name: Performance Analytics Hybrid
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002020'
  on-tertiary-container: '#5b8c8c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#b8eceb'
  tertiary-fixed-dim: '#9dd0cf'
  on-tertiary-fixed: '#002020'
  on-tertiary-fixed-variant: '#194e4e'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  deep-navy: '#0F172A'
  emerald-growth: '#10B981'
  data-muted: '#80A1BA'
  data-soft: '#A9C5DA'
  border-subtle: '#E2E8F0'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  mono-metric:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is engineered for a high-performance SaaS and marketing agency hybrid. The brand personality is rooted in **analytical rigor, ROI-centricity, and authoritative clarity**. It targets enterprise decision-makers and growth marketers who value data transparency over aesthetic fluff.

The design style follows a **Corporate / Modern** aesthetic with **Minimalist** influences. It prioritizes information density and clarity, utilizing a dashboard-inspired interface that feels like a precision tool. The UI evokes an emotional response of security and momentum—reassuring users through stable, deep tones while signaling progress through vibrant growth-oriented accents. There is a deliberate avoidance of decorative imagery, replaced instead by functional data visualizations and structured information architecture.

## Colors

The palette is anchored by **Deep Navy (#0F172A)**, used for primary surfaces, text, and navigation to establish immediate trust and professionalism. **Emerald Green (#10B981)** is used surgically as a "Growth Accent" to highlight positive ROI, revenue metrics, and primary calls to action.

Neutrals are biased toward a cool, clean spectrum. The background uses a very light gray (`#F8FAFC`) to reduce eye strain during long analytical sessions, while borders and dividers utilize a crisp `#E2E8F0` to maintain a structured, grid-like feel. Named colors from the reference guide (`#80A1BA`, `#A9C5DA`) are reserved for data visualization—such as secondary chart lines or inactive progress bars—to ensure the interface feels cohesive and data-rich without overwhelming the primary action color.

## Typography

The typography strategy employs a technical/performance pairing. **Space Grotesk** is used for headlines and large metrics; its geometric, slightly wider stance suggests a futuristic and precise engineering quality. **Inter** is the workhorse for body copy and UI labels, chosen for its exceptional legibility in data-heavy environments.

Metric displays (ROI percentages, currency) should use the `mono-metric` style to ensure numbers align vertically in tables and dashboard blocks. Labels are frequently set in `label-bold` with slight tracking (letter spacing) to differentiate them from interactive body text.

## Layout & Spacing

The layout is built on a **fixed-width container** for desktop (`1280px`) to ensure charts and data tables maintain an optimal reading length. On mobile, it transitions to a fluid single-column layout.

A strict **8pt grid system** (defined by a `4px` base unit) governs all spacing. Metric blocks and "cards" should use a consistent `24px` internal padding (gutter) to maintain a high-fidelity dashboard feel. Elements are grouped in logical "metric clusters" using `stack-sm` for related data points and `stack-lg` to separate distinct sections of the analysis.

## Elevation & Depth

This design system avoids heavy shadows, instead using **tonal layers** and **low-contrast outlines** to create hierarchy. 

The primary canvas is `#F8FAFC`. Information blocks (cards) use a white background (`#FFFFFF`) with a 1px border in `#E2E8F0`. Depth is conveyed through subtle state changes:
- **Default State:** Flat, 1px border.
- **Hover/Active State:** A very soft, diffused ambient shadow (Color: `Deep Navy`, Opacity: 4%, Blur: 12px) and a slightly darker border.
- **Dashboard Layers:** Sidebars and utility bars use a subtle tonal shift to `#F1F5F9` to distinguish navigation from the main workspace.

## Shapes

The shape language is "Sharp-Soft." To maintain an authoritative and analytical tone, the system uses a **Soft (0.25rem)** roundedness for standard elements like buttons and input fields. 

Larger containers and dashboard cards utilize `rounded-lg` (0.5rem) to keep the interface from feeling too aggressive or "industrial." These small radii are sufficient to feel modern without losing the "grid-aligned" precision required for a performance-focused product.

## Components

### Buttons
- **Primary:** Deep Navy background with White text. Sharp-soft corners. For growth-critical actions, use Emerald Green.
- **Secondary:** White background with a 1px border of Deep Navy.
- **Tertiary/Ghost:** Transparent background with Navy text, used for low-priority navigation.

### Metric Blocks (Cards)
The core component. These must have a white background, a subtle border, and a "Trend Indicator" slot in the top right. Emerald Green is used for positive trends, while a muted red (derived from brand tones) is used for negative trends.

### Input Fields
Strictly rectangular with 4px corner radius. Use `#E2E8F0` for borders. Focus states should use a 2px Emerald Green border to signal "Active Growth" mode.

### Chips & Badges
Small, high-contrast labels used for status (e.g., "Active," "Optimizing"). These should use a semi-transparent version of the named colors (e.g., Emerald Green at 10% opacity) with full-opacity text.

### Data Visualization
Charts should prioritize clean lines. Use the `named_colors` (Data Muted, Data Soft) for multi-series charts, always ensuring the "Current/Primary" metric is highlighted in either Deep Navy or Emerald Green.