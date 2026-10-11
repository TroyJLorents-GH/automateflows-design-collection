# Release validation

Validated locally on October 10, 2026.

- TypeScript strict check and production Vite build passed.
- Rendered desktop intro deck and chapter navigation at 1440 x 900.
- Motion toggle switches to static reading mode and back.
- At 390 x 844, static mode has no pin spacer and document width is within the viewport.
- One-chapter example initializes; four chapters with two instances produce two pin spacers and no duplicate element IDs (19 unique IDs).
- Neutral finished-site preview contains no external image requests.
- Source includes GSAP context cleanup and instance-scoped DOM selectors.
- The static panel ResizeObserver schedules scale writes into an animation frame to avoid resize-delivery feedback.

Browser inspection used Chromium. Safari, Firefox, real touch devices and GPU profiling have not been independently tested for this release. Hosted 21st preview review and public URLs are recorded separately.
