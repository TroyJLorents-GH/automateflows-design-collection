"use client";
import { useId, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type HeroChapter = {
  label: string;
  title: ReactNode;
  description?: ReactNode;
  /** Your screenshot, diagram, or React UI. Keep interactive controls out of the decorative deck. */
  panel: ReactNode;
};
export type DimensionalWorkflowHeroProps = {
  title: ReactNode;
  chapters: HeroChapter[];
  eyebrow?: string;
  description?: ReactNode;
  finale?: ReactNode;
  accent?: string;
  className?: string;
  style?: CSSProperties;
  viewportsPerChapter?: number;
  scrub?: number;
};

/** One to five panels. Desktop uses a scaled 1440px scene; phones remain a readable sequence. */
export default function DimensionalWorkflowHero({
  title, chapters, eyebrow, description, finale, accent, className = "", style,
  viewportsPerChapter = 1.35, scrub = 0.65,
}: DimensionalWorkflowHeroProps) {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const id = `dwh-${useId().replace(/:/g, "")}`;
  const visibleChapters = chapters.slice(0, 5);
  const finaleAt = 1 + visibleChapters.length * 3;

  useGSAP(() => {
    const element = root.current!;
    const match = gsap.matchMedia();
    match.add("(min-width: 600px) and (min-height: 360px) and (prefers-reduced-motion: no-preference)", () => {
      if (!visibleChapters.length) return;
      const find = <T extends HTMLElement>(selector: string) => Array.from(element.querySelectorAll<T>(selector));
      const viewport = find(".dwh-viewport")[0];
      const scene = find(".dwh-scene")[0];
      const stage = find(".dwh-stage");
      const panels = find(".dwh-panel");
      const copies = find(".dwh-copy");
      const intro = find(".dwh-intro")[0];
      const end = find(".dwh-finale")[0];
      const nav = find<HTMLButtonElement>(".dwh-nav button");
      const middle = (panels.length - 1) / 2;
      const fit = () => {
        const scale = Math.min(1, element.clientWidth / 1440);
        scene.style.width = `${element.clientWidth / scale}px`;
        scene.style.height = `${window.innerHeight / scale}px`;
        scene.style.transform = `scale(${scale})`;
      };
      element.classList.add("is-animated");
      fit();
      gsap.set(stage, { zIndex: (i: number) => panels.length - i, x: () => scene.clientWidth * 0.73, y: () => scene.clientHeight * 0.52 });
      gsap.set(copies, { autoAlpha: 0, y: 28 });
      if (end) gsap.set(end, { autoAlpha: 0, y: 28 });
      panels.forEach((panel, i) => gsap.set(panel, {
        xPercent: -50, yPercent: -50, x: -20 + (i - middle) * Math.min(145, 290 / Math.max(1, panels.length - 1)),
        y: i === Math.floor(middle) ? -10 : 30, z: -i * 100,
        rotationY: -32, rotationX: 12, rotationZ: -3, scale: 0.62,
        zIndex: panels.length - i, transformPerspective: 1500,
      }));
      let active = -2;
      const show = (node: HTMLElement, shown: boolean) => {
        node.inert = !shown;
        node.setAttribute("aria-hidden", String(!shown));
      };
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 0.8 },
        onUpdate() {
          const time = this.time();
          const next = time < 0.7 ? -1 : time >= finaleAt && end ? panels.length : Math.min(panels.length - 1, Math.floor((time - 0.7) / 3));
          if (next === active) return;
          active = next;
          show(intro, next === -1);
          copies.forEach((copy, i) => show(copy, i === next));
          panels.forEach((panel, i) => show(panel, i === next));
          if (end) show(end, next === panels.length);
          nav.forEach((button, i) => button.setAttribute("aria-current", String(i - 1 === next)));
        },
        scrollTrigger: {
          trigger: element, pin: viewport, start: "top top",
          end: () => `+=${window.innerHeight * Math.max(0.5, viewportsPerChapter) * panels.length}`,
          scrub: Math.max(0, scrub), invalidateOnRefresh: true, anticipatePin: 1,
        },
      });
      timeline.current = tl;
      tl.to(intro, { autoAlpha: 0, y: -40, duration: 0.65 }, 0);
      panels.forEach((panel, i) => {
        const at = 0.7 + i * 3;
        tl.addLabel(`chapter-${i}`, at + 0.9);
        tl.to(stage, { x: () => scene.clientWidth * 0.73, y: () => scene.clientHeight * 0.5 }, at);
        panels.forEach((other, j) => tl.to(other, {
          x: j === i ? 0 : (j < i ? -560 : 560), y: j === i ? 0 : 40,
          z: j === i ? 50 : -500, rotationY: j === i ? -8 : (j < i ? 35 : -35),
          rotationX: j === i ? 5 : 12, rotationZ: 0,
          scale: j === i ? 0.85 : 0.6, autoAlpha: j === i ? 1 : 0,
        }, at));
        tl.to(copies[i], { autoAlpha: 1, y: 0 }, at + 0.15);
        const steps = panel.querySelectorAll("[data-hero-step]");
        if (steps.length) {
          tl.to(steps, { z: 35, y: -7, duration: 0.35, stagger: 0.35 }, at + 0.85);
          tl.to(steps, { z: 0, y: 0, duration: 0.4, stagger: 0.35 }, at + 1.25);
        }
        if (i < panels.length - 1 || end) tl.to(copies[i], { autoAlpha: 0, y: -28, duration: 0.4 }, at + 2.5);
      });
      if (end) {
        tl.to(stage, { x: () => scene.clientWidth * 0.5 }, finaleAt);
        panels.forEach((panel, i) => tl.to(panel, {
          x: (i - middle) * 440, y: 0, z: -150, rotationY: -15,
          rotationX: 10, scale: 0.65, autoAlpha: 0.16,
        }, finaleAt));
        tl.to(end, { autoAlpha: 1, y: 0 }, finaleAt + 0.25);
      }
      tl.to({}, { duration: 0.7 }); // Let the last composition hold before releasing the pin.
      tl.progress(0.00001);
      let progress: number | null = null;
      const beforeRefresh = () => {
        progress = tl.scrollTrigger?.isActive ? tl.scrollTrigger.progress : null;
        fit();
        gsap.set(stage, { x: scene.clientWidth * 0.73, y: scene.clientHeight * 0.52 });
      };
      const afterRefresh = () => {
        const trigger = tl.scrollTrigger;
        if (progress !== null && trigger) trigger.scroll(trigger.start + progress * (trigger.end - trigger.start));
        progress = null;
      };
      ScrollTrigger.addEventListener("refreshInit", beforeRefresh);
      ScrollTrigger.addEventListener("refresh", afterRefresh);
      let disposed = false;
      document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
      return () => {
        disposed = true;
        timeline.current = null;
        ScrollTrigger.removeEventListener("refreshInit", beforeRefresh);
        ScrollTrigger.removeEventListener("refresh", afterRefresh);
        element.classList.remove("is-animated");
        scene.removeAttribute("style");
        [intro, ...copies, ...panels, ...(end ? [end] : [])].forEach(node => {
          node.inert = false;
          node.removeAttribute("aria-hidden");
        });
      };
    });
    return () => match.revert();
  }, { scope: root, dependencies: [chapters, finale, viewportsPerChapter, scrub], revertOnUpdate: true });

  const goTo = (index: number) => {
    const tl = timeline.current;
    const trigger = tl?.scrollTrigger;
    if (tl && trigger) {
      const time = index < 0 ? 0 : tl.labels[`chapter-${index}`];
      window.scrollTo({ top: trigger.start + (time / tl.duration()) * (trigger.end - trigger.start), behavior: "smooth" });
    } else {
      document.getElementById(`${id}-${index}`)?.scrollIntoView({ behavior: "auto" });
    }
  };
  return (
    <section ref={root} className={`dwh ${className}`} style={{ ...style, ...(accent ? { "--dwh-accent": accent } : {}) } as CSSProperties} aria-label="Featured work">
      <style>{styles}</style>
      <a className="dwh-skip" href={`#${id}-after`}>Skip animation</a>
      <div className="dwh-viewport">
        <div className="dwh-scene">
          <div className="dwh-intro" id={`${id}--1`}>
            {eyebrow && <p className="dwh-label">{eyebrow}</p>}
            <h1>{title}</h1>
            {description && <div className="dwh-description">{description}</div>}
            {!!visibleChapters.length && <button className="dwh-action" onClick={() => goTo(0)}>See how it flows <span aria-hidden="true">↓</span></button>}
          </div>
          {visibleChapters.map((chapter, i) => (
            <article className="dwh-chapter" key={i} id={`${id}-${i}`}>
              <div className="dwh-copy">
                <p className="dwh-label">{chapter.label}</p>
                <h2>{chapter.title}</h2>
                {chapter.description && <div className="dwh-description">{chapter.description}</div>}
              </div>
              <div className="dwh-stage">
                <div className="dwh-panel" role="group" aria-label={chapter.label}>{chapter.panel}</div>
              </div>
            </article>
          ))}
          {finale && <div className="dwh-finale">{finale}</div>}
          <nav className="dwh-nav" aria-label="Hero chapters">
            <button onClick={() => goTo(-1)}>Overview</button>
            {visibleChapters.map((chapter, i) => <button key={i} onClick={() => goTo(i)}>{chapter.label}</button>)}
          </nav>
          <p className="dwh-hint">Scroll to explore</p>
        </div>
      </div>
      <div id={`${id}-after`} tabIndex={-1} />
    </section>
  );
}

