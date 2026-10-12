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

## October 12 compact registry release

Updated the existing `component:21031`, retaining the public URL. The 21st CLI confirmed Published, and the public page shows the new source and bundled preview.

Published source measured directly from the public Component.tsx and Usage.tsx tabs:

| File | Characters | Lines (newline split) |
| --- | ---: | ---: |
| Component | 12,449 | 239 |
| Demo | 5,444 | 67 |
| Combined | 17,893 | 306 |

The user's previous copied prompt contained 61,186 characters and 2,078 lines. That was the whole generated prompt, so it is not an exact like-for-like source comparison. 21st adds its own integration instructions around the source. Its Copy prompt action reported success, but the automation clipboard returned empty; the exact new clipboard text length could not be independently measured. The public component and demo source are both confirmed updated, and the old full renderer is absent from those files.

The original component and demo are preserved exactly, verified against the prior Git revision, under `examples/full-workflow-showcase/`. The collection exposes that example through `?showcase`. The reusable component now accepts custom React panel slots; the smaller demo illustrates three workflows instead of embedding the entire database/code/website scene renderer.

Verification:

- Strict TypeScript and production Vite build passed.
- Local desktop and 21st hosted previews render the fanned deck, focused chapters and dimensional transforms.
- Chapter buttons select the expected panels; the finale appears and the pin releases into the following section.
- Embedded desktop at 767 x 610 animates with one pin spacer. Local document width equals available viewport width.
- A 390 x 844 viewport and emulated reduced motion both use zero pin spacers. Static DOM order pairs each heading with its own panel.
- One and five chapter inputs initialize; navigation reaches the fifth chapter.
- Two instances have two independent pin spacers and unique element IDs.
- Desktop resize to 767 x 610 retains the active fifth chapter.
- 21st CLI Review checked light and dark host themes, the actual desktop interaction and the 375px mobile reading layout. The cover was replaced with the current rendered demo.
- The public 21st page serves the revised source and functioning embedded motion.

Chromium only. The user's actual Mac, Safari, Firefox, real touch devices and GPU performance have not been independently tested. The 21st preview host still adds a narrow horizontal scrollbar in its own frame; it does not disable the motion and was not reproduced in the standalone collection.
