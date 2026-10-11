import DimensionalWorkflowHero, { defaultHeroContent } from "../../components/dimensional-workflow-hero/DimensionalWorkflowHero";
export default function CustomizedHero() {
  const content = { ...defaultHeroContent, intro: { ...defaultHeroContent.intro, eyebrow: "YOUR STUDIO", title: { lines: ["Good ideas.", "Working systems."], emphasis: "Working systems." } } };
  return <DimensionalWorkflowHero content={content} accent="#a8df80" motion={{ viewportsPerChapter: 1.1 }} />;
}
