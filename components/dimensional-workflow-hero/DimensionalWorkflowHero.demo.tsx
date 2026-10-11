import { useState } from "react";
import DimensionalWorkflowHero from "./DimensionalWorkflowHero";

export default function Demo() {
  const [accent, setAccent] = useState("#22dde7");
  const [distance, setDistance] = useState(1.35);
  const [scrub, setScrub] = useState(0.65);
  return <>
    <details style={{ position: "fixed", top: 12, right: 16, zIndex: 100, color: "#f2f5fa", background: "#081536", border: "1px solid #ffffff30", borderRadius: 8, padding: "10px 14px", font: "13px system-ui, sans-serif" }}>
      <summary style={{ cursor: "pointer" }}>Customize demo</summary>
      <div style={{ display: "grid", gap: 14, paddingTop: 16, width: 230 }}>
        <label>Accent <input aria-label="Hero accent" type="color" value={accent} onChange={e => setAccent(e.target.value)} style={{ float: "right" }} /></label>
        <label>Scroll distance: {distance.toFixed(2)} viewports per chapter<input aria-label="Scroll distance" type="range" min="0.5" max="3" step="0.05" value={distance} onChange={e => setDistance(Number(e.target.value))} style={{ width: "100%" }} /></label>
        <label>Scroll smoothing: {scrub.toFixed(2)} seconds<input aria-label="Scroll smoothing" type="range" min="0" max="1" step="0.05" value={scrub} onChange={e => setScrub(Number(e.target.value))} style={{ width: "100%" }} /></label>
        <p style={{ margin: 0, color: "#b5c5df", lineHeight: 1.5 }}>Scroll controls affect the desktop animation. Small screens and reduced motion use a static layout.</p>
        <button onClick={() => { setAccent("#22dde7"); setDistance(1.35); setScrub(0.65); }} style={{ padding: 8, border: "1px solid #ffffff40", background: "transparent", color: "inherit", cursor: "pointer" }}>Reset demo</button>
      </div>
    </details>
    <DimensionalWorkflowHero accent={accent} motion={{ viewportsPerChapter: distance, maxChapterScroll: 2700, scrub }} />
    <section id="examples" style={{ padding: "80px 24px", background: "#f2f5fa", color: "#102048", fontFamily: "system-ui, sans-serif" }}><h2>Make it yours.</h2><p>Replace the content, add your own finished-site image, and tune the scroll distance.</p></section>
  </>;
}
