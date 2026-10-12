import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Demo, { demoChapters, demoStyles } from "../components/dimensional-workflow-hero/DimensionalWorkflowHero.demo";
import DimensionalWorkflowHero from "../components/dimensional-workflow-hero/DimensionalWorkflowHero";
import FullShowcase from "../examples/full-workflow-showcase/DimensionalWorkflowHero.demo";
import "./site.css";
const query = new URLSearchParams(location.search);
const count = Math.min(5, Math.max(1, Number(query.get("chapters")) || 3));
const chapters = Array.from({ length: count }, (_, i) => ({ ...demoChapters[i % 3], label: `${demoChapters[i % 3].label}${i > 2 ? ` ${i + 1}` : ""}` }));
function App() {
  if (query.has("demo")) return <Demo />;
  return <>
    <header className="collection-header"><a href="./">Automate Flows <span>Design Collection</span></a><a href="?showcase">Full workflow showcase ↗</a><a href="https://github.com/TroyJLorents-GH/automateflows-design-collection">Get the code ↗</a></header>
    {query.has("showcase") ? <FullShowcase /> : query.has("chapters") || query.has("instances") ? <>
      <style>{demoStyles}</style>
      <DimensionalWorkflowHero title={<>Less busywork.<br /><em>More possibility.</em></>} chapters={chapters} />
      {query.has("instances") && <DimensionalWorkflowHero title="Second instance" chapters={chapters} accent="#a8df80" />}
    </> : <Demo />}
    <footer className="collection-info"><p>01 / DIMENSIONAL WORKFLOW HERO</p><h2>Code, examples and the prompt.</h2><p>The compact component handles the 3D scroll effect. The original workflow showcase is also included in this collection.</p><div className="links"><a href="https://github.com/TroyJLorents-GH/automateflows-design-collection/tree/main/components/dimensional-workflow-hero">Component</a><a href="?showcase">Full showcase</a><a href="https://github.com/TroyJLorents-GH/automateflows-design-collection/tree/main/prompts">Prompts</a><a href="https://automateflows.io/">Original project</a></div></footer>
  </>;
}
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
