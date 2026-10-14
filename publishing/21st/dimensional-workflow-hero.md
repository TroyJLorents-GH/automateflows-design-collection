# Dimensional Workflow Hero on 21st

Stable reference: `component:21031`. Update this item rather than deleting or creating another listing.

[Public component](https://21st.dev/@troyjlorents-gh/components/dimensional-workflow-hero)

```sh
npx @21st-dev/cli add @troyjlorents-gh/dimensional-workflow-hero
```

Registry: https://21st.dev/r/troyjlorents-gh/dimensional-workflow-hero

The component is published to Troy Lorents's personal profile and accessible by direct link. The initial catalog submission was returned with requested changes. Publication and catalog review are separate states.

## Compact source revision, October 12, 2026

The published component now owns only the dimensional deck, scroll sequence, chapter navigation, accessibility and responsive behavior. Consumers supply title and chapter objects with React panel slots. The compact default demo illustrates three workflows.

The earlier complete workflow renderer and native customization controls remain in `examples/full-workflow-showcase/`. They are not included in the compact 21st copy prompt. This changes the component API; existing projects using `content` and `defaultHeroContent` can keep their installed version or use the retained full source.

Source: `components/dimensional-workflow-hero/DimensionalWorkflowHero.tsx`

Demo: `components/dimensional-workflow-hero/DimensionalWorkflowHero.demo.tsx`

```sh
21st publish ./components/dimensional-workflow-hero/DimensionalWorkflowHero.tsx --component component:21031 --demo ./components/dimensional-workflow-hero/DimensionalWorkflowHero.demo.tsx --description "A reusable GSAP hero with a fanned 3D deck, custom React panel slots and static mobile and reduced-motion layouts." --preview ./components/dimensional-workflow-hero/preview.jpg --no-open
```

Use the dedicated CLI Review to verify the live preview before publishing. The component and demo are self-contained; the core requires React, GSAP and @gsap/react. The demo additionally requires lucide-react. No hosting control bridge or customization overlay is needed by the compact example. Revisions retain the listing URL and component identity.

See `publishing/VALIDATION.md` for measured sizes and verification evidence.

## October 14 revision

The demo now shows a workflow, connected records and a website. The mobile first view includes a panel; the desktop fan fits within the canvas. Still cover and local motion recording: `components/dimensional-workflow-hero/preview.jpg` and `preview.mp4`. Revision prepared for the existing listing.

Animated listing cover: `components/dimensional-workflow-hero/preview.webp`. This is a recording of the real scrolling demo.
