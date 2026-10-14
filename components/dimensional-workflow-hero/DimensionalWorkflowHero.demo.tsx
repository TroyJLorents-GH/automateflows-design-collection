"use client";
import { Mail, Bot, Check, UserRound, Database, type LucideIcon } from "lucide-react";
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

function Records() {
  return <div className="workflow-demo records-demo">
    <header><span>◈ &nbsp; Connected records</span><span>Live sync <i /></span></header>
    <div className="records-body"><div className="records-heading"><Database size={25} /><strong>One source of truth</strong><span>CRM / Website / Team</span></div>
      <table><thead><tr><th>Record</th><th>Destination</th><th>Status</th></tr></thead><tbody>
        {[["New consultation", "CRM"], ["Project brief", "Workspace"], ["Booking details", "Calendar"], ["Client update", "Team inbox"]].map(([record, destination]) => <tr key={record} data-hero-step><td>{record}</td><td>{destination}</td><td><span className="sync-status"><Check size={15} /> Synced</span></td></tr>)}
      </tbody></table>
      <p>Information moves once. Every system stays current.</p>
    </div><footer>Illustrative data <span>Ready for the next handoff ↗</span></footer>
  </div>;
}
function Website() {
  return <div className="workflow-demo site-demo">
    <header><span>◈ &nbsp; From structure to screen</span><span>Website preview &nbsp; ···</span></header>
    <div className="site-body"><div className="site-nav"><strong>FIELDWORK</strong><span>Studio &nbsp; Work &nbsp; Contact</span></div>
      <div className="site-layout"><div data-hero-step><p>Spaces for everyday life</p><h3>Room to<br /><em>think bigger.</em></h3><span className="site-link">Explore the studio ↗</span></div><div className="site-art" aria-label="Architectural arch illustration" role="img" data-hero-step><div /><span>Form. Light. Possibility.</span></div></div>
      <div className="site-bottom" data-hero-step><strong>Considered spaces.<br />Lasting impressions.</strong><span>Architecture &amp; interiors<br />An illustrative studio website</span></div>
    </div><footer>Responsive interface <span>Built around your business ↗</span></footer>
  </div>;
}

export const demoChapters: HeroChapter[] = [
  { label: "AI agents", title: <>A useful answer.<br /><em>A human when it matters.</em></>,
    description: "Answer routine questions from your knowledge base. Route exceptions to a person with the context attached.",
    panel: <Workflow title="Support assistant" nodes={[["New message", Mail], ["AI assistant", Bot], ["Send answer", Check], ["Human handoff", UserRound]]} /> },
  { label: "Connected workflows", title: <>Fewer handoffs.<br /><em>Work that moves.</em></>,
    description: "Connect intake, review and delivery. Keep records current without asking your team to copy information between tools.",
    panel: <Records /> },
  { label: "Web development", title: <>Built for the way<br /><em>your business works.</em></>,
    description: "Bring the interface, data and integrations into one connected website or application.",
    panel: <Website /> },
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
.workflow-demo strong{font-size:20px;font-weight:550}
.workflow-demo .workflow-node span{font:10px ui-monospace,monospace;letter-spacing:.12em;color:#b5c8df}
@media(max-width:599px){.workflow-demo header,.workflow-demo footer{padding:12px;font-size:9px}.workflow-demo footer span{display:none}.workflow-demo strong{font-size:10px}.workflow-demo .workflow-node{padding:10px 6px;min-height:90px;gap:8px}.workflow-demo .workflow-node span{font-size:6px}.workflow-demo .workflow-node svg{width:18px}}
.records-body{flex:1;padding:28px 32px}.records-heading{display:flex;align-items:center;gap:12px;margin-bottom:24px}.records-heading>svg{color:var(--dwh-accent)}.records-heading>span{margin-left:auto;font-size:12px;color:#a1b5d5}.records-demo table{width:100%;border-collapse:collapse;text-align:left;font-size:18px}.records-demo th{padding:0 0 14px;font-size:12px;font-weight:400;color:#a1b5d5}.records-demo td{padding:13px 0;border-top:1px solid #ffffff14}.records-demo td:nth-child(2){color:#a1b5d5}.sync-status{display:inline-flex;gap:6px;align-items:center;font-size:13px;color:#83e5ba}.records-body>p{font-size:12px!important;color:#a1b5d5;margin-top:22px!important}.records-demo header i{display:inline-block;width:6px;height:6px;background:#83e5ba;border-radius:50%;margin-left:6px}
.site-body{background:#e9e5dc;color:#253b36;flex:1;padding:20px 28px}.site-nav{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #253b3628;padding-bottom:14px}.site-nav strong{font-size:14px;letter-spacing:.14em}.site-nav>span{font-size:10px}.site-layout{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:22px 0 18px;align-items:center}.site-layout p{font-size:10px;letter-spacing:.06em}.site-layout h3{font-family:Georgia,serif;font-size:43px;line-height:1.02;font-weight:400;letter-spacing:-.05em;margin:14px 0 20px}.site-layout em{color:#537268!important}.site-link{font-size:11px;border-bottom:1px solid;padding-bottom:5px}.site-art{height:178px;position:relative;overflow:hidden;background:linear-gradient(135deg,#b7beaa,#889c8e);border-radius:100px 100px 0 0}.site-art>div{position:absolute;inset:24px 52px -4px;border-radius:90px 90px 0 0;background:linear-gradient(110deg,#d4cdb7 45%,#a7b7a3 46%,#596b60);box-shadow:18px 8px 0 #263b3433}.site-art>span{position:absolute;bottom:12px;left:16px;color:white;font:9px ui-monospace,monospace}.site-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid #253b3628}.site-bottom strong{font-size:12px;line-height:1.4}.site-bottom>span{font-size:9px;line-height:1.5}
@media(max-width:599px){.records-body{padding:18px 14px}.records-heading{gap:8px;margin-bottom:18px}.records-heading>strong{font-size:14px}.records-heading>span{display:none}.records-demo table{font-size:12px}.records-demo th{font-size:10px}.records-demo td{padding:12px 0}.sync-status{font-size:10px;gap:3px}.records-body>p{font-size:10px!important}.site-body{padding:16px}.site-nav strong{font-size:11px}.site-nav>span{font-size:8px}.site-layout{gap:12px;padding:18px 0}.site-layout h3{font-size:30px}.site-art{height:154px}.site-art>div{inset:22px 24px -4px}.site-art>span{font-size:6px;left:9px}.site-bottom strong{font-size:10px}.site-bottom>span{font-size:8px}}
`;
