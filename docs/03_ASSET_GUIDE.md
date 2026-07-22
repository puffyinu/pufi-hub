# PUFI HUB Asset Guide

## Overview

The PUFI HUB Asset Guide defines the visual and static resources that constitute the application's interface. This guide ensures consistency across the platform by standardizing asset types, directory structures, and implementation methods. PUFI HUB utilizes a hybrid approach, combining high-resolution raster images for branding with lightweight SVGs and Emojis for UI elements.

## Asset Categories

### Logos
- **Primary Logo:** `public/images/brand/pufi-logo.png`
- **Coin Asset:** `public/images/brand/pufi-coin.png`
- **Combined Mark:** `public/images/brand/logo-coin-mascot.png`

### Icons
- **Navigation Icons:** Standard Emojis (e.g., 📢, 🎁, 🏠, 👛, 🛠) are used in the `BottomNav` to provide a native, platform-agnostic feel within the World App.
- **System Icons:** Inline SVGs are used for administrative actions like "Settings" and "Language" to allow for precise CSS-based coloring and animations.
- **Status Indicators:** 🟢 (Verified), 👛 (Wallet Status).

### Mascot
- **PUFI Mascot:** `public/images/mascot/pufi-mascot.png`
- Used as the primary avatar for unauthenticated states and as a high-impact hero element on the Landing Page.

### Token Icons
- **PUFI:** High-resolution coin PNG.
- **WLD:** Official Worldcoin assets (integrated via MiniKit).
- **USDC:** Standardized stablecoin icons.

### Illustrations
- **Campaign Posters:** `public/images/reward/daily-claim-poster.jpg`.
- **Motion Assets:** `public/videos/daily-claim.mp4`, `public/videos/daily-claim-1.mp4`.

### Backgrounds
- **Primary Dashboard:** Multi-layered CSS gradients with Aurora-style blurs (`blur-[120px]`).
- **Cards:** Semi-transparent backdrops (`bg-white/5`) with high-intensity blurs (`backdrop-blur-2xl`).

### UI Assets
- **Gradients:** CSS-defined gradients (e.g., `from-[#2A1757] via-[#181633] to-[#0D1125]`).
- **Safe Areas:** Programmatically handled via Tailwind CSS and `env(safe-area-inset-*)`.

## Public Folder Structure

```text
public/
├── images/
│   ├── brand/          # Official logos and token representations
│   ├── mascot/         # PUFI mascot variations and poses
│   └── reward/         # Campaign posters and high-quality claim visuals
├── videos/             # Background loops and achievement animations
├── globe.svg           # System default assets
├── next.svg
└── vercel.svg
```

## Image Guidelines

### Supported Formats
- **PNG:** Preferred for branding, mascot, and token assets requiring transparency.
- **JPG:** Preferred for campaign posters and complex illustrations to optimize file size.
- **SVG:** Required for all reusable UI icons and simple illustrative shapes.

### Recommended Sizes
- **Mascot Hero:** 440px x 440px (at 2x resolution).
- **Campaign Posters:** 1200px x 630px (standard aspect ratio).
- **Token Icons:** 128px x 128px.

### Optimization Rules
- All PNGs must be crushed using a tool like Tinypng before commit.
- JPGs should be exported at 80% quality.
- SVGs must be cleaned of metadata and hidden layers.

### Naming Conventions
- **Format:** `[category]-[description]-[state].[ext]`
- **Examples:** `pufi-mascot-happy.png`, `btn-claim-active.svg`.

## Icon Guidelines

- **Style:** Consistent stroke width of `2px` for SVGs.
- **Coloring:** Use `stroke="currentColor"` to allow for Tailwind-based theme shifts.
- **Sizing:** Standard system icons are `22px` or `24px`.

## Avatar Guidelines

- **Verified Users:** Use the `pufi-mascot.png` as a fallback or placeholder.
- **Border:** Verified avatars must utilize a yellow/emerald border (`border-yellow-400/20`).

## Campaign Logo Guidelines

- **Dimensions:** Square aspect ratio.
- **Background:** High-contrast backgrounds to ensure legibility on the dark theme (`bg-[#2A3A63]`).
- **Style:** Minimalist iconography or emoji-based representations for early-stage campaigns.

## Creator Upload Guidelines

- **Maximum Size:** 2MB per asset.
- **Format:** JPG or PNG.
- **Aspect Ratio:** Creators are encouraged to provide square (1:1) assets for campaign cards.

## Token Asset Guidelines

### PUFI
- **Color:** Gold/Yellow palette.
- **Visuals:** Features the mascot or the official logo mark.

### WLD
- **Source:** Pulled from official Worldcoin CDN or MiniKit SDK.

### USDC
- **Source:** Standardized Circle/USDC branding.

## Performance Guidelines

### Lazy Loading
- All non-hero images must use `loading="lazy"`.
- Next.js `Image` component is mandatory for automatic format selection (WebP/AVIF).

### Compression
- Video assets (`.mp4`) must be compressed with H.264 or H.265 codecs for web streaming.

### Caching
- Static assets in `public/` are served with long-term cache headers.

## Accessibility

- **Alt Text:** Every `Image` component must have a descriptive `alt` tag.
- **Contrast:** UI icons must maintain a 4.5:1 contrast ratio against background layers.
- **ARIA:** Decorative SVGs should include `aria-hidden="true"`.

## Asset Maintenance

- **Audit Cycle:** Assets are audited at the end of every BUILD phase.
- **Unused Assets:** Periodically removed to maintain repository health.
- **Source Files:** Original designs (Figma/Adobe) are stored in a synchronized external drive, not the repository.

## Future Asset Strategy

- **Dynamic Theming:** Transitioning static SVG icons to a dynamic icon library (e.g., Lucide-React) if complexity increases.
- **Sprite Sheets:** Implementation of CSS sprite sheets for micro-animations to reduce HTTP requests.
- **Animated Assets:** Expansion of the video library for "Epic" reward events.

## Conclusion

Assets in PUFI HUB are more than just visuals; they are functional components that define the user's trust and engagement level. Adherence to these guidelines ensures a high-performance, accessible, and visually stunning experience within the World ecosystem.
