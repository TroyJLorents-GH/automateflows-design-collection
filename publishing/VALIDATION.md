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
- Independent demo controls update the accent and motion settings. At 1440 x 900, moving the scroll-distance slider from 1.35 to 3 changes the pin distance from 3645px to 8100px. Reset restores the defaults.

Browser inspection used Chromium. Safari, Firefox, real touch devices and GPU profiling have not been independently tested for this release. Hosted 21st preview review and public URLs are recorded separately.

21st CLI Review completed with one self-contained demo and a supplied cover. The final hosted demo was checked in light/dark host themes and mobile mode. Its native accent control changed the component style to `#a8df80` and Reset restored defaults. The 21st account inventory confirms Published `component:21031`. Public GitHub Pages builds passed.

## October 12 preview correction

The first release used the page desktop breakpoint inside 21st. A 767 x 610 embedded frame therefore showed the static fallback instead of the 3D deck. The demo now uses a scaled desktop scene with an actual-size pinned viewport. Chromium checks at 767 x 610 confirm one pin spacer, 3D panel transforms, chapter navigation, and no horizontal overflow. Resizing from 1440 x 900 back to 767 x 610 preserves the active chapter. At 390 x 844 and with reduced motion enabled there are zero pin spacers. The Simplify motion control and stored override have been removed. These checks do not claim testing on the user's actual Mac.
