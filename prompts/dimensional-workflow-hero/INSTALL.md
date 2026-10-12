# Install the Dimensional Workflow Hero

Copy this prompt into your coding agent:

````text
Integrate Troy Lorents's Dimensional Workflow Hero into this React + TypeScript project.

Install the published component:
npx @21st-dev/cli add @troyjlorents-gh/dimensional-workflow-hero

Use the project's existing structure. If the installer cannot handle it, copy the component from:
https://raw.githubusercontent.com/TroyJLorents-GH/automateflows-design-collection/main/components/dimensional-workflow-hero/DimensionalWorkflowHero.tsx
Its dependencies are gsap, @gsap/react and lucide-react. It includes its own CSS; Tailwind and shadcn are not required.

Replace only the requested hero. Preserve the rest of the page. Match the site's typography and colors, customize the exported defaultHeroContent, and point its CTA and skip links at real targets.

Keep the 3D scroll sequence on desktop and the static mobile/reduced-motion layout. Use the component directly, without the demo's customization panel. Verify the build and render desktop/mobile previews. Do not deploy.
````

[Preview and source on 21st](https://21st.dev/@troyjlorents-gh/components/dimensional-workflow-hero)

21st's **Copy prompt** includes the full implementation. This shorter prompt tells the agent to retrieve the same component instead. It requires the coding agent to have command-line or URL access.