const styles = `
.dwh{--dwh-accent:var(--color-primary,#22dde7);--dwh-bg:#081432;position:relative;width:100%;min-width:0;background:var(--dwh-bg);color:#f2f6fc;font-family:inherit;isolation:isolate}
.dwh *{box-sizing:border-box}
.dwh h1,.dwh h2,.dwh p{margin:0}
.dwh h1,.dwh h2{font-weight:650;letter-spacing:-.055em;line-height:1.06;text-wrap:balance}
.dwh h1{font-size:clamp(42px,7vw,84px)}
.dwh h2{font-size:clamp(34px,5vw,64px)}
.dwh em{color:var(--dwh-accent);font-style:normal}
.dwh .dwh-label{margin-bottom:28px;color:var(--dwh-accent);font:10px ui-monospace,monospace;letter-spacing:.2em;text-transform:uppercase}
.dwh .dwh-description{margin:28px 0;max-width:490px;color:#b9cce7;font-size:17px;line-height:1.65}
.dwh .dwh-action{display:inline-flex;align-items:center;gap:40px;background:#edf5fa;color:#081432;padding:19px 24px;border:0;border-radius:5px;font-size:14px;font-weight:600;text-decoration:none;cursor:pointer}
.dwh button{font-family:inherit}
.dwh :is(a,button):focus-visible{outline:3px solid var(--dwh-accent);outline-offset:5px}
.dwh .dwh-intro,.dwh .dwh-copy,.dwh .dwh-finale{padding:64px 6%}
.dwh:not(.is-animated) .dwh-intro{padding:36px 6% 28px}
.dwh:not(.is-animated) .dwh-label{margin-bottom:16px}
.dwh:not(.is-animated) .dwh-description{margin:18px 0;font-size:15px}
.dwh:not(.is-animated) .dwh-chapter{display:flex;flex-direction:column}
.dwh:not(.is-animated) .dwh-copy{padding:24px 6% 48px}
.dwh:not(.is-animated) .dwh-chapter .dwh-stage{display:block;order:-1}
.dwh:not(.is-animated) .dwh-chapter{scroll-margin-top:16px}
.dwh:not(.is-animated) .dwh-panel{margin:0 6%;overflow:hidden;border-radius:10px;border:1px solid #ffffff26}
.dwh .dwh-finale{text-align:center}
.dwh .dwh-nav,.dwh .dwh-hint{display:none}
.dwh.is-animated .dwh-chapter{display:contents}
.dwh .dwh-skip{position:absolute;left:16px;top:16px;z-index:20;padding:12px;background:#edf5fa;color:#081432;clip-path:inset(50%);width:1px;height:1px;overflow:hidden}
.dwh .dwh-skip:focus{clip-path:none;width:auto;height:auto;overflow:visible}
.dwh.is-animated .dwh-viewport{height:100svh;overflow:hidden;position:relative;background:radial-gradient(ellipse at 0 30%,#10235c88,transparent 75%)}
.dwh.is-animated .dwh-scene{position:absolute;inset:0;transform-origin:top left}
.dwh.is-animated .dwh-intro,.dwh.is-animated .dwh-copy{position:absolute;left:5%;top:46%;transform:translateY(-50%);width:580px;padding:0;z-index:3}
.dwh.is-animated .dwh-copy{width:490px}
.dwh.is-animated h1{font-size:84px}
.dwh.is-animated h2{font-size:64px}
.dwh.is-animated .dwh-stage{position:absolute;left:0;top:0;perspective:1500px;transform-style:preserve-3d}
.dwh.is-animated .dwh-panel{position:absolute;left:0;top:0;width:720px;height:430px;transform-style:preserve-3d;background:#0c1d46;border:1px solid #344c75;border-radius:12px;box-shadow:0 6px 0 #050d20,0 28px 50px #0005;will-change:transform,opacity}
.dwh.is-animated .dwh-finale{position:absolute;left:20%;top:36%;width:60%;padding:0;z-index:4}
.dwh.is-animated .dwh-nav{display:flex;gap:24px;position:absolute;bottom:35px;left:5%;z-index:5}
.dwh .dwh-nav button{border:0;border-bottom:1px solid transparent;padding:8px 0;background:none;color:#a1b5d5;font-size:12px;cursor:pointer}
.dwh .dwh-nav button[aria-current=true]{color:var(--dwh-accent);border-color:currentColor}
.dwh.is-animated .dwh-hint{display:block;position:absolute;bottom:44px;right:5%;color:#a1b5d5;font:9px ui-monospace,monospace;letter-spacing:.15em;text-transform:uppercase}
`;
