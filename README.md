# Automate Flows Design Collection

Reusable designs, working examples, and implementation prompts by Troy Lorents.

This collection starts with the **Dimensional Workflow Hero**, adapted from the Automate Flows homepage. Additional designs and prompts can live alongside it, each with its own example, credits and publishing record.

[Open the live collection demo](https://troyjlorents-gh.github.io/automateflows-design-collection/)

[Use the hero on 21st](https://21st.dev/@troyjlorents-gh/components/dimensional-workflow-hero)

```sh
npx @21st-dev/cli add @troyjlorents-gh/dimensional-workflow-hero
```

![Dimensional Workflow Hero](components/dimensional-workflow-hero/preview.jpg)

## Run the collection

```sh
npm ci
npm run dev
```

Use `npm run build` for the production build. Node.js 20.19+ or 22.12+ is required by Vite.

## Collection

| Design | Component | Example | Prompt |
| --- | --- | --- | --- |
| Dimensional Workflow Hero | [Source](components/dimensional-workflow-hero/DimensionalWorkflowHero.tsx) | [Controlled demo](components/dimensional-workflow-hero/DimensionalWorkflowHero.demo.tsx), [custom copy](examples/dimensional-workflow-hero/CustomizedHero.tsx) | [Build prompt](prompts/dimensional-workflow-hero/BUILD.md), [adaptation prompt](prompts/dimensional-workflow-hero/ADAPT.md) |

## Install one component

```sh
npm install gsap @gsap/react lucide-react
```

Copy `DimensionalWorkflowHero.tsx` into your React project. It includes its own scoped CSS, supporting panel components and exported types. It does not need the Automate Flows website, image files, font files, Tailwind, a router, or a backend.

```tsx
import DimensionalWorkflowHero from './DimensionalWorkflowHero';

export default function Page() {
  return <>
    <DimensionalWorkflowHero />
    <section id="examples">Your next section</section>
  </>;
}
```

Set `content` to change text, chapters, diagrams, CTA links and optional finished-site imagery. Exported `defaultHeroContent` is a useful starting point. The default build chapter draws a neutral CSS mockup; no branded product screenshot is included. Workflow diagrams are illustrative.

Set `accent`, `className`, `style`, and `motion` to adapt appearance and pacing. `motion` supports `viewportsPerChapter` (default 1.35), `maxChapterScroll` (1350px) and `scrub` (0.65). Supply at least one chapter; an empty array falls back to the demo chapters. Use one to five chapters for the supported example layouts, with three narrative steps per chapter. More chapters may need a different intro composition.

The working demo has a **Customize demo** disclosure with accent, scroll-distance and smoothing controls. These controls live in the demo itself and work without a hosting platform's control bridge. The demo raises the distance cap to 2700px to allow the full slider range. Motion-setting changes rebuild the scoped timeline and restore the active chapter.

The hero is deliberately a dark visual canvas in both light and dark host themes. Its accent inherits `--color-primary` when no explicit accent is supplied. Scoped `--color-hero-*` and `--font-hero-*` variables let you match your site. Set skip and finale targets to existing elements or routes.

Desktop motion runs above 900px wide and 649px tall. Smaller screens, reduced-motion preferences and the Simplify motion button use the static reading layout. The preference is stored locally. Resize refresh and toggling preserve reading position within the active desktop story.

## Publishing and provenance

[21st publishing files and status](publishing/21st/dimensional-workflow-hero.md). The GitHub collection and 21st component are separate releases; a draft is not a published listing.

[Credits and asset boundaries](ATTRIBUTION.md). The original homepage is at https://automateflows.io/. This repository contains a reusable adaptation, not the site's complete source or client data.
