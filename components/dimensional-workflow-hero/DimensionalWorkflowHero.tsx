"use client";
import { Fragment, useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MessageSquare, Bot, Check, UserRound, Mail, ShieldCheck, Database, Bell, GitBranch, LayoutGrid, Settings, Play } from "lucide-react";

export type Side = "left" | "right" | "top" | "bottom";

export type IconName =
  | "message-square"
  | "bot"
  | "check"
  | "user-round"
  | "mail"
  | "shield-check"
  | "database"
  | "bell";

export type ChapterStep = { title: string; body: string };

export type DiagramNode = {
  icon: IconName;
  label: string;
  caption: string;
  /** Position inside the canvas, in percent. */
  x: number;
  y: number;
  /** Which chapter step lifts this node. */
  step: number;
  color: string;
};

export type DiagramEdge = { from: number; to: number; out?: Side; in?: Side };

export type WorkflowDiagram = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  note: string;
  gradient?: [string, string, string];
};

export type FinishedSite = {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
};

type ChapterBase = {
  name: string;
  tag: string;
  title: string[];
  description: string;
  color: string;
  steps: ChapterStep[];
  /** Status chip text on the illustrative panel. */
  status: string;
};

export type WorkflowChapter = ChapterBase & {
  kind: "workflow";
  diagram: WorkflowDiagram;
};

/** Database, code, then finished-site scenes. Without `finishedSite`, a neutral page mock is drawn. */
export type BuildChapter = ChapterBase & {
  kind: "build";
  footer: string;
  finishedSite?: FinishedSite;
};

export type Chapter = WorkflowChapter | BuildChapter;

/** Lines joined by line breaks; `emphasis` is the substring rendered in the accent color. */
export type EmphasisText = { lines: string[]; emphasis?: string };

export type ScrollExperienceContent = {
  ariaLabel: string;
  skip: { label: string; target: string };
  intro: {
    eyebrow: string;
    title: EmphasisText;
    description: string[];
    cta: string;
  };
  chapters: Chapter[];
  finale: {
    eyebrow: string;
    title: EmphasisText;
    cta: { label: string; href: string };
  };
  navLabel: string;
  footer: { disclaimer: string; simplifyLabel: string; scrollHint: string };
};

export type ScrollExperienceMotion = {
  /** Scroll distance per chapter, in viewport heights. Default 1.35. */
  viewportsPerChapter?: number;
  /** Cap on the scroll distance per chapter in px, so tall screens need no extra wheel turns. Default 1350. */
  maxChapterScroll?: number;
  scrub?: number;
};

