import DimensionalWorkflowHero from "../../components/dimensional-workflow-hero/DimensionalWorkflowHero";

export default function CustomizedHero() {
  return <DimensionalWorkflowHero
    title={<>Good ideas.<br /><em>Working systems.</em></>}
    eyebrow="Your studio"
    accent="#a8df80"
    viewportsPerChapter={1.1}
    chapters={[
      { label: "Discover", title: "Start with the real work.", panel: <div style={{ padding: 32 }}>Your first diagram, screenshot, or React UI.</div> },
      { label: "Build", title: "Connect the pieces.", panel: <div style={{ padding: 32 }}>Your second panel.</div> },
      { label: "Launch", title: "Put it to work.", panel: <div style={{ padding: 32 }}>Your third panel.</div> },
    ]}
  />;
}
