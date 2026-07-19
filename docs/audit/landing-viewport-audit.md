# Landing Page Viewport Audit Report

## 1. Executive Summary
The Landing Page (`app/page.tsx`) experiences vertical clipping on desktop and laptop screens (especially smaller viewports < 800px) because the content height exceeds the constrained flex layout. While the Dashboard correctly grows with content, the Landing Page attempts to fit within `100dvh` using a flex structure that inadvertently suppresses scrolling in some edge cases or causes overlap due to centering logic.

## 2. Container Analysis
The layout is structured as follows:

*   **Outer Container (`main`)**: 
    *   Classes: `min-h-[100dvh] flex flex-col justify-between`
    *   Function: Intended to fill the viewport and distribute Hero and Footer to the ends.
*   **Hero Section (`section`)**:
    *   Classes: `flex-1 flex flex-col items-center justify-center`
    *   Function: Occupies all remaining space and centers the mascot, titles, and button.
*   **Footer**:
    *   Classes: `border-t border-white/10 pt-8`
    *   Function: Stays at the bottom.

## 3. Root Cause Determination
The primary cause of clipping is the combination of **`flex-1`** and **`justify-center`** on the Hero `section`:

1.  **Flex Constraint**: `flex-1` on the `section` tells it to take the *available space* within the parent's `min-h-[100dvh]`. If the viewport is small (e.g., 700px), the `section` height is fixed to a small value (approx. 500px after accounting for paddings and footer).
2.  **Centering Logic**: `justify-center` inside that fixed-height `section` centers the children. If children are taller than 500px (our estimate is ~536px), they overflow the `section`.
3.  **Scroll Suppression**: Because the `section` itself is not growing (it's filling the "basis" provided by the parent), it does not push the `main` container to expand beyond `100dvh`. Consequently, the browser may not trigger a scrollbar, and the bottom button is clipped or hidden behind the footer.

## 4. Height Property Recommendations
*   **`min-h-[100dvh]`**: Keep this on the outer `main` container to ensure the background covers at least the full viewport.
*   **Inner Height**: The inner `section` should be allowed to grow naturally.
*   **Avoid**: Avoid using `flex-1` in combination with `justify-center` if the content height is near or exceeds the target viewport height.

## 5. Spacing Analysis
The vertical spacing is quite generous:
*   Mascot + margin: ~224px
*   Titles + margins: ~124px
*   Badge + margin: ~56px
*   Button + margin: ~100px
*   Footer + padding: ~142px (including main container pb)
*   Top padding: 32px
*   **Total Estimated Height: ~678px to ~710px**

Standard laptop viewports (especially with browser tabs/headers) are often between **650px and 750px**, making this layout extremely vulnerable to clipping.

## 6. Recommended Minimal Fix (Audit Only)
To resolve the clipping while maintaining the visual design:

1.  **Remove `flex-1`** from the Hero `section`.
2.  Add a **`py-12`** (or similar) to the `section` to ensure it has vertical breathing room.
3.  Keep **`justify-between`** on the outer `main`. This will still push the footer to the bottom on large screens but allow the `section` to push the page height on small screens.
4.  Optionally, use **`min-h-fit`** on the `section` if `flex-1` is strictly desired for centering on large screens.

This approach ensures the layout remains "Mobile First" but respects "Content First" when scrolling is required.