const heroStyles = "/*\n * Dimensional workflow scroll hero.\n * Token references carry fallbacks so the component renders without the site's tokens.css.\n */\n.af-experience {\n  font-family: var(--font-hero-body, \"Inter\", sans-serif);\n  color: var(--color-hero-ink, oklch(97% 0.008 240));\n  background: #06122d;\n  font-synthesis: none;\n  --mint: var(--color-hero-accent, var(--color-primary, oklch(83% 0.15 195)));\n}\n.af-experience * {\n  box-sizing: border-box;\n}\n.af-experience a {\n  color: inherit;\n  text-decoration: none;\n}\n.af-experience button {\n  font: inherit;\n  color: inherit;\n  cursor: pointer;\n  border: 0;\n}\n.af-experience button,\n.af-experience a {\n  -webkit-tap-highlight-color: transparent;\n}\n.af-experience button:focus-visible,\n.af-experience a:focus-visible {\n  outline: 2px solid var(--mint);\n  outline-offset: 6px;\n}\n.af-experience svg {\n  width: 20px;\n  height: 20px;\n  stroke-width: 1.6;\n}\n.af-experience .skip {\n  position: fixed;\n  top: -100px;\n  left: 20px;\n  background: #fff;\n  color: #000;\n  padding: 15px;\n  z-index: 100;\n}\n.af-experience .skip:focus {\n  top: 10px;\n}\n\n/* Stage */\n.af-experience .viewport {\n  height: 100svh;\n  min-height: 650px;\n  position: relative;\n  overflow: hidden;\n}\n.af-experience .ambient {\n  position: absolute;\n  inset: 0;\n  background:\n    radial-gradient(ellipse at 77% 61%, #166bff22, transparent 55%),\n    linear-gradient(135deg, #0b1d5a 0%, #06122d 60%);\n  pointer-events: none;\n}\n\n/* Intro and shared type */\n.af-experience .intro {\n  position: absolute;\n  left: 6%;\n  top: 22%;\n  z-index: 5;\n  max-width: 630px;\n}\n.af-experience .eyebrow {\n  font-family: var(--font-hero-mono, \"JetBrains Mono\", monospace);\n  font-size: 10px;\n  font-weight: 600;\n  letter-spacing: 2px;\n  color: #98adb9;\n  margin: 0 0 24px;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.af-experience .eyebrow > span {\n  width: 6px;\n  height: 6px;\n  background: var(--mint);\n  border-radius: 50%;\n}\n.af-experience h1,\n.af-experience h2,\n.af-experience h3,\n.af-experience p {\n  margin-top: 0;\n}\n.af-experience h1 {\n  font:\n    500 clamp(52px, 5.8vw, 90px) / 1.055 var(--font-hero-display, \"Outfit\", \"Inter\", sans-serif);\n  letter-spacing: -5px;\n  margin-bottom: 25px;\n}\n.af-experience h1 em {\n  font-style: normal;\n  color: var(--mint);\n}\n.af-experience p {\n  line-height: 1.65;\n}\n.af-experience .intro-description {\n  font-size: 16px;\n  color: #b4c9ea;\n  margin-bottom: 28px;\n}\n.af-experience .primary {\n  display: inline-flex;\n  align-items: center;\n  gap: 36px;\n  padding: 16px 23px;\n  border-radius: 6px;\n  background: var(--color-hero-action, oklch(97% 0.008 240));\n  color: var(--color-hero-action-ink, oklch(18% 0.045 260));\n  font-size: 13px;\n  font-weight: 600;\n}\n.af-experience .primary:hover {\n  background: var(--color-hero-action-hover, oklch(88% 0.12 195));\n}\n.af-experience .primary span {\n  font-size: 19px;\n}\n\n/* 3D stage and panels */\n.af-experience .stage {\n  position: absolute;\n  left: 70%;\n  top: 44%;\n  width: 800px;\n  height: 500px;\n  transform: translate(-50%, -50%);\n  perspective: 1500px;\n  z-index: 3;\n  pointer-events: none;\n}\n.af-experience .service-chapter:nth-child(1) .stage {\n  z-index: 5;\n}\n.af-experience .service-chapter:nth-child(2) .stage {\n  z-index: 4;\n}\n.af-experience .service-chapter:nth-child(3) .stage {\n  z-index: 3;\n}\n.af-experience .world {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  transform-style: preserve-3d;\n}\n.af-experience .flow-panel {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: 800px;\n  height: 470px;\n  background: #0b1d5a;\n  border: 1px solid #ffffff26;\n  border-radius: 15px;\n  transform-style: preserve-3d;\n  box-shadow:\n    0 2px 0 #6c7b8355,\n    0 9px 0 #060c11,\n    0 10px 0 #ffffff1a,\n    0 45px 80px #000a;\n  --accent: #22dde7;\n}\n.af-experience .panel-top {\n  height: 55px;\n  border-bottom: 1px solid #ffffff1a;\n  display: flex;\n  align-items: center;\n  padding: 0 22px;\n  gap: 12px;\n  background: linear-gradient(#132866, #0b1d5a);\n  border-radius: 14px 14px 0 0;\n}\n.af-experience .panel-top strong {\n  font-size: 13px;\n  font-weight: 500;\n}\n.af-experience .panel-mark {\n  color: var(--accent);\n  display: flex;\n}\n.af-experience .panel-status {\n  margin-left: auto;\n  font-size: 10px;\n  color: #b6c3cb;\n  background: #06122d80;\n  padding: 6px 10px;\n  border: 1px solid #ffffff26;\n  border-radius: 5px;\n}\n.af-experience .panel-status b {\n  display: inline-block;\n  width: 5px;\n  height: 5px;\n  background: var(--accent);\n  border-radius: 50%;\n  margin-right: 7px;\n}\n.af-experience .panel-menu {\n  font-size: 25px;\n  margin-left: 12px;\n}\n.af-experience .panel-body {\n  height: 370px;\n  display: flex;\n  transform-style: preserve-3d;\n}\n.af-experience .rail {\n  width: 47px;\n  flex-shrink: 0;\n  border-right: 1px solid #ffffff1a;\n  padding: 23px 14px;\n  display: flex;\n  flex-direction: column;\n  gap: 28px;\n  color: #748b99;\n  background: #0b1d5a;\n}\n.af-experience .rail svg {\n  width: 17px;\n  height: 17px;\n}\n.af-experience .rail > svg:nth-child(2) {\n  color: var(--accent);\n}\n.af-experience .rail span {\n  flex: 1;\n}\n.af-experience .panel-bottom {\n  height: 44px;\n  display: flex;\n  gap: 16px;\n  align-items: center;\n  padding: 0 18px;\n  color: #9bb0bd;\n  font-size: 9px;\n  border-top: 1px solid #ffffff1a;\n}\n.af-experience .panel-bottom > span {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.af-experience .panel-bottom svg {\n  width: 13px;\n  height: 13px;\n  color: var(--accent);\n}\n.af-experience .panel-bottom > span:nth-child(2) {\n  margin-left: auto;\n}\n.af-experience .run-mark {\n  border: 1px solid #36584e;\n  border-radius: 4px;\n  padding: 5px;\n}\n\n/* Workflow canvas: color lives in the workflow while the surrounding page stays restrained. */\n.af-experience .canvas {\n  position: relative;\n  flex: 1;\n  background-color: #09183e;\n  background-image: radial-gradient(#31557a 1px, transparent 1px);\n  background-size: 18px 18px;\n  transform-style: preserve-3d;\n}\n.af-experience .canvas-caption {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 20px 24px;\n  font-size: 9px;\n  letter-spacing: 1.3px;\n  color: #a7bac7;\n}\n.af-experience .canvas-caption svg {\n  width: 13px;\n  height: 13px;\n}\n.af-experience .connections {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  overflow: visible;\n  fill: none;\n  stroke: var(--accent);\n  stroke-width: 1.6;\n}\n.af-experience .connections .main-wire {\n  stroke-width: 2.4;\n  stroke-linecap: round;\n}\n.af-experience .connections .signal {\n  stroke: #edfff8;\n  stroke-dasharray: 6 140;\n  stroke-width: 2.8;\n}\n.af-experience .nodes {\n  position: absolute;\n  inset: 0;\n  transform-style: preserve-3d;\n}\n.af-experience .node {\n  position: absolute;\n  display: block;\n  width: 150px;\n  height: 91px;\n  border: 0;\n  border-radius: 9px;\n  transform-style: preserve-3d;\n}\n.af-experience .node-face {\n  position: absolute;\n  inset: 0;\n  border: 1.5px solid var(--node-color);\n  border-radius: 9px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  background: linear-gradient(145deg, color-mix(in srgb, var(--node-color) 20%, #13202a), #111b25);\n  box-shadow:\n    0 6px 0 #060b0e,\n    0 0 18px color-mix(in srgb, var(--node-color) 15%, transparent);\n  transform-style: preserve-3d;\n}\n/* Lifted shadow, faded in by opacity so the lift never animates box-shadow. */\n.af-experience .node-glow {\n  position: absolute;\n  inset: -1.5px;\n  border-radius: inherit;\n  box-shadow:\n    0 18px 35px #0009,\n    0 0 24px #ffffff25;\n  opacity: 0;\n  pointer-events: none;\n}\n.af-experience .node-icon {\n  color: var(--node-color);\n  margin-bottom: 5px;\n  filter: drop-shadow(0 0 7px color-mix(in srgb, var(--node-color) 45%, transparent));\n}\n.af-experience .node-icon svg {\n  width: 23px;\n  height: 23px;\n}\n.af-experience .node strong {\n  font-size: 12px;\n  font-weight: 550;\n  color: #f4f8ff;\n}\n.af-experience .node small {\n  font-size: 7px;\n  letter-spacing: 1.5px;\n  margin-top: 5px;\n  color: #adbdce;\n}\n.af-experience .port {\n  position: absolute;\n  top: 50%;\n  width: 7px;\n  height: 7px;\n  background: #ed83d6;\n  border-radius: 50%;\n  box-shadow: 0 0 9px #ed83d666;\n  z-index: 2;\n}\n.af-experience .port.left {\n  left: -4px;\n}\n.af-experience .port.right {\n  right: -4px;\n}\n.af-experience .port.top {\n  top: -4px;\n  left: calc(50% - 3.5px);\n}\n.af-experience .port.bottom {\n  top: auto;\n  bottom: -4px;\n  left: 50%;\n  margin-left: -3.5px;\n  transform: none;\n}\n.af-experience .port[hidden] {\n  display: none;\n}\n.af-experience .diagram-note {\n  position: absolute;\n  bottom: 8px;\n  left: 5%;\n  margin: 0;\n  font-size: 8px;\n  letter-spacing: 1.2px;\n  color: #91aabd;\n}\n\n/* Build chapter: database, code, finished site */\n.af-experience .development-panel {\n  overflow: hidden;\n}\n.af-experience .build-scenes {\n  position: relative;\n  height: 370px;\n  background: #09183e;\n}\n.af-experience .build-scene {\n  position: absolute;\n  inset: 0;\n  padding: 24px 30px;\n  background: #09183e;\n  overflow: hidden;\n}\n.af-experience .build-scene:not(:first-child) {\n  visibility: hidden;\n}\n.af-experience .build-label {\n  display: flex;\n  justify-content: space-between;\n  font-family: var(--font-hero-mono, \"JetBrains Mono\", monospace);\n  font-size: 10px;\n  letter-spacing: 1.6px;\n  color: #1fa9ff;\n  margin-bottom: 24px;\n}\n.af-experience .build-label span {\n  color: #a9bfde;\n  font-size: 9px;\n  letter-spacing: 0.5px;\n}\n.af-experience .data-scene h3 {\n  font-size: 24px;\n  font-weight: 500;\n  margin: 0 0 24px;\n  letter-spacing: -0.5px;\n}\n.af-experience .db-toolbar {\n  padding: 12px 16px;\n  background: #132866;\n  display: flex;\n  justify-content: space-between;\n  font-size: 12px;\n  border: 1px solid #ffffff26;\n}\n.af-experience .db-toolbar span {\n  color: #9ab0c3;\n  font-size: 10px;\n}\n.af-experience .data-scene table {\n  width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n  font: 12px monospace;\n}\n.af-experience .data-scene th,\n.af-experience .data-scene td {\n  padding: 13px 16px;\n  border: 1px solid #ffffff1a;\n}\n.af-experience .data-scene th {\n  color: #bdcdda;\n  background: #0b1d5a;\n}\n.af-experience .data-scene th small {\n  font-weight: 400;\n  color: #8298ac;\n  margin-left: 8px;\n}\n.af-experience .data-scene td b {\n  font-size: 10px;\n  color: var(--mint);\n  font-weight: 400;\n}\n.af-experience .build-note {\n  font-size: 11px;\n  color: #94aabc;\n  margin: 20px 0 0;\n}\n.af-experience .code-scene {\n  padding-top: 18px;\n}\n.af-experience .code-scene .build-label {\n  margin-bottom: 16px;\n}\n.af-experience .code-tab {\n  font-size: 12px;\n  padding-bottom: 10px;\n  border-bottom: 1px solid #ffffff26;\n  color: #dce6ed;\n}\n.af-experience .code-tab span {\n  float: right;\n  font-size: 10px;\n  color: #8da2b3;\n}\n.af-experience .code-scene pre {\n  font:\n    13px / 1.55 Consolas,\n    monospace;\n  margin: 12px 0;\n  color: #d1dfea;\n}\n.af-experience .code-purple {\n  color: #93baff;\n}\n.af-experience .code-blue {\n  color: #69bfff;\n}\n.af-experience .code-mint {\n  color: var(--mint);\n}\n.af-experience .code-gold {\n  color: #ffc66c;\n}\n.af-experience .frontend-scene {\n  padding: 0;\n}\n.af-experience .frontend-scene .build-label {\n  height: 35px;\n  margin: 0;\n  padding: 12px 18px;\n}\n.af-experience .frontend-scene img {\n  width: 100%;\n  height: 335px;\n  object-fit: contain;\n  background: #030b0e;\n}\n/* Neutral finished-site placeholder, used when no screenshot is supplied. */\n.af-experience .site-mock {\n  height: 335px;\n  padding: 18px 22px;\n  background: #030b0e;\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.af-experience .site-mock-nav {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.af-experience .site-mock-nav i {\n  width: 18px;\n  height: 18px;\n  border-radius: 5px;\n  background: var(--mint);\n}\n.af-experience .site-mock-nav span {\n  width: 44px;\n  height: 6px;\n  border-radius: 3px;\n  background: #ffffff26;\n}\n.af-experience .site-mock-nav span:first-of-type {\n  margin-left: auto;\n}\n.af-experience .site-mock-hero {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  gap: 10px;\n  padding: 0 6%;\n  border-radius: 8px;\n  background: linear-gradient(120deg, #0b1d5a, #06122d);\n}\n.af-experience .site-mock-hero span {\n  width: 55%;\n  height: 14px;\n  border-radius: 4px;\n  background: #ffffffd9;\n}\n.af-experience .site-mock-hero span:nth-child(2) {\n  width: 40%;\n}\n.af-experience .site-mock-hero span:nth-child(3) {\n  width: 48%;\n  height: 8px;\n  background: #ffffff40;\n}\n.af-experience .site-mock-hero b {\n  width: 110px;\n  height: 26px;\n  margin-top: 8px;\n  border-radius: 6px;\n  background: var(--mint);\n}\n.af-experience .site-mock-cards {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n}\n.af-experience .site-mock-cards span {\n  height: 52px;\n  border-radius: 6px;\n  background: #ffffff12;\n  border: 1px solid #ffffff1a;\n}\n\n/* Chapter copy: React owns chapter layout in both modes, no DOM reparenting on resize. */\n.af-experience .chapter-copy,\n.af-experience .service-chapter {\n  display: contents;\n}\n.af-experience .flow-copy {\n  position: absolute;\n  top: 16%;\n  right: auto;\n  bottom: auto;\n  left: 6%;\n  width: 29%;\n}\n.af-experience .flow-copy .eyebrow {\n  color: var(--accent);\n  font-size: 9px;\n}\n.af-experience .flow-copy h2 {\n  font:\n    500 clamp(30px, 2.8vw, 43px) / 1.15 var(--font-hero-display, \"Outfit\", \"Inter\", sans-serif);\n  letter-spacing: -1.7px;\n  margin-bottom: 18px;\n}\n.af-experience .flow-copy h2 span {\n  font: inherit;\n  letter-spacing: inherit;\n}\n.af-experience .flow-description {\n  font-size: 14px;\n  color: #b4c9ea;\n  max-width: 360px;\n}\n.af-experience .flow-copy ol {\n  list-style: none;\n  padding: 0;\n  margin: 18px 0 0;\n}\n.af-experience .flow-copy li {\n  display: flex;\n  gap: 14px;\n  padding: 9px 0;\n  border-top: 1px solid #ffffff0f;\n  opacity: 0.65;\n}\n.af-experience .flow-copy li > span {\n  font-size: 10px;\n  color: var(--accent);\n  padding-top: 3px;\n}\n.af-experience .flow-copy li h3 {\n  font-size: 13px;\n  font-weight: 500;\n  margin-bottom: 3px;\n}\n.af-experience .flow-copy li p {\n  font-size: 11px;\n  color: #a3b5c1;\n  line-height: 1.5;\n  margin: 0;\n  max-width: 300px;\n}\n\n/* Chapter navigation and footer */\n.af-experience .chapter-nav {\n  position: absolute;\n  bottom: 90px;\n  left: 6%;\n  right: 6%;\n  display: flex;\n  gap: 36px;\n  z-index: 12;\n}\n.af-experience .chapter-nav button {\n  background: none;\n  text-align: left;\n  border-top: 1px solid #ffffff26;\n  padding: 18px 0 10px;\n  position: relative;\n  font-size: 12px;\n  color: #9fb0bc;\n  flex: 1;\n}\n.af-experience .chapter-nav button i {\n  position: absolute;\n  left: 0;\n  top: -1px;\n  height: 2px;\n  width: 0;\n  background: var(--mint);\n  transition: width 0.35s;\n}\n.af-experience .chapter-nav button.active {\n  color: #fff;\n}\n.af-experience .chapter-nav button.active i {\n  width: 100%;\n}\n.af-experience .chapter-nav button:hover {\n  color: #fff;\n}\n.af-experience .experience-footer {\n  position: absolute;\n  bottom: 30px;\n  left: 6%;\n  right: 6%;\n  display: flex;\n  align-items: center;\n  gap: 25px;\n  font-size: 8px;\n  letter-spacing: 1px;\n  color: #69818f;\n  z-index: 12;\n}\n.af-experience .motion-toggle {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  background: none;\n  font-size: 10px;\n  color: #a0b1bc;\n  padding: 7px;\n  letter-spacing: 0;\n  margin-left: auto;\n}\n.af-experience .motion-toggle::before {\n  content: \"\";\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  border: 1px solid currentColor;\n}\n.af-experience .motion-toggle[aria-pressed=\"true\"] {\n  color: var(--mint);\n}\n.af-experience .motion-toggle[aria-pressed=\"true\"]::before {\n  background: currentColor;\n}\n.af-experience .scroll-hint {\n  color: #a5b8c4;\n}\n.af-experience .scroll-hint b {\n  font-size: 18px;\n  margin-left: 14px;\n}\n\n/* Finale */\n.af-experience .flow-finale {\n  position: absolute;\n  inset: 0;\n  z-index: 10;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  padding: 70px 5%;\n  opacity: 0;\n  visibility: hidden;\n  pointer-events: none;\n}\n.af-experience .flow-finale a {\n  pointer-events: auto;\n}\n/* Scrim behind the finale copy so the pulled-back panels never compete with the headline. */\n.af-experience .flow-finale::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  z-index: -1;\n  background: radial-gradient(ellipse 50% 42% at 50% 50%, #081536e6 0%, #08153699 55%, transparent 100%);\n  pointer-events: none;\n}\n.af-experience.simple .flow-finale::before {\n  display: none;\n}\n.af-experience .flow-finale .eyebrow {\n  color: var(--mint);\n  justify-content: center;\n  font-size: 9px;\n  margin-bottom: 23px;\n}\n.af-experience .flow-finale h2 {\n  font:\n    500 clamp(40px, 5.4vw, 82px) / 1.05 var(--font-hero-display, \"Outfit\", \"Inter\", sans-serif);\n  letter-spacing: -0.055em;\n  margin: 0 0 36px;\n}\n.af-experience .flow-finale h2 em {\n  font-style: normal;\n  color: var(--mint);\n}\n.af-experience .flow-finale .primary {\n  pointer-events: auto;\n  gap: 48px;\n  padding: 17px 24px;\n}\n\n@media (min-width: 1600px) {\n  .af-experience .stage {\n    width: 900px;\n  }\n  .af-experience .flow-panel {\n    width: 850px;\n  }\n  .af-experience .intro {\n    top: 25%;\n  }\n}\n@media (max-width: 1100px) {\n  .af-experience h1 {\n    letter-spacing: -3px;\n    font-size: 62px;\n  }\n  .af-experience .stage {\n    left: 76%;\n  }\n  .af-experience .intro {\n    max-width: 500px;\n  }\n  .af-experience .flow-description {\n    font-size: 12px;\n  }\n}\n@media (max-width: 900px) {\n  .af-experience .intro h1 {\n    font-size: clamp(43px, 8vw, 72px);\n  }\n  .af-experience .flow-description {\n    font-size: 15px;\n    max-width: 550px;\n  }\n  .af-experience .flow-copy ol {\n    display: flex;\n    gap: 20px;\n  }\n  .af-experience .flow-copy li {\n    flex: 1;\n    display: block;\n  }\n  .af-experience .flow-copy li > span {\n    display: block;\n    margin-bottom: 10px;\n  }\n  .af-experience .flow-copy li p {\n    font-size: 12px;\n  }\n  .af-experience .experience-footer {\n    letter-spacing: 0.2px;\n  }\n}\n@media (max-width: 540px) {\n  .af-experience .intro-description {\n    font-size: 14px;\n  }\n  .af-experience .intro h1 {\n    letter-spacing: -2px;\n  }\n  .af-experience .flow-copy h2 {\n    letter-spacing: -1.2px;\n  }\n  .af-experience .flow-copy ol {\n    display: block;\n  }\n  .af-experience .flow-copy li {\n    display: flex;\n    gap: 12px;\n  }\n  .af-experience .flow-copy li p {\n    max-width: none;\n  }\n  .af-experience .experience-footer {\n    left: 6%;\n    right: 6%;\n    gap: 8px;\n  }\n  .af-experience .demo-label {\n    font-size: 6px;\n    max-width: 180px;\n  }\n  .af-experience .flow-finale .eyebrow {\n    font-size: 8px;\n    letter-spacing: 1.3px;\n  }\n  .af-experience .flow-finale h2 {\n    letter-spacing: -1.8px;\n  }\n}\n/* The toggle only means something where the scroll animation can run. */\n@media (max-width: 900px), (max-height: 649px), (prefers-reduced-motion: reduce) {\n  .af-experience .motion-toggle {\n    display: none;\n  }\n}\n\n/* Static layout: small screens, reduced motion, or the visitor's own choice. */\n.af-experience.simple .viewport {\n  height: auto;\n  min-height: 0;\n  overflow: hidden;\n  padding-bottom: 100px;\n}\n.af-experience.simple .ambient {\n  height: 100%;\n}\n.af-experience.simple .intro {\n  position: relative;\n  left: auto;\n  top: auto;\n  padding: 160px 6% 50px;\n  max-width: none;\n}\n.af-experience.simple .chapter-copy {\n  display: block;\n  position: relative;\n  left: auto;\n  top: auto;\n  width: auto;\n  padding: 0 6%;\n  z-index: 8;\n}\n.af-experience.simple .service-chapter {\n  position: relative;\n  display: block;\n  padding: 60px 0;\n  border-top: 1px solid #ffffff1a;\n  scroll-margin-top: 100px;\n}\n.af-experience.simple .flow-copy {\n  position: relative;\n  left: auto;\n  top: auto;\n  width: 100%;\n  max-width: 650px;\n  margin-bottom: 35px;\n}\n/* GSAP may leave inline opacity/transform mid-transition when the layout switches; static must win. */\n.af-experience.simple .intro,\n.af-experience.simple .flow-copy {\n  opacity: 1 !important;\n  visibility: visible !important;\n  transform: none !important;\n}\n.af-experience.simple .flow-copy li {\n  opacity: 1 !important;\n}\n.af-experience.simple .stage {\n  display: block;\n  position: relative;\n  left: auto;\n  top: auto;\n  width: 100%;\n  height: auto;\n  transform: none !important;\n  perspective: none;\n}\n.af-experience.simple .world {\n  height: auto;\n  transform-style: flat;\n}\n.af-experience.simple .flow-panel {\n  position: relative;\n  left: auto;\n  top: auto;\n  width: 800px;\n  height: 470px;\n  transform: none;\n  zoom: var(--panel-scale, 1);\n}\n.af-experience.simple .development-panel {\n  height: auto;\n}\n.af-experience.simple .build-scenes {\n  height: auto;\n}\n.af-experience.simple .build-scene {\n  position: relative;\n  visibility: visible !important;\n  opacity: 1 !important;\n  transform: none !important;\n  min-height: 370px;\n  border-bottom: 1px solid #ffffff26;\n}\n.af-experience.simple .frontend-scene {\n  min-height: 0;\n}\n.af-experience.simple .chapter-nav,\n.af-experience.simple .scroll-hint {\n  display: none;\n}\n.af-experience.simple .experience-footer {\n  bottom: 25px;\n}\n.af-experience.simple .flow-finale {\n  position: relative;\n  inset: auto;\n  opacity: 1 !important;\n  visibility: visible !important;\n  transform: none !important;\n  padding: 85px 6% 35px;\n}\n.af-experience.simple .flow-finale h2 {\n  font-size: clamp(36px, 6vw, 70px);\n}\n@media (min-width: 901px) {\n  .af-experience.simple .service-chapter {\n    display: grid;\n    grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);\n    gap: 40px;\n    align-items: start;\n  }\n  .af-experience.simple .stage {\n    min-width: 0;\n  }\n}\n@media (max-width: 900px) {\n  .af-experience.simple .flow-copy h2 {\n    font-size: 36px;\n  }\n  .af-experience.simple .service-chapter {\n    padding: 45px 0;\n  }\n}\n/* Zoomed-down static panels: counter-scale node labels so they stay readable (about 8px rendered). */\n.af-experience.simple .node strong {\n  font-size: max(12px, calc(8px / var(--panel-scale, 1)));\n  line-height: 1.05;\n  text-align: center;\n  padding: 0 8px;\n}\n@media (max-width: 540px) {\n  .af-experience.simple .intro {\n    padding-top: 140px;\n  }\n  .af-experience.simple .node small {\n    display: none;\n  }\n  .af-experience.simple .flow-copy h2 {\n    font-size: 32px;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  html:has(.af-experience) {\n    scroll-behavior: auto !important;\n  }\n  .af-experience *,\n  .af-experience *::before,\n  .af-experience *::after {\n    scroll-behavior: auto !important;\n    transition: none !important;\n  }\n}\n";

