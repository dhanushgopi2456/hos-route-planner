# Design System Reference: United Carriers

Source: https://unitedcarriers.com/?ref=lapaninja
Page: United Carriers | Global Freight Forwarding and Logistics
Adopted for: HOS Route Planner & ELD Log Generator

## 1. Color Palette

Role / Token | CSS Variable | Value | Notes
--- | --- | --- | ---
Brand Primary | `--_color---brand`, `--_color---primary` | `#0016cb` / `rgb(0, 22, 203)` | Electric Cobalt Brand Blue
Brand Accent / Secondary | `--_color---secondary` | `#ff5500` / `#fd6020` / `#f50` | High-contrast Orange / Amber Accent
Background Deep | `--_color---bg--deep` | `#06080E` | Deep Obsidian Base
Background Surface 1 | `--_color---bg--sf-1` | `#0B0F19` | Elevated Card Surface (90% dark)
Background Surface 2 | `--_color---bg--sf-2` | `#111111` | Jet Black Component Fill
Content Main / Light | `--_color---m-white` | `#ffffff` | Primary text and white headlines
Content Sub / Soft | `--_color---content--soft` | `rgba(255, 255, 255, 0.72)` | Secondary descriptive text
Content Note / Muted | `--_color---content--note` | `rgba(255, 255, 255, 0.40)` | Micro labels, metadata, captions
Border Main | `--_color---border--main` | `rgba(255, 255, 255, 0.12)` | Glass card boundaries
Border Highlight | `--_color---border--highlight` | `#0016cb` | Electric Blue Active Border
Glow Accent | `--_color---glow--brand` | `rgba(0, 22, 203, 0.45)` | Radial blur highlights

## 2. Typography Ramps

Role | Font Family | Size | Weight | Line Height | Transform & Tracking
--- | --- | --- | --- | --- | ---
Display Hero | "BT Steinhart", "Space Grotesk", sans-serif | 64px - 85px | 700-800 | 1.05 | UPPERCASE, -0.03em
Section Heading | "BT Steinhart", "Space Grotesk", sans-serif | 48px - 64px | 700 | 1.10 | UPPERCASE, -0.02em
Subheading | "BT Steinhart", "Space Grotesk", sans-serif | 18px - 22px | 700 | 1.20 | UPPERCASE, 0.05em
Body Lead | "Helvetica Neue", "Plus Jakarta Sans", sans-serif | 18px - 24px | 500 | 1.45 | Normal, 0em
Body UI | "Helvetica Neue", "Plus Jakarta Sans", sans-serif | 14px - 16px | 400-500 | 1.50 | Normal, 0em
Micro Mono / Badge | "BT Steinhart Mono", "JetBrains Mono", monospace | 9px - 11px | 500 | 1.30 | UPPERCASE, 0.10em
Button CTA | "Helvetica Neue", "Space Grotesk", sans-serif | 13px - 15px | 600-700 | 1.25 | UPPERCASE / Semi-bold

## 3. Motion & Animation Tokens

Property | Value | Notes
--- | --- | ---
Primary Duration | `0.4s` | Element entrances, tab switches, hover states
Fast Duration | `0.3s` | Button micro-interactions, badge transitions
Ambient Duration | `3.0s` | Continuous highway glow, waypoint pulsing
Primary Easing | `cubic-bezier(0.445, 0.05, 0.55, 0.95)` | Signature United Carriers fluid ease
Secondary Easing | `cubic-bezier(0.16, 1, 0.3, 1)` | Out-quint spring snap
Keyframes | `marquee`, `spin-wheel`, `world-wide-dot`, `wave`, `in-icon`, `out-icon` | Real-time SVG & corridor motion

## 4. Layout Architecture & Gaps

Token | Value | Usage
--- | --- | ---
Max Container Width | `100vw` (capped at `1440px` / `1520px`) | Architectural container
Column Count | `16` | Grid system
Column Gap | `2rem` (`32px`) | Desktop layout spacing
Container Padding | `4rem` (`64px`) desktop, `1.5rem` (`24px`) mobile | Outer gutters
Border Size | `max(1px, 0.1rem)` | Subtle hairline glass borders
Corner Radius | `16px` to `24px` for cards, `9999px` for pills | Modern engineered curves
