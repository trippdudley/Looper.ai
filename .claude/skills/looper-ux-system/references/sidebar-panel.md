# Sidebar Panel & Layout Reference

Reference file for looper-ux-system. Loaded on demand when building sidebar UI or comparing portal vs sidebar layouts.

## Companion Panel Pattern (Sidebar Shell)

The Looper sidebar uses a floating companion panel treatment when docked alongside a host application (TrackMan Performance Studio). This follows the same visual pattern as Claude's sidebar in Chrome — distinct but integrated.

### Visual Treatment

```js
// Sidebar outermost container
{
  width: 'var(--sidebar-w)',     // CSS variable, default 450px, tunable 420-480px
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  background: CD.bg,             // #0C1117

  // The shell — bold visible border + rounded corners
  border: '2px solid #3A4856',   // Bold gray border — clearly visible, not subtle
  borderRadius: '16px',          // Rounded on ALL four corners
  margin: '8px 8px 8px 4px',    // Gap from viewport edges and host app
  boxShadow: '0 2px 16px rgba(0,0,0,0.4)',  // Soft depth shadow
  overflow: 'hidden',            // Clips content to rounded corners
}
```

### Rules

1. **The border must be bold and visible.** `2px solid #3A4856`. Not a subtle 1px hairline. The gray frame wrapping the entire sidebar is the primary visual signal that this is a separate, contained panel.

2. **Rounded corners on ALL four sides.** `borderRadius: 16px`. The panel reads as a rounded rectangle floating next to the host app. No squared-off edges.

3. **Margin creates separation.** 8px gap between the sidebar and the viewport edges. The parent container's dark background (`#060A0F` dock rail) shows through.

4. **Host app goes edge-to-edge.** The TPS panel (or any host app) has NO margin, NO border-radius, NO rounding. It fills to the viewport edges. Only the Looper sidebar floats. This contrast makes the sidebar feel like a companion tool.

5. **Internal content respects the shell.** The sidebar's top bar uses `borderRadius: '16px 16px 0 0'` to match the parent's top corners. The chat input area uses `borderRadius: '0 0 16px 16px'` to match the bottom corners. `overflow: hidden` on the parent clips all content.

### Parent Container (Dock Rail)

```js
// The flex container holding both TPS and sidebar
{
  display: 'flex',
  width: '100%',
  height: 'calc(100vh - 40px)',  // Minus demo nav bar
  background: '#060A0F',          // Dock rail — darkest, shows through gaps
}
```

### When to Use

* Any surface where Looper's sidebar sits alongside another application
* The lesson sidebar alongside TPS
* Future: Looper alongside any third-party tool (Foresight, video analysis apps)
* Do NOT use for standalone Looper surfaces (Coach Portal, Player Portal)

## Portal vs Sidebar Layout Specs

### Coach Portal (Full-Width, Light Mode)

* Max width: 1400px centered with `margin: 0 auto`
* Left sidebar navigation: 240px expanded, 48px collapsed (icons only)
* Dashboard grid: 3-4 columns of metric cards
* Standard spacing: 8-12px gaps between cards, 12-16px section padding
* Page padding: 16-20px
* Light mode default (bg `#F6F7F9`, cards `#FFFFFF`)

### Lesson Sidebar (Fixed-Width, Dark Mode, Floating)

* Width: CSS variable `--sidebar-w: 450px` (tunable 420-480px)
* Companion panel shell (see above)
* Dark mode default (bg `#0C1117`, surface `#151D28`)
* ALL content stacks vertically — no horizontal card layouts
* Ultra-compact spacing: 8px gaps, 10px internal padding
* Font sizes: body 13px DM Sans, data 14-16px Space Mono, phase headers 10px Space Mono uppercase
* Max 2 data points per row in cards
* Insight cards: 1-2 sentences max, expand on tap
* Charts: sidebar-width-compatible variants only (sparklines, compact bars, vertical stacking)

### Player Portal (Mobile-First, Light Mode)

* Width: 480px max, mobile-first responsive
* Bottom tab navigation: Dashboard, Practice, Rounds, My Journey
* Light mode default
* "Ask Looper" floating chat button (bottom-right)

## Typography by Surface

| Surface | Body Size | Data Size | Heading Size |
|---|---|---|---|
| Coach Portal | 14px | 22px hero, 14px inline | 18-24px |
| Lesson Sidebar | 13px | 14-16px | 14px |
| Player Portal | 14px | 16px | 18px |
| TPS Wireframe (Helvetica/Arial) | N/A | 32px hero, 10px units | 13px |