const icons: Record<IconName, typeof MessageSquare> = {
  "message-square": MessageSquare,
  bot: Bot,
  check: Check,
  "user-round": UserRound,
  mail: Mail,
  "shield-check": ShieldCheck,
  database: Database,
  bell: Bell,
};

const DEFAULT_GRADIENT: [string, string, string] = ["#55baff", "#b18aff", "#55e2a0"];

function WorkflowPanel({ chapter }: { chapter: WorkflowChapter }) {
  const canvas = useRef<HTMLDivElement>(null);
  const wire = useRef<SVGPathElement>(null);
  const signal = useRef<SVGPathElement>(null);
  const gradientId = `flow-gradient-${useId().replace(/:/g, "")}`;
  const { diagram } = chapter;
  const [g0, g1, g2] = diagram.gradient ?? DEFAULT_GRADIENT;

  useLayoutEffect(() => {
    const root = canvas.current!;
    const update = () => {
      const nodes = [...root.querySelectorAll<HTMLElement>(".node")];
      const point = (i: number, side: string) => {
        const n = nodes[i];
        return {
          x:
            n.offsetLeft +
            (side === "right" ? n.offsetWidth : side === "left" ? 0 : n.offsetWidth / 2),
          y:
            n.offsetTop +
            (side === "bottom" ? n.offsetHeight : side === "top" ? 0 : n.offsetHeight / 2),
        };
      };
      const d = diagram.edges
        .map(({ from, to, out = "right", in: input = "left" }) => {
          const a = point(from, out),
            b = point(to, input);
          return out === "bottom"
            ? `M${a.x} ${a.y} C${a.x} ${(a.y + b.y) / 2},${b.x} ${(a.y + b.y) / 2},${b.x} ${b.y}`
            : `M${a.x} ${a.y} C${(a.x + b.x) / 2} ${a.y},${(a.x + b.x) / 2} ${b.y},${b.x} ${b.y}`;
        })
        .join(" ");
      wire.current?.setAttribute("d", d);
      signal.current?.setAttribute("d", d);
    };
    const observer = new ResizeObserver(update);
    observer.observe(root);
    update();
    return () => observer.disconnect();
  }, [diagram]);

  return (
    <>
      <div className="panel-top">
        <span className="panel-mark">
          <GitBranch />
        </span>
        <strong>{chapter.name}</strong>
        <span className="panel-status">
          <b />
          Example flow
        </span>
        <span className="panel-menu">···</span>
      </div>
      <div className="panel-body">
        <aside className="rail">
          <LayoutGrid />
          <GitBranch />
          <MessageSquare />
          <span />
          <Settings />
        </aside>
        <div className="canvas" ref={canvas}>
          <div className="canvas-caption">
            <GitBranch />
            {chapter.tag}
          </div>
          <svg className="connections">
            <defs>
              <linearGradient id={gradientId}>
                <stop stopColor={g0} />
                <stop offset=".5" stopColor={g1} />
                <stop offset="1" stopColor={g2} />
              </linearGradient>
            </defs>
            <path className="main-wire" ref={wire} stroke={`url(#${gradientId})`} />
            <path className="signal" ref={signal} />
          </svg>
          <div className="nodes">
            {diagram.nodes.map((node, i) => {
              const Icon = icons[node.icon] ?? GitBranch;
              return (
                <div
                  className={`node node-${i}`}
                  data-step={node.step}
                  key={node.label}
                  style={
                    {
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      "--node-color": node.color,
                    } as CSSProperties
                  }
                >
                  <div className="node-face">
                    <span className="node-glow" />
                    <div className="node-icon">
                      <Icon />
                    </div>
                    <strong>{node.label}</strong>
                    <small>{node.caption}</small>
                  </div>
                  {(["left", "right", "top", "bottom"] as const).map((side) => (
                    <span
                      key={side}
                      className={`port ${side}`}
                      hidden={
                        !diagram.edges.some(
                          ({ from, to, out = "right", in: input = "left" }) =>
                            (from === i && out === side) || (to === i && input === side),
                        )
                      }
                    />
                  ))}
                </div>
              );
            })}
          </div>
          <p className="diagram-note">{diagram.note}</p>
        </div>
      </div>
      <div className="panel-bottom">
        <span>
          <ShieldCheck />
          {chapter.status}
        </span>
        <span>Designed with human control</span>
        <span className="run-mark">
          <Play />
        </span>
      </div>
    </>
  );
}

