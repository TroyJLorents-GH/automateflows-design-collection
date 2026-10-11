import DimensionalWorkflowHero from "./DimensionalWorkflowHero";
const settings = { accent: "#22dde7", viewportsPerChapter: 1.35, maxChapterScroll: 1350, scrub: 0.65 };
export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return <><DimensionalWorkflowHero accent={s.accent} motion={{ viewportsPerChapter: s.viewportsPerChapter, maxChapterScroll: s.maxChapterScroll, scrub: s.scrub }} /><section id="examples" style={{ padding: "80px 24px", background: "#f2f5fa", color: "#102048", fontFamily: "system-ui, sans-serif" }}><h2>Make it yours.</h2><p>Replace the content, add your own finished-site image, and tune the scroll distance.</p></section></>;
}
