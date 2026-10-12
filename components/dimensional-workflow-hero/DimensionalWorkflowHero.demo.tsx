"use client";
import { Mail, Bot, Check, UserRound, Database, Bell, Layout, Code, type LucideIcon } from "lucide-react";
import DimensionalWorkflowHero, { type HeroChapter } from "./DimensionalWorkflowHero";

function Workflow({ title, nodes }: { title: string; nodes: [string, LucideIcon][] }) {
  return <div className="workflow-demo">
    <header><span>◈ &nbsp; {title}</span><span>Example flow &nbsp; ···</span></header>
    <div className="workflow-canvas">
      <svg viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
        <path d="M260 200H350 M570 200C635 200 635 100 700 100 M570 200C635 200 635 300 700 300" />
      </svg>
      {nodes.map(([label, Icon], i) => <div key={label} data-hero-step className="workflow-node" style={{ left: `${[4,35,70,70][i]}%`, top: `${[50,50,25,75][i]}%` }}>
        <Icon size={24} aria-hidden="true" /><strong>{label}</strong><span>{["TRIGGER", "PROCESS", "DELIVER", "REVIEW"][i]}</span>
      </div>)}
    </div>
    <footer>Illustrative workflow <span>Designed with human control ↗</span></footer>
  </div>;
}

export const demoChapters: HeroChapter[] = [
  { label: "AI agents", title: <>A useful answer.<br /><em>A human when it matters.</em></>,
    description: "Answer routine questions from your knowledge base. Route exceptions to a person with the context attached.",
    panel: <Workflow title="Support assistant" nodes={[["New message", Mail], ["AI assistant", Bot], ["Send answer", Check], ["Human handoff", UserRound]]} /> },
  { label: "Connected workflows", title: <>Fewer handoffs.<br /><em>Work that moves.</em></>,
    description: "Connect intake, review and delivery. Keep records current without asking your team to copy information between tools.",
    panel: <Workflow title="Lead intake" nodes={[["New inquiry", Mail], ["Validate details", Check], ["Update CRM", Database], ["Notify team", Bell]]} /> },
  { label: "Web development", title: <>Built for the way<br /><em>your business works.</em></>,
    description: "Bring the interface, data and integrations into one connected website or application.",
    panel: <Workflow title="From structure to screen" nodes={[["Content & data", Database], ["Build interface", Code], ["Publish site", Layout], ["Review & refine", UserRound]]} /> },
];

export default function Demo() {
  return <div style={{ width: "100%", minWidth: 0 }}>
    <style>{demoStyles}</style>
    <DimensionalWorkflowHero
      eyebrow="Built around your business"
      title={<>Less busywork.<br />More <em>possibility.</em></>}
      description={<>Your conversations, tools, and next steps.<br />Connected into a flow that works for you.</>}
      chapters={demoChapters}
      accent="#22dde7"
      finale={<><p className="dwh-label">One connected operating layer</p><h2>The work moves.<br /><em>Your team stays in control.</em></h2><a className="dwh-action" href="#use-the-hero" style={{ marginTop: 32 }}>Make it yours ↗</a></>}
    />
    <section id="use-the-hero" style={{ padding: "64px 6%", background: "#f2f6fc", color: "#081432" }}>
      <h2>Your content. The same motion.</h2>
      <p>Pass your own React panels into the chapters prop. The component handles the perspective, scroll and static mobile layout.</p>
    </section>
  </div>;
}

export const demoStyles = `
.workflow-demo{height:100%;display:flex;flex-direction:column;background:#0b1a3c;border-radius:11px;color:#edf5ff;font-family:system-ui,sans-serif}
.workflow-demo header,.workflow-demo footer{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:17px 22px;font-size:12px}
.workflow-demo header{background:#15295a;border-bottom:1px solid #ffffff20;border-radius:11px 11px 0 0}
.workflow-demo header span:last-child{font-size:10px;color:#c4d2e9}
.workflow-demo footer{border-top:1px solid #ffffff20;color:#9eb4d6;font-size:10px}
.workflow-demo .workflow-canvas{position:relative;flex:1;min-height:260px;background-image:radial-gradient(#36527677 1px,transparent 1px);background-size:16px 16px;transform-style:preserve-3d}
.workflow-demo svg:not(.lucide){position:absolute;inset:0;width:100%;height:100%;fill:none;stroke:var(--dwh-accent,#22dde7);stroke-width:2;opacity:.65}
.workflow-demo .workflow-node{position:absolute;transform:translateY(-50%);width:22%;min-height:112px;padding:17px 12px;display:flex;flex-direction:column;gap:10px;border:1px solid #58b9dc;background:linear-gradient(145deg,#17344b,#101d34);border-radius:9px;box-shadow:0 5px 0 #050e22;transform-style:preserve-3d}
.workflow-demo .workflow-node:nth-of-type(2){border-color:#a68cf0;background:linear-gradient(145deg,#30264c,#17182f)}
.workflow-demo .workflow-node:nth-of-type(3){border-color:#64d89c;background:linear-gradient(145deg,#194337,#12272b)}
.workflow-demo .workflow-node:nth-of-type(4){border-color:#d8b159;background:linear-gradient(145deg,#413523,#25232c)}
.workflow-demo .workflow-node svg{color:var(--dwh-accent,#22dde7)}
.workflow-demo strong{font-size:15px;font-weight:550}
.workflow-demo .workflow-node span{font:8px ui-monospace,monospace;letter-spacing:.12em;color:#b5c8df}
@media(max-width:599px){.workflow-demo header,.workflow-demo footer{padding:12px;font-size:9px}.workflow-demo footer span{display:none}.workflow-demo strong{font-size:10px}.workflow-demo .workflow-node{padding:10px 6px;min-height:90px;gap:8px}.workflow-demo .workflow-node span{font-size:6px}.workflow-demo .workflow-node svg{width:18px}}
`;