function DevelopmentPanel({ chapter }: { chapter: BuildChapter }) {
  const site = chapter.finishedSite;
  return (
    <>
      <div className="panel-top">
        <strong>{chapter.name}</strong>
        <span className="panel-status">{chapter.status}</span>
      </div>
      <div className="build-scenes">
        <section className="build-scene data-scene">
          <div className="build-label">
            {"01 / DATABASE "}
            <span>{"Illustrative project schema"}</span>
          </div>
          <h3>{"A foundation for the product."}</h3>
          <div className="db-toolbar">
            <b>{"pages"}</b>
            <span>{"3 records · public schema"}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>
                  {"id "}
                  <small>{"uuid"}</small>
                </th>
                <th>
                  {"slug "}
                  <small>{"text"}</small>
                </th>
                <th>
                  {"title "}
                  <small>{"text"}</small>
                </th>
                <th>
                  {"status "}
                  <small>{"text"}</small>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"page_001"}</td>
                <td>{"/"}</td>
                <td>{"Home"}</td>
                <td>
                  <b>{"published"}</b>
                </td>
              </tr>
              <tr>
                <td>{"page_002"}</td>
                <td>{"/calculator"}</td>
                <td>{"Calculator"}</td>
                <td>
                  <b>{"published"}</b>
                </td>
              </tr>
              <tr>
                <td>{"page_003"}</td>
                <td>{"/dashboard"}</td>
                <td>{"Dashboard"}</td>
                <td>
                  <b>{"published"}</b>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="build-note">{"Organized content. Clear relationships. Room to grow."}</p>
        </section>
        <section className="build-scene code-scene">
          <div className="build-label">
            {"02 / APPLICATION "}
            <span>{"Illustrative React component"}</span>
          </div>
          <div className="code-tab">
            {"Page.tsx "}
            <span>{"TypeScript / React"}</span>
          </div>
          <pre>
            <code>
              <span className="code-purple">{"type"}</span>
              {" Page = {\n  title: "}
              <span className="code-blue">{"string"}</span>
              {";\n  description: "}
              <span className="code-blue">{"string"}</span>
              {";\n};\n\n"}
              <span className="code-purple">{"export default function"}</span>{" "}
              <span className="code-mint">{"Hero"}</span>
              {"({ page }: { page: Page }) {\n  "}
              <span className="code-purple">{"return"}</span>
              {" (\n    <"}
              <span className="code-mint">{"section"}</span>
              {" className="}
              <span className="code-gold">{'"hero"'}</span>
              {">\n      <"}
              <span className="code-mint">{"h1"}</span>
              {">{page.title}</"}
              <span className="code-mint">{"h1"}</span>
              {">\n      <"}
              <span className="code-mint">{"p"}</span>
              {">{page.description}</"}
              <span className="code-mint">{"p"}</span>
              {">\n    </"}
              <span className="code-mint">{"section"}</span>
              {">\n  );\n}"}
            </code>
          </pre>
        </section>
        <section className="build-scene frontend-scene">
          <div className="build-label">
            {"03 / FINISHED WEBSITE "}
            <span>{site?.label ?? "Your finished site"}</span>
          </div>
          {site ? (
            <img src={site.src} alt={site.alt} width={site.width} height={site.height} />
          ) : (
            <div className="site-mock">
              <div className="site-mock-nav">
                <i />
                <span />
                <span />
                <span />
              </div>
              <div className="site-mock-hero">
                <span />
                <span />
                <span />
                <b />
              </div>
              <div className="site-mock-cards">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </section>
      </div>
      <div className="panel-bottom">{chapter.footer}</div>
    </>
  );
}

// Neutral demo content. All database, code and workflow scenes are illustrative.
export const defaultHeroContent: ScrollExperienceContent = {
  ariaLabel: "Explore our three services",
  skip: { label: "Skip animated demonstration", target: "#examples" },
  intro: {
    eyebrow: "BUILT AROUND YOUR BUSINESS",
    title: { lines: ["Less busywork.", "More possibility."], emphasis: "possibility." },
    description: [
      "Your conversations, tools, and next steps.",
      "Connected into a flow that works for you.",
    ],
    cta: "See how it flows",
  },
  chapters: [
    {
      kind: "workflow",
      name: "Your own chatbot",
      tag: "CUSTOMER CONVERSATIONS",
      title: ["A helpful answer.", "A human when it matters."],
      description:
        "Give customers a place to ask. Connect answers to your business knowledge, with a clear path to your team.",
      color: "#22dde7",
      steps: [
        { title: "Customer asks", body: "A question comes in through your website." },
        {
          title: "Your AI assistant",
          body: "Uses your approved information to find a relevant answer.",
        },
        {
          title: "Answer or hand off",
          body: "Responds to the customer, or passes the conversation to your team.",
        },
      ],
      status: "Knowledge connected",
      diagram: {
        nodes: [
          { icon: "message-square", label: "Customer asks", caption: "WEBSITE CHAT", x: 5, y: 34, step: 0, color: "#55baff" },
          { icon: "bot", label: "AI assistant", caption: "APPROVED KNOWLEDGE", x: 35, y: 34, step: 1, color: "#b18aff" },
          { icon: "check", label: "Send answer", caption: "ANSWER FOUND", x: 74, y: 17, step: 2, color: "#55e2a0" },
          { icon: "user-round", label: "Human handoff", caption: "NEEDS YOUR TEAM", x: 74, y: 57, step: 2, color: "#ffc66c" },
        ],
        edges: [
          { from: 0, to: 1 },
          { from: 1, to: 2 },
          { from: 1, to: 3 },
        ],
        note: "ONE CONVERSATION · TWO POSSIBLE OUTCOMES",
      },
    },
    {
      kind: "workflow",
      name: "Connected workflows",
      tag: "EVERYDAY OPERATIONS",
      title: ["One request.", "All the right next steps."],
      description:
        "Turn the copy-and-paste between tools into a connected process. Keep approvals where they belong.",
      color: "#1fa9ff",
      steps: [
        { title: "Inquiry arrives", body: "An email or form starts the workflow." },
        { title: "Validate the details", body: "Check required fields and your approval rules." },
        { title: "Run both actions", body: "Create or update the CRM record and notify your team." },
      ],
      status: "Handoff rules defined",
      diagram: {
        nodes: [
          { icon: "mail", label: "New inquiry", caption: "EMAIL OR FORM", x: 5, y: 19, step: 0, color: "#55baff" },
          { icon: "shield-check", label: "Validate details", caption: "RULES & APPROVALS", x: 35, y: 19, step: 1, color: "#b18aff" },
          { icon: "database", label: "Update CRM", caption: "RECORD SYNCED", x: 72, y: 19, step: 2, color: "#55e2a0" },
          { icon: "bell", label: "Notify team", caption: "OWNER ALERTED", x: 35, y: 65, step: 2, color: "#f07dcc" },
        ],
        edges: [
          { from: 0, to: 1 },
          { from: 1, to: 2 },
          { from: 1, to: 3, out: "bottom", in: "top" },
        ],
        note: "ONE TRIGGER · TWO CONNECTED ACTIONS",
      },
    },
    {
      kind: "build",
      name: "Websites & web apps",
      tag: "DESIGN, DEVELOPMENT & HOSTING",
      title: ["A better website.", "Built around your business."],
      description:
        "Custom landing pages, business websites, and full-stack applications, with hosting and ongoing support available.",
      color: "#6fa3ff",
      steps: [
        { title: "Structure the data", body: "Start with the information your application needs to store." },
        { title: "Build the logic", body: "Connect the data to useful features and interactions." },
        { title: "Bring it to life", body: "Turn the working system into a finished website, ready to launch." },
      ],
      status: "From structure to screen",
      footer: "Landing pages · Full-stack applications · Hosting & support",
    },
  ],
  finale: {
    eyebrow: "ONE CONNECTED OPERATING LAYER",
    title: { lines: ["The work moves.", "Your team stays in control."], emphasis: "Your team stays in control." },
    cta: { label: "Plan your first workflow", href: "#examples" },
  },
  navLabel: "Choose a service",
  footer: {
    disclaimer: "ILLUSTRATIVE WORKFLOWS · NOT A LIVE DASHBOARD",
    simplifyLabel: "Simplify motion",
    scrollHint: "SCROLL TO EXPLORE",
  },
};

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Timeline units: the intro occupies [0, INTRO), each chapter CHAPTER units,
// and the finale begins FINALE_OFFSET units into the last chapter, then holds
// FINALE_HOLD units before the pin releases.
const INTRO = 1;
const CHAPTER = 5;
const FINALE_OFFSET = 4.2;
const FINALE_HOLD = 0.8;
const SIMPLE_KEY = "dimensional-workflow-hero-simple";

const pad = (n: number) => String(n).padStart(2, "0");

function readSimplePreference() {
  try {
    return localStorage.getItem(SIMPLE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSimplePreference(simple: boolean) {
  try {
    if (simple) localStorage.setItem(SIMPLE_KEY, "1");
    else localStorage.removeItem(SIMPLE_KEY);
  } catch {
    // Storage blocked: the choice simply does not persist.
  }
}

function RichLines({ text }: { text: EmphasisText }) {
  return (
    <>
      {text.lines.map((line, i) => {
        const at = text.emphasis ? line.indexOf(text.emphasis) : -1;
        return (
          <Fragment key={i}>
            {i > 0 && <br />}
            {at < 0 ? (
              line
            ) : (
              <>
                {line.slice(0, at)}
                <em>{text.emphasis}</em>
                {line.slice(at + text.emphasis!.length)}
              </>
            )}
          </Fragment>
        );
      })}
    </>
  );
}

export type DimensionalWorkflowHeroProps = {
  content?: ScrollExperienceContent;
  accent?: string;
  className?: string;
  style?: CSSProperties;
  motion?: ScrollExperienceMotion;
};

export default function DimensionalWorkflowHero({ content = defaultHeroContent, motion, accent, className = "", style }: DimensionalWorkflowHeroProps) {
  const instanceId = `dimensional-${useId().replace(/:/g, "")}`;
  const chapters = content.chapters.length ? content.chapters : defaultHeroContent.chapters;
  const count = chapters.length;
  const viewportsPerChapter = Math.max(0.5, motion?.viewportsPerChapter ?? 1.35);
  const maxChapterScroll = Math.max(400, motion?.maxChapterScroll ?? 1350);
  const scrub = Math.max(0, motion?.scrub ?? 0.65);
  const finaleAt = INTRO + (count - 1) * CHAPTER + FINALE_OFFSET;

  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  // -1 intro, 0..count-1 chapters, count finale.
  const position = useRef(-1);
  const restorePosition = useRef<number | null>(null);
  const [simple, setSimple] = useState(readSimplePreference);

  const timeFor = (tl: gsap.core.Timeline, at: number) =>
    at < 0 ? 0 : at >= count ? finaleAt + 0.85 : tl.labels[`flow-${at}`];

  const scrollToPosition = (at: number, behavior: ScrollBehavior) => {
    const tl = timeline.current,
      trigger = tl?.scrollTrigger;
    if (tl && trigger) {
      window.scrollTo({
        top: trigger.start + (timeFor(tl, at) / tl.duration()) * (trigger.end - trigger.start),
        behavior,
      });
      return;
    }
    const element = root.current;
    const target =
      at < 0
        ? element
        : at >= count
          ? element?.querySelector(".flow-finale")
          : element?.querySelector(`[data-chapter="${at}"]`);
    target?.scrollIntoView({ behavior: "instant", block: "start" });
  };

  useGSAP(
    () => {
      const element = root.current!;
      const viewport = element.querySelector<HTMLElement>(".viewport")!;
      const media = gsap.matchMedia(element);
      const sections = [...element.querySelectorAll<HTMLElement>(".service-chapter")];
      let scaleFrame = 0;
      const resize = new ResizeObserver(() => {
        cancelAnimationFrame(scaleFrame);
        scaleFrame = requestAnimationFrame(() => {
          sections.forEach((section) => {
            const width = section.querySelector<HTMLElement>(".stage")?.clientWidth ?? section.clientWidth;
            const scale = String(Math.min(1, width / 800));
            if (section.style.getPropertyValue("--panel-scale") !== scale) {
              section.style.setProperty("--panel-scale", scale);
            }
          });
        });
      });
      sections.forEach((section) => resize.observe(section.querySelector(".stage")!));

      media.add(
        {
          desktop: "(min-width: 901px) and (min-height: 650px)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const animated = context.conditions?.desktop && context.conditions?.motion && !simple;
          element.classList.toggle("simple", !animated);
          if (!animated) return;

          const panels = [...element.querySelectorAll<HTMLElement>(".flow-panel")];
          const copies = [...element.querySelectorAll<HTMLElement>(".flow-copy")];
          const stages = [...element.querySelectorAll<HTMLElement>(".stage")];
          const nav = [...element.querySelectorAll<HTMLButtonElement>(".chapter-nav button")];
          const mid = (count - 1) / 2;
          const midIndex = Math.round(mid);

          // The stage moves by transform only; its CSS left/top stay the resting position.
          const stageAt = (left: number, top: number) => ({
            x: (_: number, el: HTMLElement) => viewport.clientWidth * left - el.offsetLeft,
            y: (_: number, el: HTMLElement) => viewport.clientHeight * top - el.offsetTop,
          });

          gsap.set(stages, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
          gsap.set(panels, {
            xPercent: -50,
            yPercent: -50,
            transformPerspective: 1500,
            transformOrigin: "50% 50%",
          });
          panels.forEach((p, i) =>
            gsap.set(p, {
              x: 60 + (i - mid) * 230,
              y: 35 + (i === midIndex ? -10 : 35),
              z: -i * 100,
              rotationY: -32,
              rotationX: 12,
              rotationZ: -3,
              scale: 0.68,
              autoAlpha: i === 0 ? 1 : 0.9,
              zIndex: count - i,
            }),
          );
          // Keep the fanned deck inside the viewport: pull the trailing cards in until the last one fits.
          for (let pass = 0; pass < 3 && count > 1; pass++) {
            const overflow =
              panels[count - 1].getBoundingClientRect().right - (viewport.clientWidth - 40);
            if (overflow <= 1) break;
            panels.forEach((p, i) => gsap.set(p, { x: `-=${(overflow * i) / (count - 1)}` }));
          }
          gsap.set(copies, { autoAlpha: 0, y: 20 });
          gsap.set(".flow-finale", { autoAlpha: 0, y: 30 });
          chapters.forEach((chapter, i) => {
            if (chapter.kind !== "build") return;
            const scenes = panels[i].querySelectorAll<HTMLElement>(".build-scene");
            gsap.set(scenes, { autoAlpha: 0, x: 35 });
            gsap.set(scenes[0], { autoAlpha: 1, x: 0 });
          });

          const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            onUpdate() {
              const time = this.time();
              const active =
                time < INTRO - 0.3 || time >= finaleAt
                  ? -1
                  : Math.min(count - 1, Math.max(0, Math.floor((time - INTRO) / CHAPTER)));
              position.current = time >= finaleAt ? count : active;
              nav.forEach((button, i) => {
                button.classList.toggle("active", i === active);
                if (i === active) button.setAttribute("aria-current", "step");
                else button.removeAttribute("aria-current");
              });
              copies.forEach((copy, i) => copy.setAttribute("aria-hidden", String(i !== active)));
            },
            scrollTrigger: {
              trigger: element.querySelector(".experience-section"),
              start: "top top",
              end: () =>
                `+=${Math.min(window.innerHeight * viewportsPerChapter, maxChapterScroll) * count}`,
              pin: viewport,
              scrub,
              invalidateOnRefresh: true,
            },
          });
          timeline.current = tl;

          tl.to(".intro", { autoAlpha: 0, y: -40, duration: 0.65 }, 0).to(
            stages,
            { ...stageAt(0.67, 0.45), duration: 1 },
            0,
          );

          chapters.forEach((chapter, i) => {
            const t = INTRO + i * CHAPTER;
            tl.addLabel(`flow-${i}`, t + 0.6);
            panels.forEach((panel, j) =>
              tl.to(
                panel,
                {
                  x: j === i ? 0 : j < i ? -580 : 530,
                  y: j === i ? 0 : 40,
                  z: j === i ? 50 : -500,
                  rotationY: j === i ? -8 : j < i ? 35 : -35,
                  rotationX: j === i ? 5 : 12,
                  rotationZ: 0,
                  scale: () => (j === i ? (window.innerWidth < 1100 ? 0.65 : 0.85) : 0.63),
                  autoAlpha: j === i ? 1 : 0,
                  zIndex: j === i ? 10 : 1,
                  duration: 1,
                },
                t - 0.7,
              ),
            );
            tl.to(copies[i], { autoAlpha: 1, y: 0, duration: 0.55 }, t);
            const items = copies[i].querySelectorAll("li");

            if (chapter.kind === "build") {
              const scenes = [...panels[i].querySelectorAll<HTMLElement>(".build-scene")];
              scenes.forEach((scene, j) => {
                const at = t + 0.35 + j * 1.08;
                if (j > 0)
                  tl.to(scenes[j - 1], { autoAlpha: 0, x: -35, duration: 0.35 }, at).to(
                    scene,
                    { autoAlpha: 1, x: 0, duration: 0.45 },
                    at + 0.1,
                  );
                if (items[j]) tl.to(items[j], { opacity: 1, duration: 0.3 }, at);
              });
            } else {
              tl.fromTo(
                panels[i].querySelector(".signal"),
                { strokeDashoffset: 0 },
                { strokeDashoffset: -290, duration: 3.4, ease: "none", immediateRender: false },
                t + 0.3,
              );
              chapter.steps.forEach((_, j) => {
                const at = t + 0.4 + j * 0.9;
                const faces = panels[i].querySelectorAll(`.node[data-step="${j}"] .node-face`);
                const glows = panels[i].querySelectorAll(`.node[data-step="${j}"] .node-glow`);
                if (!faces.length) return;
                tl.to(faces, { z: 45, y: -8, scale: 1.04, duration: 0.28 }, at)
                  .to(glows, { opacity: 1, duration: 0.28 }, at)
                  .to(faces, { z: 0, y: 0, scale: 1, duration: 0.25 }, at + 0.45)
                  .to(glows, { opacity: 0, duration: 0.25 }, at + 0.45);
                if (items[j]) tl.to(items[j], { opacity: 1, duration: 0.25 }, at);
              });
            }
            tl.to(copies[i], { autoAlpha: 0, y: -20, duration: 0.4 }, t + 3.8);
          });

          tl.to(stages, { ...stageAt(0.5, 0.48), duration: 1.1 }, finaleAt).to(
            ".chapter-nav,.scroll-hint",
            { autoAlpha: 0, duration: 0.5 },
            finaleAt,
          );
          panels.forEach((p, i) =>
            tl.to(
              p,
              {
                x: () => (i - mid) * Math.min(320, window.innerWidth * 0.25),
                y: i === midIndex ? 145 : -95,
                z: -200,
                scale: 0.57,
                rotationY: (i - mid) * -12,
                rotationX: 5,
                rotationZ: (i - mid) * 2,
                autoAlpha: 0.16,
                duration: 1.1,
              },
              finaleAt,
            ),
          );
          tl.to(".flow-finale", { autoAlpha: 1, y: 0, duration: 0.85 }, finaleAt + 0.55).to(
            {},
            { duration: FINALE_HOLD },
          );

          // A resize changes the pin length; keep the visitor at the same point in the story.
          const trigger = tl.scrollTrigger!;
          let resumeProgress: number | null = null;
          const rememberProgress = () => {
            resumeProgress = trigger.isActive ? trigger.progress : null;
          };
          const restoreProgress = () => {
            if (resumeProgress === null) return;
            const progress = resumeProgress;
            resumeProgress = null;
            window.scrollTo({
              top: trigger.start + progress * (trigger.end - trigger.start),
              behavior: "instant",
            });
          };
          ScrollTrigger.addEventListener("refreshInit", rememberProgress);
          ScrollTrigger.addEventListener("refresh", restoreProgress);

          return () => {
            ScrollTrigger.removeEventListener("refreshInit", rememberProgress);
            ScrollTrigger.removeEventListener("refresh", restoreProgress);
            timeline.current = null;
            copies.forEach((c) => c.removeAttribute("aria-hidden"));
            nav.forEach((n) => {
              n.classList.remove("active");
              n.removeAttribute("aria-current");
            });
          };
        },
      );

      // After a motion toggle, bring the same chapter back into view in the new layout.
      let frame = 0;
      if (restorePosition.current !== null) {
        const at = restorePosition.current;
        restorePosition.current = null;
        frame = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          scrollToPosition(at, "instant");
        });
      }

      let mounted = true;
      document.fonts.ready.then(() => {
        if (mounted) ScrollTrigger.refresh();
      });
      return () => {
        mounted = false;
        cancelAnimationFrame(frame);
        cancelAnimationFrame(scaleFrame);
        resize.disconnect();
        media.revert();
      };
    },
    { scope: root, dependencies: [simple], revertOnUpdate: true },
  );

  // In the static layout, the chapter whose top has passed 40% of the viewport is the one being read.
  const staticPosition = () => {
    const element = root.current;
    if (!element) return -1;
    const line = window.innerHeight * 0.4;
    const finale = element.querySelector(".flow-finale");
    if (finale && finale.getBoundingClientRect().top <= line) return count;
    let at = -1;
    chapters.forEach((_, i) => {
      const section = element.querySelector(`[data-chapter="${i}"]`);
      if (section && section.getBoundingClientRect().top <= line) at = i;
    });
    return at;
  };

  const toggleSimple = () => {
    restorePosition.current = timeline.current ? position.current : staticPosition();
    writeSimplePreference(!simple);
    setSimple(!simple);
  };

  return (
    <div ref={root} className={`af-experience simple ${className}`} style={{ ...(accent ? { "--color-hero-accent": accent } : {}), ...style } as CSSProperties}>
      <style>{heroStyles}</style>
      <a className="skip" href={content.skip.target}>
        {content.skip.label}
      </a>
      <section className="experience-section" id={instanceId} aria-label={content.ariaLabel}>
        <div className="viewport">
          <div className="ambient" />
          <div className="intro">
            <p className="eyebrow">
              <span />
              {content.intro.eyebrow}
            </p>
            <h1>
              <RichLines text={content.intro.title} />
            </h1>
            <p className="intro-description">
              {content.intro.description.map((line, i) => (
                <Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </p>
            <button className="primary" onClick={() => scrollToPosition(0, "smooth")}>
              {content.intro.cta} <span aria-hidden="true">↓</span>
            </button>
          </div>
          <div className="chapter-copy">
            {chapters.map((chapter, i) => (
              <section
                className="service-chapter"
                id={`${instanceId}-flow-${i}`}
                data-chapter={i}
                key={chapter.name}
                style={{ "--accent": chapter.color } as CSSProperties}
              >
                <article className="flow-copy">
                  <p className="eyebrow">{chapter.tag}</p>
                  <h2>
                    {chapter.title.map((line, j) => (
                      <span key={line}>
                        {j > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </h2>
                  <p className="flow-description">{chapter.description}</p>
                  <ol>
                    {chapter.steps.map((step, j) => (
                      <li key={step.title}>
                        <span>{pad(j + 1)}</span>
                        <div>
                          <h3>{step.title}</h3>
                          <p>{step.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </article>
                <div className="stage" aria-hidden="true">
                  <div className="world">
                    <div
                      className={`flow-panel diagram-${i}${chapter.kind === "build" ? " development-panel" : ""}`}
                    >
                      {chapter.kind === "build" ? (
                        <DevelopmentPanel chapter={chapter} />
                      ) : (
                        <WorkflowPanel chapter={chapter} />
                      )}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
          <div className="flow-finale">
            <p className="eyebrow">{content.finale.eyebrow}</p>
            <h2>
              <RichLines text={content.finale.title} />
            </h2>
            <a className="primary" href={content.finale.cta.href}>
              {content.finale.cta.label} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <nav className="chapter-nav" aria-label={content.navLabel}>
            {chapters.map((chapter, i) => (
              <button key={chapter.name} onClick={() => scrollToPosition(i, "smooth")}>
                {chapter.name}
                <i />
              </button>
            ))}
          </nav>
          <div className="experience-footer">
            <span className="demo-label">{content.footer.disclaimer}</span>
            <button className="motion-toggle" aria-pressed={simple} onClick={toggleSimple}>
              {content.footer.simplifyLabel}
            </button>
            <span className="scroll-hint">
              {content.footer.scrollHint} <b aria-hidden="true">↓</b>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
