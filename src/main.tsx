import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Demo from "../components/dimensional-workflow-hero/DimensionalWorkflowHero.demo";
import DimensionalWorkflowHero, { defaultHeroContent } from "../components/dimensional-workflow-hero/DimensionalWorkflowHero";
import "./site.css";
const query = new URLSearchParams(location.search);
const number = Number(query.get("chapters"));
const count = number >= 1 && number <= 5 ? number : 3;
const chapters = Array.from({ length: count }, (_, i) => ({ ...defaultHeroContent.chapters[i % 3], name: `${defaultHeroContent.chapters[i % 3].name}${i > 2 ? ` ${i + 1}` : ""}` }));
const content = { ...defaultHeroContent, chapters };
function App() {
  return <><header className="collection-header"><a href="./">Automate Flows <span>Design Collection</span></a><a href="https://github.com/TroyJLorents-GH/automateflows-design-collection">Get the code ↗</a></header>{query.has("chapters") || query.has("instances") ? <><DimensionalWorkflowHero content={content} />{query.has("instances") && <DimensionalWorkflowHero content={{ ...content, intro: { ...content.intro, eyebrow: "SECOND INSTANCE" } }} />}<section id="examples" className="collection-info"><h2>Example complete.</h2></section></> : <Demo />}<footer className="collection-info"><p>01 / DIMENSIONAL WORKFLOW HERO</p><h2>Code, examples and the prompt.</h2><p>A pinned three-dimensional deck becomes a sequence of readable workflow chapters. Small screens and reduced-motion settings get a static layout.</p><div className="links"><a href="https://github.com/TroyJLorents-GH/automateflows-design-collection/tree/main/components/dimensional-workflow-hero">Component</a><a href="https://github.com/TroyJLorents-GH/automateflows-design-collection/tree/main/prompts">Prompts</a><a href="https://automateflows.io/">Original project</a></div></footer></>;
}
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
